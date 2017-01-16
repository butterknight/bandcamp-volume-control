var StorageService = function () {
    console.log('Initialising Storage Service');
    this.init();
};

StorageService.prototype.init = function () {
    this._storageType = 'local';
};

StorageService.prototype.saveVolume = function (volume) {
    console.log('Saving Volume...', volume);
    chrome.storage[this._storageType].set({ 'bk_bvc_volume': volume }, function () {
        console.log('-- Volume saved, yay! - ' + volume);
    });
};

StorageService.prototype.restoreVolume = function (callback) {
    console.log('Restoring Volume...');
    chrome.storage[this._storageType].get(null, volumeLoaded);

    function volumeLoaded(values) {
        console.log('-- Storage:', values);
        var vol = values['bk_bvc_volume'] ? +(values['bk_bvc_volume']) : null;
        if (typeof vol !== 'number' || volumeOutOfBounds(vol)) {
            console.log('-- Volume value not valid. Resetting...');
            vol = 0.72;
        }
        if (typeof callback === 'function') {
            console.log('-- Volume value restored. Resuming...');
            callback(vol);
        }
    }

    function volumeOutOfBounds(volume) {
        return volume > 1 || volume < 0;
    }
};