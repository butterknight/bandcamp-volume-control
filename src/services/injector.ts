import { DomService } from './dom.service';
import { EventService } from './event-service';
import { PlayerService } from './player.service';
import { StorageService } from './storage.service';

export const eventService: EventService = new EventService();
export const storageService: StorageService = new StorageService(chrome.storage.local);
export const domService: DomService = new DomService(document, window);
export const playerService: PlayerService = new PlayerService(domService);
