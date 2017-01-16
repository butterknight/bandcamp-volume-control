var MarkupControlPage = function (BVC) {
    MarkupControlBase.call(this, BVC);
    console.log('Initialising markup control page');
};

MarkupControlPage.prototype = Object.create(MarkupControlBase.prototype);
MarkupControlPage.prototype.constructor = MarkupControlPage;


MarkupControlPage.prototype.captureBandCampElements = function () {
    var backgroundElement = window.getComputedStyle(document.getElementById('pgBd')),
        handleStyles = window.getComputedStyle(document.querySelector('.inline_player .thumb'));

    console.log('Capturing BandCamp elements');
    this.elements.bcContainer = document.querySelector('#trackInfoInner .inline_player');
    this.elements.bcWrapper = this.elements.bcContainer;

    this.styles = {
        progBarBackgroundColor: backgroundElement.backgroundColor,
        border: handleStyles.borderTopWidth + ' solid ' + handleStyles.borderTopColor,
        handleBackgroundColor: handleStyles.backgroundColor
    };
};

MarkupControlPage.prototype.generateMarkup = function () {
    console.log('Generating volume control markup');
    var $wrapper,
        $progressBar,
        $progressBarBackground,
        $handle,
        $volumeValue;

    $wrapper = document.createElement('div');
    $wrapper.id = 'bk_wrapper';
    $wrapper.className = 'bk_wrapper bk_page';
    $wrapper.setAttribute('style', 'position: absolute; width: 100%; padding: 6px; bottom: -24px; z-index: 1000;');

    $progressBar = document.createElement('div');
    $progressBar.className = 'bk_progress_bar';
    $progressBar.setAttribute('style', 'width: 78%;');

    $progressBarBackground = document.createElement('div');
    $progressBarBackground.id = 'bk_progress_bg';
    $progressBarBackground.className = 'bk_progress_bar_background';
    $progressBarBackground.setAttribute('style', 'position: relative; height: 6px; background-color: rgba(240, 240, 240, 0.72); border-color: rgba(12, 12, 12, 0.24);');
    $progressBarBackground.style.backgroundColor = this.styles.progBarBackgroundColor;
    $progressBarBackground.style.border = this.styles.border;

    $handle = document.createElement('div');
    $handle.id = 'bk_handle';
    $handle.className = 'bk_handle';
    $handle.setAttribute('style', 'position: relative; background-color: #eee; border-color: border-color: rgba(12, 12, 12, 0.24); height: 12px; width: 24px; top: -4px; border-radius: 12px; cursor: pointer;');
    $handle.style.backgroundColor = this.styles.handleBackgroundColor;
    $handle.style.border = this.styles.border;

    $volumeValue = document.createElement('span');
    $volumeValue.id = 'bk_volume';
    $volumeValue.className = 'bk_volume_value';
    $volumeValue.setAttribute('style', 'position: absolute; right: 8px; border-radius: 2px; background: rgba(12, 12, 12, 0.72); color: #f0f0f0; padding: 2px 4px; font-size: 10px; bottom: 0;');

    $progressBarBackground.appendChild($handle);
    $progressBar.appendChild($progressBarBackground);
    $wrapper.appendChild($progressBar);
    $wrapper.appendChild($volumeValue);

    this._markup = $wrapper;
};

MarkupControlPage.prototype.adjustPlayerStyles = function () {
    console.log('Adjusting BandCamp player styles');
    document.querySelector('#trackInfoInner .inline_player').style.marginBottom = '30px';
};