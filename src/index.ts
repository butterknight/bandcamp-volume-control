import { BandcampVolumeControl } from './bandcamp-volume-control';
import { eventService, playerService, storageService } from './services/injector';

try {
  new BandcampVolumeControl(eventService, playerService, storageService);
} catch (ex) {
  console.log('BandcampVolumeControl - Error:', ex);
}
