# Volume Control for Bandcamp Player

## Foreword

I got really tired of not being able to control the volume of Bandcamp audio players so I thought about trying to fix that for myself. This extension is primarily made for my own personal use, but I figured if someone else can use it as well, why not try and help.

## How this thing works

The extension works by searching for HTML5 audio players on any Bandcamp page (including the embedded players on other websites), hooking into their HTML markup where the buttons (well, Play/Pause button) and progress slider are and adding in a volume slider that can control said player's volume. 

The slider takes some of the styles from Bandcamp's own player to fit the visual style so it should look fairly consistent. It's nothing too fancy, but it gets the job done. The volume slider handle is a bit more rounded to make it easier to discern it from the regular song progress bar.

The volume is saved every time it's changed and the value should persist across multiple players. So if you save a volume at 42% on one page and open up another one (it doesn't matter if it's embedded or not), the volume should default to 42% in that one, too. This eliminates the need to constantly reset it if you're browsing multiple pages quickly. Note that if there are multiple embedded players in the same page, changing volume of one will **not** instantly affect any other. Also, only the last value changed (regardless of the player) will be saved.

## Supported pages

This extension should work on Bandcamp pages and any other page that normally embeds the Bandcamp player. There are, however, some pages that seem to embed the player directly, and the extension does not work on those by default. The reason for that is increased security, as no one wants this extension to run on _any_ page you visit, so it's usage is restricted by URL (web page address). 

In order to make this work on custom Bandcamp domains, they need to be manually added to permitted URLs. The extension already comes with a few supported domains by default, and if you know of another that you'd like to see supported, open a request and I'll add it as soon as possible.

If you wish to suggest a domain for support, you can use [this form](https://github.com/butterknight/bandcamp-volume-control/issues/new?assignees=butterknight&labels=custom-domain-request&template=custom_domain_request.yml&title=%5BCustomDomain%5D%3A+)

## Important notices

- Currently on Bandcamp's Discover page one slider controls **all** found audio player page elements until I figure out which is which. I don't use that page enough to actually know the consequences of that yet
- Those very tiny players aren't currently supported at all

## Permissions

The extension only requires `storage` permissions (so it can save the volume level), and access to the content of any Bandcamp (`https://*.bandcamp.com/`) page (so it can find the player, markup, etc.).

Aside from the Bandcamp domain, a number of additional custom domains is supported as well:

- https://music.monstercat.com/*
- https://shop.attackthemusic.com/*
- https://listen.20buckspin.com/*

You can use [this form](https://github.com/butterknight/bandcamp-volume-control/issues/new?assignees=butterknight&labels=custom-domain-request&template=custom_domain_request.yml&title=%5BCustomDomain%5D%3A+) if you wish to suggest new ones to be added.

## Changelog

#### v1.0.1 _(Jan 3, 2023)_

- fix an utterly dreadful issue where the extension wouldn't load

#### v1.0.0 _(Jan 2, 2023)_

- complete rewrite of the extension (so it's easier to maintain)

#### v2.3.0 _(Feb 10, 2017)_

- initial version of the extension

## Development

You will need to have `node.js` installed.

Install the dependencies by running `npm ci`.

Build the compiled file by running `npm run build`. The compiled code will be created in the `dist` folder.

## License

Copyright 2017, 2023

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.