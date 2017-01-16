var BandcampVolumeControl = function () {
    console.log('Bandcamp Volume Control loaded!');
};

BandcampVolumeControl.prototype.init = function () {
    var BVC = this;
    this.type = this.findType();
    this.players = this.findPlayers();

    this.markupControl = MarkupControlFactory.getMarkupControlByType(this.type);
    this.markupControl.activate(this);

    this.storage = new StorageService();
    this.storage.restoreVolume(function (volume) {
        BVC.updateVolume.call(BVC, volume);
    });

    console.log('Bandcamp Volume Control activated!');
};

BandcampVolumeControl.prototype.findType = function () {
    var url = window.location.href,
        type;
    if (isEmbededPlayer()) {
        if (isLargePlayer()) {
            type = 'large';
        }
        else if (isSmallPlayer()) {
            type = 'small';
        }
        else {
            type = 'unsupported';
            throw new Error("Sorry, but this player type isn't currently supported.");
        }
    }
    else {
        if (document.getElementById('discover')) {
            type = 'discover';
        }
        else if (document.getElementById('trackInfo')) {
            type = 'page';
        }
        else {
            type = 'unsupported';
            throw new Error("Sorry, but this player type isn't currently supported.");
        }
    }

    return type;

    function isEmbededPlayer() {
        return url.indexOf('EmbeddedPlayer') > -1;
    }

    function isLargePlayer() {
        return url.indexOf('size=large') > -1
            && url.indexOf('artwork') < 0;
    }
    function isSmallPlayer() {
        return url.indexOf('size=large') > -1 && url.indexOf('artwork=small') > -1
            || url.indexOf('size=large') > -1 && url.indexOf('artwork=none') > -1;
    }
};

BandcampVolumeControl.prototype.findPlayers = function () {
    var players = document.getElementsByTagName('audio');
    if (players) {
        return players;
    }
    else {
        throw new Error("Sorry buddy, but I could not find a Bandcamp Player :'(");
    }
};

BandcampVolumeControl.prototype.updateVolume = function (volume, manualUpdate) {
    console.log('--updating volume manually:', volume);
    console.log(this.players);
    for (var i = 0; i < this.players.length; i++) {
        console.log('--setting player', i, 'volume', volume);
        this.players[i].volume = volume;
    }
    this.markupControl.updateVolume(volume, manualUpdate);
};

BandcampVolumeControl.prototype.saveVolume = function (volume) {
    this.storage.saveVolume(volume);
};
