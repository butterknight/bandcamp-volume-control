"use strict";
(() => {
  // src/services/dom-manipulation-service.ts
  var DomManipulationService = class {
    constructor(element) {
      this.element = element;
    }
    get el() {
      return this.element;
    }
    setId(id) {
      var _a;
      (_a = this.element) == null ? void 0 : _a.setAttribute("id", id);
      return this;
    }
    setClass(classOrList) {
      var _a;
      if (Array.isArray(classOrList)) {
        classOrList.forEach((className) => {
          var _a2;
          return (_a2 = this.el) == null ? void 0 : _a2.classList.add(className);
        });
      } else if (typeof classOrList === "string") {
        (_a = this.el) == null ? void 0 : _a.classList.add(classOrList);
      }
      return this;
    }
    setStyles(styles) {
      if (typeof styles === "string") {
        this.el.setAttribute("style", styles);
      } else {
        Object.keys(styles).forEach(
          (property) => this.el.style[property] = styles[property]
        );
      }
      return this;
    }
    setAttributes(attributes) {
      Object.keys(attributes).forEach((name) => this.el.setAttribute(name, attributes[name]));
      return this;
    }
  };

  // src/services/dom.service.ts
  var DomService = class {
    constructor(document2, window2) {
      this.document = document2;
      this.window = window2;
    }
    getUrl() {
      return this.window.location.href;
    }
    createElement(tagName) {
      return this.document.createElement(tagName);
    }
    createDiv() {
      return this.document.createElement("div");
    }
    createSpan() {
      return this.document.createElement("span");
    }
    manipulate(element) {
      return new DomManipulationService(element);
    }
    createAndManipulate(tagName) {
      return this.manipulate(this.createElement(tagName));
    }
    captureAndManipulate(query, parentElement = null) {
      return this.manipulate(this.captureElement(query, parentElement));
    }
    getStyles(element) {
      return this.window.getComputedStyle(element);
    }
    captureElement(query, parentElement = null) {
      return (parentElement || this.document).querySelector(query);
    }
    captureElements(query, parentElement = null) {
      return Array.from((parentElement || this.document).querySelectorAll(query));
    }
    removeElement(element, parentElement) {
      parentElement == null ? void 0 : parentElement.removeChild(element);
    }
    addElement(element, parentElement) {
      parentElement == null ? void 0 : parentElement.appendChild(element);
    }
    getControlElements() {
      return {
        controlWrapper: this.captureElement("#bk_wrapper"),
        controlProgress: this.captureElement("#bk_progress_bg"),
        controlHandle: this.captureElement("#bk_handle"),
        controlVolume: this.captureElement("#bk_volume")
      };
    }
    attachEvent(element, event, handler) {
      element.addEventListener(event, handler);
    }
    attachDocumentEvent(event, handler) {
      this.document.addEventListener(event, handler);
    }
    attachWindowEvent(event, handler) {
      this.window.addEventListener(event, handler);
    }
    hasErrors() {
      const errorElements = this.captureElements(".inline_player .error");
      return errorElements.some((errorElement) => {
        var _a;
        return ((_a = errorElement.style) == null ? void 0 : _a.visibility) === "visible";
      });
    }
    getElementLeftOffset(element) {
      const rect = element.getBoundingClientRect();
      return rect.left + this.document.body.scrollLeft;
    }
  };

  // src/services/event-service.ts
  var EventService = class {
    constructor() {
      this.listeners = {};
    }
    emit(name, value) {
      const listeners = this.listeners[name];
      if (!listeners) {
        return;
      }
      listeners.forEach((listener) => {
        listener(value);
      });
    }
    listen(name, listener) {
      if (!this.listeners[name]) {
        this.listeners[name] = [];
      }
      this.listeners[name].push(listener);
    }
    remove(name, listener) {
      const listeners = this.listeners[name];
      if (!listeners) {
        return;
      }
      const index = listeners.indexOf(listener);
      listeners.splice(index, 1);
    }
  };

  // src/services/player.service.ts
  var PlayerService = class {
    constructor(domService2) {
      this.domService = domService2;
      this.players = [];
    }
    get playerType() {
      return this.type;
    }
    init() {
      this.type = this.getPlayerType();
      this.players = this.getPlayers();
    }
    setVolume(value) {
      this.players.forEach((player) => player.volume = value);
    }
    getPlayers() {
      const players = this.domService.captureElements("audio");
      if (!(players == null ? void 0 : players.length)) {
        console.log("I could not find a Bandcamp Player on the page \u{1F97A}");
      }
      return players;
    }
    getPlayerType() {
      const url = this.domService.getUrl();
      let type;
      if (this.isEmbededPlayer(url)) {
        if (this.isLargePlayer(url)) {
          type = "large" /* Large */;
        } else if (this.isSmallPlayer(url)) {
          type = "small" /* Small */;
        } else {
          type = "unsupported" /* Unsupported */;
          console.log("Sorry, but this player type isn't currently supported.");
        }
      } else {
        if (this.isDiscoverPlayer()) {
          type = "discover" /* Discover */;
        } else if (this.isPagePlayer()) {
          type = "page" /* Page */;
        } else {
          type = "unsupported" /* Unsupported */;
          console.log("Sorry, but this player type isn't currently supported.");
        }
      }
      return type;
    }
    isEmbededPlayer(url) {
      return url.includes("EmbeddedPlayer");
    }
    isLargePlayer(url) {
      return url.indexOf("size=large") > -1 && url.indexOf("artwork") < 0;
    }
    isSmallPlayer(url) {
      return url.indexOf("size=large") > -1 && url.indexOf("artwork=small") > -1 || url.indexOf("size=large") > -1 && url.indexOf("artwork=none") > -1;
    }
    isDiscoverPlayer() {
      return Boolean(this.domService.captureElement("#discover"));
    }
    isPagePlayer() {
      return Boolean(this.domService.captureElement("#trackInfo"));
    }
  };

  // src/services/storage.service.ts
  var StorageService = class {
    constructor(storage) {
      this.storage = storage;
    }
    save(state, callback) {
      this.storage.set(state, () => {
        if (callback) {
          callback();
        }
      });
    }
    load(callback) {
      this.storage.get(null, (state) => {
        const volume = this.normaliseVolume(state.bk_bvc_volume);
        callback(volume);
      });
    }
    normaliseVolume(value) {
      const defaultValue = 0.72;
      const numberValue = value && +value;
      if (!numberValue || numberValue < 0 || numberValue > 100) {
        return defaultValue;
      } else {
        return numberValue;
      }
    }
  };

  // src/services/injector.ts
  var eventService = new EventService();
  var storageService = new StorageService(chrome.storage.local);
  var domService = new DomService(document, window);
  var playerService = new PlayerService(domService);

  // src/markup/abstract-markup-control.ts
  var AbstractMarkupControl = class {
    constructor(domService2, eventService2) {
      this.domService = domService2;
      this.eventService = eventService2;
      this.handleState = this.getInitialHandleState();
      this.bandcampElements = this.captureBandcampElements();
      this.styles = this.captureBandcampStyles();
      this.markup = this.generateMarkup();
      this.checkForErrors();
      this.adjustPlayerStyles();
      this.reloadMarkup();
      this.controlElements = this.captureControlElements();
      this.attachEvents();
    }
    updateVolume(volume, isManualChange = false) {
      const volumePercentage = Math.round(volume * 100);
      const text = `Vol: ${volumePercentage} %`;
      this.controlElements.controlVolume.textContent = text;
      if (!isManualChange) {
        this.updateHandlePosition(this.getHandlePositionByVolume(volume));
      }
    }
    captureControlElements() {
      return this.domService.getControlElements();
    }
    getInitialHandleState() {
      return {
        clicked: false,
        deltaX: 0,
        lastHandlePosition: 0
      };
    }
    reloadMarkup() {
      const existingControl = this.domService.captureElement(
        "#bk_wrapper",
        this.bandcampElements.bcWrapper
      );
      if (existingControl) {
        this.domService.removeElement(existingControl, this.bandcampElements.bcWrapper);
      }
      this.domService.addElement(this.markup, this.bandcampElements.bcWrapper);
    }
    checkForErrors() {
      if (this.domService.hasErrors()) {
        console.log("Player has errors. Quitting");
      }
    }
    attachEvents() {
      this.domService.attachEvent(
        this.controlElements.controlHandle,
        "mousedown",
        this.mouseDown.bind(this)
      );
      this.domService.attachDocumentEvent("mousemove", this.mouseMove.bind(this));
      this.domService.attachWindowEvent("mouseup", this.mouseUp.bind(this));
    }
    mouseDown(event) {
      this.handleState.clicked = true;
      this.handleState.deltaX = event.offsetX;
      return false;
    }
    mouseUp(event) {
      if (this.handleState.clicked) {
        this.handleState.clicked = false;
        this.eventService.emit(
          "handle_release" /* HandleRelease */,
          this.normaliseVolumeByPosition(this.handleState.lastHandlePosition)
        );
      }
    }
    mouseMove(event) {
      if (this.handleState.clicked) {
        this.handleState.lastHandlePosition = this.getCurrentHandlePosition(event);
        this.updateHandlePosition(this.handleState.lastHandlePosition);
        this.eventService.emit("handle_move" /* HandleMove */, this.normaliseVolumeByPosition(this.handleState.lastHandlePosition));
      }
    }
    getCurrentHandlePosition(event) {
      const progBarLeft = this.domService.getElementLeftOffset(this.controlElements.controlProgress);
      let posX = event.pageX - progBarLeft - this.handleState.deltaX;
      if (posX < 0) {
        posX = 0;
      }
      if (posX > this.controlElements.controlProgress.clientWidth - this.controlElements.controlHandle.clientWidth) {
        posX = this.controlElements.controlProgress.clientWidth - this.controlElements.controlHandle.clientWidth;
      }
      return posX;
    }
    getHandlePositionByVolume(volume) {
      const handleWidth = this.controlElements.controlHandle.clientWidth;
      const progbarWidth = this.controlElements.controlProgress.clientWidth;
      const trackWidth = progbarWidth - handleWidth;
      const position = trackWidth * volume;
      return position;
    }
    normaliseVolumeByPosition(position) {
      const handleWidth = this.controlElements.controlHandle.clientWidth;
      const progbarWidth = this.controlElements.controlProgress.clientWidth;
      const trackWidth = progbarWidth - handleWidth;
      let volume = position / trackWidth;
      if (volume < 0) {
        volume = 0;
      } else if (volume > 1) {
        volume = 1;
      }
      return volume;
    }
    updateHandlePosition(position) {
      this.domService.manipulate(this.controlElements.controlHandle).setStyles({ left: `${position}px` });
    }
  };

  // src/markup/markups/markup-control-discover.ts
  var MarkupControlDiscover = class extends AbstractMarkupControl {
    captureBandcampElements() {
      const bcContainer = this.domService.captureElement(
        ".discover-detail-inner .inline_player"
      );
      return {
        bcContainer,
        bcWrapper: this.domService.captureElement("tbody", bcContainer)
      };
    }
    captureBandcampStyles() {
      const backgroundElementStyles = this.domService.getStyles(
        this.domService.captureElement(".inline_player .progbar_empty")
      );
      const handleElementStyles = this.domService.getStyles(
        this.domService.captureElement(".inline_player .thumb")
      );
      return {
        colour: "#f0f0f0",
        handleBackgroundColor: handleElementStyles.backgroundColor,
        handleBorder: "1px solid " + handleElementStyles.borderColor,
        progBarBackgroundColor: backgroundElementStyles.backgroundColor,
        progBarBorder: handleElementStyles.borderTopWidth + " solid " + handleElementStyles.borderTopColor,
        volumeBackgroundColor: "rgba(12, 12, 12, 0.72)",
        volumeBorder: "1px solid rgba(12, 12, 12, 0.3)"
      };
    }
    generateMarkup() {
      const wrapperRow = this.domService.createAndManipulate("tr").el;
      const wrapperCol = this.domService.createAndManipulate("td").setAttributes({ colspan: "3" }).el;
      const wrapper = this.domService.createAndManipulate("div").setId("bk_wrapper").setClass(["bk_wrapper", "bk_small"]).setStyles({
        position: "relative",
        width: "auto",
        padding: "4px 10px",
        zIndex: "10"
      }).el;
      const progressBarWrapper = this.domService.createAndManipulate("div").setClass("bk_progress_bar_wrapper").setStyles({
        position: "relative",
        width: "100%",
        margin: "0",
        padding: "0"
      }).el;
      const progressBar = this.domService.createAndManipulate("div").setClass("bk_progress_bar").setStyles({ width: "72%" }).el;
      const progressBarBackground = this.domService.createAndManipulate("div").setId("bk_progress_bg").setClass("bk_progress_bar_background").setStyles({
        position: "relative",
        height: "6px",
        backgroundColor: this.styles.progBarBackgroundColor,
        border: this.styles.progBarBorder
      }).el;
      const handle = this.domService.createAndManipulate("div").setId("bk_handle").setClass("bk_handle").setStyles({
        position: "relative",
        height: "8px",
        width: "20px",
        top: "-2px",
        borderRadius: "1px",
        cursor: "pointer",
        backgroundColor: this.styles.handleBackgroundColor,
        border: this.styles.handleBorder
      }).el;
      const volumeValue = this.domService.createAndManipulate("span").setId("bk_volume").setClass("bk_volume_value").setStyles({
        position: "absolute",
        right: "8px",
        borderRadius: "2px",
        background: this.styles.volumeBackgroundColor,
        border: this.styles.volumeBorder,
        color: this.styles.colour,
        padding: "1px 4px",
        fontSize: "10px",
        bottom: "0"
      }).el;
      this.domService.addElement(handle, progressBarBackground);
      this.domService.addElement(progressBarBackground, progressBar);
      this.domService.addElement(progressBar, progressBarWrapper);
      this.domService.addElement(progressBarWrapper, wrapper);
      this.domService.addElement(volumeValue, wrapper);
      this.domService.addElement(wrapper, wrapperCol);
      this.domService.addElement(wrapperCol, wrapperRow);
      return wrapperRow;
    }
    adjustPlayerStyles() {
      this.domService.captureAndManipulate(".discover-detail-inner .track_cell").setStyles({ height: "24px", verticalAlign: "top", paddingTop: "4px" });
      this.domService.captureAndManipulate(".discover-detail-inner .play_cell").setAttributes({ rowspan: "3" });
    }
  };

  // src/markup/markups/markup-control-large.ts
  var MarkupControlLarge = class extends AbstractMarkupControl {
    captureBandcampElements() {
      const bcContainer = this.domService.captureElement("#player");
      return {
        bcContainer,
        bcWrapper: bcContainer
      };
    }
    captureBandcampStyles() {
      const backgroundElementStyles = this.domService.getStyles(
        this.domService.captureElement("#nonartarea")
      );
      const handleElementStyles = this.domService.getStyles(
        this.domService.captureElement("#progbar_thumb")
      );
      return {
        colour: "#f0f0f0",
        handleBackgroundColor: handleElementStyles.backgroundColor,
        handleBorder: "1px solid " + handleElementStyles.borderColor,
        progBarBackgroundColor: backgroundElementStyles.backgroundColor,
        progBarBorder: "1px solid " + backgroundElementStyles.borderColor,
        volumeBackgroundColor: "rgba(12, 12, 12, 0.72)",
        volumeBorder: "1px solid rgba(12, 12, 12, 0.3)"
      };
    }
    generateMarkup() {
      const artArea = this.domService.captureElement("#artarea");
      const artAreaHeight = artArea.clientHeight;
      const wrapper = this.domService.manipulate(this.domService.createDiv()).setId("bk_wrapper").setClass(["bk_wrapper", "bk_large"]).setStyles({
        position: "absolute",
        width: "100%",
        padding: "6px",
        top: `${artAreaHeight - 28}px`,
        zIndex: "10"
      }).el;
      const progressBar = this.domService.manipulate(this.domService.createDiv()).setClass("bk_progress_bar").setStyles({ width: "78%" }).el;
      const progressBarBackground = this.domService.manipulate(this.domService.createDiv()).setId("bk_progress_bg").setClass("bk_progress_bar_background").setStyles({
        position: "relative",
        height: "8px",
        backgroundColor: this.styles.progBarBackgroundColor,
        border: this.styles.progBarBorder
      }).el;
      const handle = this.domService.manipulate(this.domService.createDiv()).setId("bk_handle").setClass("bk_handle").setStyles({
        position: "relative",
        height: "10px",
        width: "24px",
        top: "-2px",
        borderRadius: "1px",
        cursor: "pointer",
        backgroundColor: this.styles.handleBackgroundColor,
        border: this.styles.handleBorder
      }).el;
      const volumeValue = this.domService.manipulate(this.domService.createSpan()).setId("bk_volume").setClass("bk_volume_value").setStyles({
        position: "absolute",
        right: "8px",
        bottom: "0",
        background: this.styles.volumeBackgroundColor,
        border: this.styles.volumeBorder,
        borderRadius: "2px",
        color: this.styles.colour,
        fontSize: "10px",
        padding: "1px 4px"
      }).el;
      this.domService.addElement(handle, progressBarBackground);
      this.domService.addElement(progressBarBackground, progressBar);
      this.domService.addElement(progressBar, wrapper);
      this.domService.addElement(volumeValue, wrapper);
      return wrapper;
    }
    adjustPlayerStyles() {
      this.domService.manipulate(this.domService.captureElement("#big_play_button")).setStyles({ bottom: "10%" });
      this.domService.manipulate(this.domService.captureElement("#artarea .logo")).setStyles({ bottom: "10%" });
    }
  };

  // src/markup/markups/markup-control-page.ts
  var MarkupControlPage = class extends AbstractMarkupControl {
    captureBandcampElements() {
      const bcContainer = this.domService.captureElement("#trackInfoInner .inline_player");
      return {
        bcContainer,
        bcWrapper: bcContainer
      };
    }
    captureBandcampStyles() {
      const backgroundElementStyles = this.domService.getStyles(
        this.domService.captureElement(".inline_player .progbar_empty")
      );
      const handleElementStyles = this.domService.getStyles(
        this.domService.captureElement(".inline_player .thumb")
      );
      const textStyles = this.domService.getStyles(
        this.domService.captureElement(".inline_player .title")
      );
      return {
        colour: textStyles.color,
        handleBackgroundColor: handleElementStyles.backgroundColor,
        handleBorder: "1px solid " + handleElementStyles.borderTopColor,
        progBarBackgroundColor: backgroundElementStyles.backgroundColor,
        progBarBorder: "1px solid " + backgroundElementStyles.borderTopColor,
        volumeBackgroundColor: backgroundElementStyles.backgroundColor,
        volumeBorder: "1px solid " + handleElementStyles.borderTopColor
      };
    }
    generateMarkup() {
      const wrapper = this.domService.manipulate(this.domService.createDiv()).setId("bk_wrapper").setClass(["bk_wrapper", "bk_page"]).setStyles({
        position: "absolute",
        width: "100%",
        padding: "6px",
        bottom: "-24px",
        zIndex: "10"
      }).el;
      const progressBar = this.domService.manipulate(this.domService.createDiv()).setClass("bk_progress_bar").setStyles({ width: "78%" }).el;
      const progressBarBackground = this.domService.manipulate(this.domService.createDiv()).setId("bk_progress_bg").setClass("bk_progress_bar_background").setStyles({
        position: "relative",
        height: "6px",
        backgroundColor: this.styles.progBarBackgroundColor,
        border: this.styles.progBarBorder
      }).el;
      const handle = this.domService.manipulate(this.domService.createDiv()).setId("bk_handle").setClass("bk_handle").setStyles({
        position: "relative",
        height: "8px",
        width: "18px",
        top: "-2px",
        borderRadius: "1px",
        cursor: "pointer",
        backgroundColor: this.styles.handleBackgroundColor,
        border: this.styles.handleBorder
      }).el;
      const volumeValue = this.domService.manipulate(this.domService.createSpan()).setId("bk_volume").setClass("bk_volume_value").setStyles({
        position: "absolute",
        right: "8px",
        border: this.styles.volumeBorder,
        borderRadius: "2px",
        background: this.styles.volumeBackgroundColor,
        color: this.styles.colour,
        padding: "1px 4px",
        fontSize: "10px",
        bottom: "0"
      }).el;
      this.domService.addElement(handle, progressBarBackground);
      this.domService.addElement(progressBarBackground, progressBar);
      this.domService.addElement(progressBar, wrapper);
      this.domService.addElement(volumeValue, wrapper);
      return wrapper;
    }
    adjustPlayerStyles() {
      this.domService.manipulate(this.domService.captureElement("#trackInfoInner .inline_player")).setStyles({ marginBottom: "30px" });
    }
  };

  // src/markup/markups/markup-control-small.ts
  var MarkupControlSmall = class extends AbstractMarkupControl {
    captureBandcampElements() {
      const bcContainer = this.domService.captureElement("#infolayer .info");
      return {
        bcContainer,
        bcWrapper: bcContainer
      };
    }
    captureBandcampStyles() {
      const backgroundElementStyles = this.domService.getStyles(
        this.domService.captureElement("#timeline .progbar_empty")
      );
      const handleElementStyles = this.domService.getStyles(
        this.domService.captureElement("#progbar_thumb")
      );
      return {
        colour: "#f0f0f0",
        handleBackgroundColor: handleElementStyles.backgroundColor,
        handleBorder: "1px solid " + handleElementStyles.borderColor,
        progBarBackgroundColor: backgroundElementStyles.backgroundColor,
        progBarBorder: "1px solid " + backgroundElementStyles.borderColor,
        volumeBackgroundColor: "rgba(12, 12, 12, 0.72)",
        volumeBorder: "1px solid rgba(12, 12, 12, 0.3)"
      };
    }
    generateMarkup() {
      const wrapper = this.domService.manipulate(this.domService.createDiv()).setId("bk_wrapper").setClass(["bk_wrapper", "bk_small"]).setStyles({
        position: "absolute",
        width: "100%",
        padding: "6px 12px 6px 67px",
        bottom: "3%",
        zIndex: "10"
      }).el;
      const progressBarWrapper = this.domService.manipulate(this.domService.createDiv()).setClass("bk_progress_bar_wrapper").setStyles({
        position: "relative",
        width: "100%",
        margin: "0",
        padding: "0"
      }).el;
      const progressBar = this.domService.manipulate(this.domService.createDiv()).setClass("bk_progress_bar").setStyles({ width: "72%" }).el;
      const progressBarBackground = this.domService.manipulate(this.domService.createDiv()).setId("bk_progress_bg").setClass("bk_progress_bar_background").setStyles({
        position: "relative",
        height: "8px",
        backgroundColor: this.styles.progBarBackgroundColor,
        border: this.styles.progBarBorder
      }).el;
      const handle = this.domService.manipulate(this.domService.createDiv()).setId("bk_handle").setClass("bk_handle").setStyles({
        position: "relative",
        height: "10px",
        width: "20px",
        top: "-2px",
        borderRadius: "1px",
        cursor: "pointer",
        backgroundColor: this.styles.handleBackgroundColor,
        border: this.styles.handleBorder
      }).el;
      const volumeValue = this.domService.manipulate(this.domService.createSpan()).setId("bk_volume").setClass("bk_volume_value").setStyles({
        position: "absolute",
        right: "8px",
        background: this.styles.volumeBackgroundColor,
        border: this.styles.volumeBorder,
        borderRadius: "2px",
        color: this.styles.colour,
        padding: "1px 4px",
        fontSize: "10px",
        bottom: "0"
      }).el;
      this.domService.addElement(handle, progressBarBackground);
      this.domService.addElement(progressBarBackground, progressBar);
      this.domService.addElement(progressBar, progressBarWrapper);
      this.domService.addElement(progressBarWrapper, wrapper);
      this.domService.addElement(volumeValue, wrapper);
      return wrapper;
    }
    adjustPlayerStyles() {
      this.domService.manipulate(this.domService.captureElement("#infolayer .logo .icon")).setStyles({ top: "2px" });
      this.domService.manipulate(this.domService.captureElement("#maintext")).setStyles({ marginTop: "0" });
      this.domService.manipulate(this.domService.captureElement("#linkarea")).setStyles({ marginTop: "0" });
      this.domService.manipulate(this.domService.captureElement("#currenttitlerow")).setStyles({ marginTop: "0", paddingTop: "0" });
      this.domService.manipulate(this.domService.captureElement("#big_play_button")).setStyles({ bottom: "28px" });
    }
  };

  // src/markup/markup-factory.ts
  function markupFactory(type) {
    switch (type) {
      case "small" /* Small */:
        return new MarkupControlSmall(domService, eventService);
      case "large" /* Large */:
        return new MarkupControlLarge(domService, eventService);
      case "page" /* Page */:
        return new MarkupControlPage(domService, eventService);
      case "discover" /* Discover */:
        return new MarkupControlDiscover(domService, eventService);
      default:
        console.log("Sorry, but this type of a player is not supported.");
        return void 0;
    }
  }

  // src/bandcamp-volume-control.ts
  var BandcampVolumeControl = class {
    constructor(eventService2, playerService2, storageService2) {
      this.eventService = eventService2;
      this.playerService = playerService2;
      this.storageService = storageService2;
      this.markupControl = this.init();
      if (!this.markupControl) {
        return;
      }
      this.attachEvents();
      this.loadVolume();
    }
    init() {
      this.playerService.init();
      return markupFactory(this.playerService.playerType);
    }
    attachEvents() {
      this.eventService.listen("handle_move" /* HandleMove */, this.updateVolume.bind(this));
      this.eventService.listen("handle_release" /* HandleRelease */, this.saveVolume.bind(this));
    }
    saveVolume(volume) {
      this.storageService.save({ bk_bvc_volume: volume });
    }
    updateVolume(volume, isManualChange = true) {
      var _a;
      this.playerService.setVolume(volume);
      (_a = this.markupControl) == null ? void 0 : _a.updateVolume(volume, isManualChange);
    }
    loadVolume() {
      this.storageService.load((volume) => {
        this.updateVolume(volume, false);
      });
    }
  };

  // src/index.ts
  try {
    new BandcampVolumeControl(eventService, playerService, storageService);
  } catch (ex) {
    console.log("BandcampVolumeControl - Error:", ex);
  }
})();
//# sourceMappingURL=content.js.map
