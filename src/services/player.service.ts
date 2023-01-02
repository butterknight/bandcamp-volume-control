import { PlayerType } from '../enums/player-type.enum';
import { DomService } from './dom.service';

export class PlayerService {
  private players: Array<HTMLAudioElement> = [];
  private type: PlayerType | undefined;

  public constructor(private readonly domService: DomService) {}

  public get playerType(): PlayerType {
    return this.type!;
  }

  public init(): void {
    this.type = this.getPlayerType();
    this.players = this.getPlayers();
  }

  public setVolume(value: number): void {
    this.players.forEach((player: HTMLAudioElement) => (player.volume = value));
  }

  private getPlayers(): Array<HTMLAudioElement> {
    const players: Array<HTMLAudioElement> | null = this.domService.captureElements<HTMLAudioElement>('audio');

    if (!players?.length) {
      console.error('I could not find a Bandcamp Player on the page 🥺');
    }

    return players;
  }

  public getPlayerType(): PlayerType {
    const url: string = this.domService.getUrl();
    let type: PlayerType;

    if (this.isEmbededPlayer(url)) {
      if (this.isLargePlayer(url)) {
        type = PlayerType.Large;
      } else if (this.isSmallPlayer(url)) {
        type = PlayerType.Small;
      } else {
        type = PlayerType.Unsupported;
        console.error("Sorry, but this player type isn't currently supported.");
      }
    } else {
      if (this.isDiscoverPlayer()) {
        type = PlayerType.Discover;
      } else if (this.isPagePlayer()) {
        type = PlayerType.Page;
      } else {
        type = PlayerType.Unsupported;
        console.error("Sorry, but this player type isn't currently supported.");
      }
    }

    return type;
  }

  private isEmbededPlayer(url: string): boolean {
    return url.includes('EmbeddedPlayer');
  }

  private isLargePlayer(url: string): boolean {
    return url.indexOf('size=large') > -1 && url.indexOf('artwork') < 0;
  }

  private isSmallPlayer(url: string): boolean {
    return (
      (url.indexOf('size=large') > -1 && url.indexOf('artwork=small') > -1) ||
      (url.indexOf('size=large') > -1 && url.indexOf('artwork=none') > -1)
    );
  }

  private isDiscoverPlayer(): boolean {
    return Boolean(this.domService.captureElement('#discover'));
  }

  private isPagePlayer(): boolean {
    return Boolean(this.domService.captureElement('#trackInfo'));
  }
}
