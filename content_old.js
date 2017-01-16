'use_strict';

(function () {

    init();

    function init() {
        if (playerHasErrors()) { return; }

        var type = determinePlayerType();
        if (!typeIsSupported(type)) {
            return;
        }
        var player = findPlayer(),
            $markupContainer = findVolumeControlContainer(type),
            $markupWrapper = findVolumeControlWrapperFromMarkupContainerByType($markupContainer, type),
            markup = generateVolumeControkMarkupByType(type),
            clicked = false,
            deltaX = 0;

        if (!player) { return; }

        $markupWrapper.innerHTML += markup;
        
        var $handle = $markupWrapper.querySelector('#bk_volume_handle'),
            $progBar = $markupWrapper.querySelector('.progbar_empty'),
            $volume = $markupWrapper.querySelector('#bk_volume_value');

        adjustPlayerMarkupByType(type);
        
        $handle.addEventListener('mousedown', mouseDown);
        document.addEventListener('mousemove', mouseMove);
        window.addEventListener('mouseup', mouseUp);
        
        restoreVolume(function (volume) {
            player.volume = volume;
            $handle.style.left = normaliseHandlePosition(player.volume) + 'px';
            displayVolumeByType(type);
        });

        function mouseDown(e) {
            clicked = true;
            deltaX = e.offsetX;
            return false;
        }

        function mouseMove(e) {
            if (clicked) {
                var progBarLeft = getLeftOffset($progBar),
                    posX = e.pageX - progBarLeft - deltaX;

                if (posX < 0) {
                    posX = 0;
                }
                if (posX > $progBar.clientWidth - $handle.clientWidth) {
                    posX = $progBar.clientWidth - $handle.clientWidth;
                }
                $handle.style.left = (posX) + 'px';
                player.volume = normaliseHandleVolume(posX);
                displayVolumeByType(type);
            }
        }

        function mouseUp() {
            clicked = false;
            saveVolume(player.volume);
        }

        function normaliseHandleVolume(position) {
            var handleWidth = $handle.clientWidth,
                progbarWidth = $progBar.clientWidth,
                trackWidth = progbarWidth - handleWidth,
                volume = position / trackWidth;

            if (volume < 0) {
                volume = 0;
            }
            else if (volume > 1) {
                volume = 1;
            }

            return volume;
        }

        function normaliseHandlePosition(volume) {
            var handleWidth = $handle.clientWidth,
                progbarWidth = $progBar.clientWidth,
                trackWidth = progbarWidth - handleWidth,
                position = trackWidth * volume;

            return position;
        }

        function displayVolumeByType(type) {
            var vol = Math.round(player.volume * 100);
            switch (type) {
                case 'page':
                case 'large':
                case 'small':
                    $volume.textContent = 'Vol: ' + vol + '%';
                    break;
            }
        }

    }

    function playerHasErrors() {
        var errors = document.querySelectorAll('.inline_player .error'),
            hasError = false;
        errors.forEach(function (item) {
            if (item.style.visibility === 'visible') {
                hasError = true;
                return;
            }
        });
        return hasError;
    }

    function determinePlayerType() {
        var url = window.location.href,
            type;
        if (url.indexOf('EmbeddedPlayer') > -1) {
            if (url.indexOf('size=large') > -1 &&
                url.indexOf('artwork=small') < 0) {
                type = 'large';
            }
            else if (url.indexOf('size=large') > -1 &&
                url.indexOf('artwork=small') > -1 ||
                url.indexOf('artwork=none') > -1) {
                type = 'small';
            }
            else {
                type = 'unsupported';
            }
        }

        return type || 'page';
    }

    function typeIsSupported(type) {
        switch (type) {
            case 'large':
            case 'small':
            case 'page':
                return true;
        }

        return false;
    }

    function findPlayer() {
        return document.querySelector('audio');
    }

    function findVolumeControlContainer(type) {
        var $controlContainer;

        switch (type) {
            case 'large':
                $controlContainer = document.querySelector('.inline_player #artarea');
                break;
            case 'small':
                $controlContainer = document.querySelector('.inline_player #infolayer .info');
                break;
            case 'page':
            default:
                $controlContainer = document.querySelector('.inline_player');
                break;
        }

        return $controlContainer;
    }

    function findVolumeControlWrapperFromMarkupContainerByType(container, type) {
        var $controlWrapper;

        switch (type) {
            case 'large':
                $controlWrapper = container;
                break;
            case 'small':
                $controlWrapper = container;
                break;
            case 'page':
                $controlWrapper = container.querySelector('tbody');
                break;
        }

        return $controlWrapper;
    }

    function generateVolumeControkMarkupByType(type) {
        var $markup = '';
        switch (type) {
            case 'large':
                $markup += '<div class="bk_volume_wrapper" style="position: absolute; width: 100%; padding: 6px; bottom: 2.4%;">'
                    + '<div class="progbar" style="width: 78%"><div class="progbar_empty" style="position: relative"><div class="thumb" id="bk_volume_handle"></div></div></div>'
                    + '<span id="bk_volume_value" class="bk_volume_value" style="position: absolute; right: 8px; border-radius: 2px; background: rgba(0, 0, 0, 0.72); color: #fff; padding: 4px; font-size: 0.9em; bottom: -4px;"></span>'
                    + '</div>';
                break;
            case 'small':
                $markup += '<div class="bk_volume_wrapper" style="position: absolute; width: 100%; padding: 6px 12px 6px 67px; bottom: 3%;">'
                    + '<div class="progbar_wrapper" style="position: relative; width: 100%; margin: 0; padding: 0;">'
                    + '<div class="progbar" style="width: 72%"><div class="progbar_empty" style="position: relative"><div class="thumb" id="bk_volume_handle"></div></div></div>'
                    + '<span id="bk_volume_value" class="bk_volume_value" style="position: absolute; right: 8px; border-radius: 2px; background: rgba(0, 0, 0, 0.72); color: #fff; padding: 4px; font-size: 11px; line-height: 1; bottom: -6px;"></span>'
                    + '</div>'
                    + '</div>';
                break;
            case 'page':
            default:
                $markup += '<tr class="bk_volume_wrapper">'
                    + '<td></td>'
                    + '<td><div class="progbar"><div class="progbar_empty" style="position: relative"><div class="thumb" id="bk_volume_handle"></div></div></div></td>'
                    + '<td><span id="bk_volume_value" class="bk_volume_value"></span></td>'
                    + '</tr>';
        }

        return $markup;
    }

    function adjustPlayerMarkupByType(type) {
        switch (type) {
            case 'large':
                document.querySelector('#artarea #big_play_button').style.bottom = '10%';
                document.querySelector('#artarea .logo').style.bottom = '10%';
                break;
            case 'small':
                document.querySelector('#infolayer .logo .icon').style.top = '2px';
                document.querySelector('#infolayer #maintext').style.marginTop = '0';
                document.querySelector('#infolayer #linkarea').style.marginTop = '0';
                document.querySelector('#infolayer #currenttitlerow').style.marginTop = '0';
                document.querySelector('#infolayer #currenttitlerow').style.paddingTop = '0';
                document.querySelector('#big_play_button').style.bottom = '28px';
                break;
        }
    }

    function getLeftOffset(element) {
        var rect = element.getBoundingClientRect();
        return rect.left + document.body.scrollLeft;
    }

    function saveVolume(volume) {
        chrome.storage.local.set({ 'bk_bandcamp_volume': volume }, function () {
            // Volume saved yay!
        });
    }

    function restoreVolume(callback) {
        chrome.storage.local.get('bk_bandcamp_volume', function (values) {
            var vol = +(values['bk_bandcamp_volume']);
            if (typeof vol !== 'number' || (vol > 1 || vol < 0)) {
                vol = 0.72;
            }
            if (typeof callback === 'function') {
                callback(vol);
            }
        });
    }
})();