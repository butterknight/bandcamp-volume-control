var MarkupControlDiscover = function (BVC) {
    MarkupControlBase.call(this, BVC);
    console.log('Initialising markup control small');
};

MarkupControlDiscover.prototype = Object.create(MarkupControlBase.prototype);
MarkupControlDiscover.prototype.constructor = MarkupControlDiscover;


MarkupControlDiscover.prototype.captureBandCampElements = function () {
    var backgroundElement = window.getComputedStyle(document.querySelector('.inline_player .progbar_empty')),
        handleStyles = window.getComputedStyle(document.querySelector('.inline_player .thumb'));

    console.log('Capturing BandCamp elements');
    this.elements.bcContainer = document.querySelector('.discover-detail-inner .inline_player');
    this.elements.bcWrapper = this.elements.bcContainer.querySelector('tbody');

    this.styles = {
        progBarBackgroundColor: backgroundElement.backgroundColor,
        border: handleStyles.borderTopWidth + ' solid ' + handleStyles.borderTopColor,
        handleBackgroundColor: handleStyles.backgroundColor
    };
};

MarkupControlDiscover.prototype.generateMarkup = function () {
    console.log('Generating volume control markup');
    var $wrapperRow,
        $wrapperCol,
        $wrapper,
        $progressBarWrapper,
        $progressBar,
        $progressBarBackground,
        $handle,
        $volumeValue;

    $wrapperRow = document.createElement('tr');

    $wrapperCol = document.createElement('td');
    $wrapperCol.setAttribute('colspan', '3');

    $wrapper = document.createElement('div');
    $wrapper.id = 'bk_wrapper';
    $wrapper.className = 'bk_wrapper bk_small';
    $wrapper.setAttribute('style', 'position: relative; width: auto; padding: 4px 10px; z-index: 1000');

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
    $wrapperCol.appendChild($wrapper);
    $wrapperRow.appendChild($wrapperCol);

    this._markup = $wrapperRow;
};

MarkupControlDiscover.prototype.adjustPlayerStyles = function () {
    console.log('Adjusting BandCamp player styles');

    document.querySelector('.discover-detail-inner .track_cell')
        .setAttribute('style', 'height: 24px; vertical-align: top; padding-top: 4px');
    document.querySelector('.discover-detail-inner .play_cell')
        .setAttribute('rowspan', '3');
    // document.querySelector('.discover-detail-inner .track_cell').style.height = '24px';
    // document.querySelector('#maintext').style.marginTop = '0';
    // document.querySelector('#linkarea').style.marginTop = '0';
    // document.querySelector('#currenttitlerow').style.marginTop = '0';
    // document.querySelector('#currenttitlerow').style.paddingTop = '0';
    // document.querySelector('#big_play_button').style.bottom = '28px';
};