# Volume Control for Bandcamp Player

## Foreword

I got really tired of not being able to control the volume of Bandcamp audio players so I thought about trying to fix that for myself. This extension is primarily made for my own personal use, but I figured if someone else can use it as well, why not try and help.

## How this thing works

The extension works by searching for HTML5 audio players on any Bandcamp page (including the embedded players on other websites), hooking into their HTML markup where the buttons (well, Play/Pause button) and progress slider are and adding in a volume slider that can control said player's volume. 

The slider takes some of the styles from Bandcamp's own player to fit the visual style so it should look fairly consistent. It's nothing too fancy, but it gets the job done. The volume slider handle is a bit more rounded to make it easier to discern it from the regular song progress bar.

The volume is saved every time it's changed and the value should persist across multiple players. So if you save a volume at 42% on one page and open up another one (it doesn't matter if it's embedded or not), the volume should default to 42% in that one, too. This eliminates the need to constantly reset it if you're browsing multiple pages quickly. Note that if there are multiple embedded players in the same page, changing volume of one will **not** instantly affect any other. Also, only the last value changed (regardless of the player) will be saved.

Note that currently on Bandcamp's Discover page one slider controls **all** audio players until I figure out which is which.

## Permissions

The extension only requires `storage` permissions (so it can save the volume level), and access to the content of any Bandcamp (`https://*.bandcamp.com/`) page (so it can find the player, markup, etc.).

## License

Copyright 2017

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.