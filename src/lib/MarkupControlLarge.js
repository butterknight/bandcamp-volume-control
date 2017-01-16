var MarkupControlLarge = function (BVC) {
    MarkupControlBase.call(this, BVC);

    console.log('Initialising markup control large');
};

MarkupControlLarge.prototype = Object.create(MarkupControlBase.prototype);
MarkupControlLarge.prototype.constructor = MarkupControlLarge;


MarkupControlLarge.prototype.captureBandCampElements = function () {
    var backgroundElement = window.getComputedStyle(document.getElementById('nonartarea')),
        handleStyles = window.getComputedStyle(document.getElementById('progbar_thumb'));

    console.log('Capturing BandCamp elements');
    this.elements.bcContainer = document.getElementById('nonartarea');
    this.elements.bcWrapper = this.elements.bcContainer;

    this.styles = {
        progBarBackgroundColor: backgroundElement.backgroundColor,
        border: handleStyles.borderTopWidth + ' solid ' + handleStyles.borderTopColor,
        handleBackgroundColor: handleStyles.backgroundColor
    };
};

MarkupControlLarge.prototype.generateMarkup = function () {
    console.log('Generating volume control markup');
    var $wrapper,
        $progressBar,
        $progressBarBackground,
        $handle,
        $volumeValue;

    $wrapper = document.createElement('div');
    $wrapper.id = 'bk_wrapper bk_large';
    $wrapper.className = 'bk_wrapper';
    $wrapper.setAttribute('style', 'position: absolute; width: 100%; padding: 6px; top: -26px; z-index: 1000;');

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

MarkupControlLarge.prototype.adjustPlayerStyles = function () {
    console.log('Adjusting BandCamp player styles');
    document.querySelector('#big_play_button').style.bottom = '10%';
    document.querySelector('#artarea .logo').style.bottom = '10%';
    document.querySelector('#nonartarea').style.position = 'relative';
};