var MarkupControlSmall = function (BVC) {
    MarkupControlBase.call(this, BVC);
    console.log('Initialising markup control small');
};

MarkupControlSmall.prototype = Object.create(MarkupControlBase.prototype);
MarkupControlSmall.prototype.constructor = MarkupControlSmall;


MarkupControlSmall.prototype.captureBandCampElements = function () {
    var backgroundElement = window.getComputedStyle(document.getElementById('nonartarea')),
        handleStyles = window.getComputedStyle(document.querySelector('.inline_player .thumb'));

    console.log('Capturing BandCamp elements');
    this.elements.bcContainer = document.querySelector('#infolayer .info');
    this.elements.bcWrapper = this.elements.bcContainer;

    this.styles = {
        progBarBackgroundColor: backgroundElement.backgroundColor,
        border: handleStyles.borderTopWidth + ' solid ' + handleStyles.borderTopColor,
        handleBackgroundColor: handleStyles.backgroundColor
    };
};

MarkupControlSmall.prototype.generateMarkup = function () {
    console.log('Generating volume control markup');
    var $wrapper,
        $progressBarWrapper,
        $progressBar,
        $progressBarBackground,
        $handle,
        $volumeValue;

    $wrapper = document.createElement('div');
    $wrapper.id = 'bk_wrapper';
    $wrapper.className = 'bk_wrapper bk_small';
    $wrapper.setAttribute('style', 'position: absolute; width: 100%; padding: 6px 12px 6px 67px; bottom: 3%; z-index: 1000;');

    $progressBarWrapper = document.createElement('div');
    $progressBarWrapper.className = 'bk_progress_bar_wrapper';
    $progressBarWrapper.setAttribute('style', 'position: relative; width: 100%; margin: 0; padding: 0;');

    $progressBar = document.createElement('div');
    $progressBar.className = 'bk_progress_bar';
    $progressBar.setAttribute('style', 'width: 72%;');

    $progressBarBackground = document.createElement('div');
    $progressBarBackground.id = 'bk_progress_bg';
    $progressBarBackground.className = 'bk_progress_bar_background';
    $progressBarBackground.setAttribute('style', 'position: relative; height: 6px;');
    $progressBarBackground.style.backgroundColor = this.styles.progBarBackgroundColor;
    $progressBarBackground.style.border = this.styles.border;

    $handle = document.createElement('div');
    $handle.id = 'bk_handle';
    $handle.className = 'bk_handle';
    $handle.setAttribute('style', 'position: relative; border-radius: 12px; cursor: pointer; height: 12px; width: 24px; top: -4px;');
    $handle.style.backgroundColor = this.styles.handleBackgroundColor;
    $handle.style.border = this.styles.border;

    $volumeValue = document.createElement('span');
    $volumeValue.id = 'bk_volume';
    $volumeValue.className = 'bk_volume_value';
    $volumeValue.setAttribute('style', 'position: absolute; right: 8px; border-radius: 2px; background: rgba(12, 12, 12, 0.72); color: #f0f0f0; padding: 2px 4px; font-size: 10px; bottom: 0;');

    $progressBarBackground.appendChild($handle);
    $progressBar.appendChild($progressBarBackground);
    $progressBarWrapper.appendChild($progressBar);
    $wrapper.appendChild($progressBarWrapper);
    $wrapper.appendChild($volumeValue);

    this._markup = $wrapper;
};

MarkupControlSmall.prototype.adjustPlayerStyles = function () {
    console.log('Adjusting BandCamp player styles');

    document.querySelector('#infolayer .logo .icon').style.top = '2px';
    document.querySelector('#maintext').style.marginTop = '0';
    document.querySelector('#linkarea').style.marginTop = '0';
    document.querySelector('#currenttitlerow').style.marginTop = '0';
    document.querySelector('#currenttitlerow').style.paddingTop = '0';
    document.querySelector('#big_play_button').style.bottom = '28px';
};
