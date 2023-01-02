import { EventType } from './enums/events.enum';
import { AbstractMarkupControl } from './markup/abstract-markup-control';
import { markupFactory } from './markup/markup-factory';
import { EventService } from './services/event-service';
import { PlayerService } from './services/player.service';
import { StorageService } from './services/storage.service';

export class BandcampVolumeControl {
  private markupControl: AbstractMarkupControl | undefined;

  constructor(
    private readonly eventService: EventService,
    private readonly playerService: PlayerService,
    private readonly storageService: StorageService,
  ) {
    this.markupControl = this.init();
    if (!this.markupControl) {
      return;
    }

    this.attachEvents();
    this.loadVolume();
  }

  private init(): AbstractMarkupControl | undefined {
    this.playerService.init();
    return markupFactory(this.playerService.playerType);
  }

  private attachEvents(): void {
    this.eventService.listen(EventType.HandleMove, this.updateVolume.bind(this));
    this.eventService.listen(EventType.HandleRelease, this.saveVolume.bind(this));
  }

  private saveVolume(volume: number) {
    this.storageService.save({ bk_bvc_volume: volume });
  }

  private updateVolume(volume: number, isManualChange = true) {
    this.playerService.setVolume(volume);
    this.markupControl?.updateVolume(volume, isManualChange);
  }

  private loadVolume(): void {
    this.storageService.load((volume: number) => {
      this.updateVolume(volume, false);
    });
  }
}
