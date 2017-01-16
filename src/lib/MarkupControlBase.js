var MarkupControlBase = function () {
    this.init();
};

MarkupControlBase.prototype.init = function () {
    this.elements = {};
    this.state = {
        clicked: false,
        deltaX: 0,
        lastHandlePosition: 0,
    };
    this.captureBandCampElements();
    this.generateMarkup();
};

MarkupControlBase.prototype.activate = function (bandcampVolumeControl) {
    console.log('Activating volume control');
    this.BVC = bandcampVolumeControl;
    this.checkForErrors();
    this.adjustPlayerStyles();
    this.reLoadMarkup();
    this.captureNewElements();
    this.attachEvents();
};

MarkupControlBase.prototype.captureNewElements = function () {
    console.log('Capturing Volume Control elements');
    this.elements.controlWrapper = document.getElementById('bk_wrapper');
    this.elements.controlProgress = document.getElementById('bk_progress_bg');
    this.elements.controlHandle = document.getElementById('bk_handle');
    this.elements.controlVolume = document.getElementById('bk_volume');
};

MarkupControlBase.prototype.reLoadMarkup = function () {
    var existingControl = this.elements.bcWrapper.querySelector('#bk_wrapper');
    if (existingControl) {
        this.element.bcWrapper.removeChild(existingControl);
    }
    this.elements.bcWrapper.appendChild(this._markup);
};

MarkupControlBase.prototype.updateVolume = function (volume, manualUpdate) {
    var volumePercentage = Math.round(volume * 100),
        text = 'Vol: ' + volumePercentage + '%';
    console.log('Updating volume display to:', text, 'manual:', manualUpdate);
    this.elements.controlVolume.textContent = text;
    if (!manualUpdate) {
        this.updateHandlePosition(this.getHandlePositionByVolume(volume));
    }
};

MarkupControlBase.prototype.attachEvents = function () {
    var MCB = this;
    console.log('Attaching events');
    this.elements.controlHandle.addEventListener('mousedown', mouseDown);
    document.addEventListener('mousemove', mouseMove);
    window.addEventListener('mouseup', mouseUp);

    function mouseDown(ev) {
        return MCB.mouseDown.call(MCB, ev);
    }

    function mouseMove(ev) {
        return MCB.mouseMove.call(MCB, ev);
    }

    function mouseUp(ev) {
        return MCB.mouseUp.call(MCB, ev);
    }
};

MarkupControlBase.prototype.mouseDown = function (ev) {
    console.log('Volume handle clicked');
    this.state.clicked = true;
    this.state.deltaX = ev.offsetX;

    return false;
};

MarkupControlBase.prototype.mouseMove = function (ev) {
    if (this.state.clicked) {
        this.state.lastHandlePosition = this.getCurrentHandlePosition(ev);
        this.updateHandlePosition(this.state.lastHandlePosition);
        this.BVC.updateVolume(this.normaliseVolumeByPosition(this.state.lastHandlePosition), true);
    }
};

MarkupControlBase.prototype.mouseUp = function () {
    if (this.state.clicked) {
        this.state.clicked = false;
        this.BVC.saveVolume(this.normaliseVolumeByPosition(this.state.lastHandlePosition));
    }
};

MarkupControlBase.prototype.getCurrentHandlePosition = function (ev) {
    var progBarLeft = this.getElementLeftOffset(this.elements.controlProgress),
        posX = ev.pageX - progBarLeft - this.state.deltaX;

    if (posX < 0) {
        posX = 0;
    }
    if (posX > this.elements.controlProgress.clientWidth - this.elements.controlHandle.clientWidth) {
        posX = this.elements.controlProgress.clientWidth - this.elements.controlHandle.clientWidth;
    }
    return posX;
};

MarkupControlBase.prototype.normaliseVolumeByPosition = function (position) {
    var handleWidth = this.elements.controlHandle.clientWidth,
        progbarWidth = this.elements.controlProgress.clientWidth,
        trackWidth = progbarWidth - handleWidth,
        volume = position / trackWidth;

    if (volume < 0) {
        volume = 0;
    }
    else if (volume > 1) {
        volume = 1;
    }

    return volume;
};

MarkupControlBase.prototype.getHandlePositionByVolume = function (volume) {
    var handleWidth = this.elements.controlHandle.clientWidth,
        progbarWidth = this.elements.controlProgress.clientWidth,
        trackWidth = progbarWidth - handleWidth,
        position = trackWidth * volume;

    return position;
};

MarkupControlBase.prototype.getElementLeftOffset = function (element) {
    var rect = element.getBoundingClientRect();
    return rect.left + document.body.scrollLeft;
};

MarkupControlBase.prototype.updateHandlePosition = function (position) {
    this.elements.controlHandle.style.left = (position) + 'px';
};

MarkupControlBase.prototype.checkForErrors = function () {
    console.log('Checking for errors in the player...');
    var errorElements = document.querySelectorAll('.inline_player .error');
    for (var i = 0; i < errorElements.length; i++) {
        if (errorElements[i].style && errorElements[i].style.visibility === 'visible') {
            throw new Error("Player has errors. Quitting");
        }
    }
};