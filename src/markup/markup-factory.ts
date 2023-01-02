import { PlayerType } from '../enums/player-type.enum';
import { domService, eventService } from '../services/injector';
import { AbstractMarkupControl } from './abstract-markup-control';
import { MarkupControlDiscover } from './markups/markup-control-discover';
import { MarkupControlLarge } from './markups/markup-control-large';
import { MarkupControlPage } from './markups/markup-control-page';
import { MarkupControlSmall } from './markups/markup-control-small';

export function markupFactory(type: PlayerType): AbstractMarkupControl | undefined {
  switch (type) {
    case PlayerType.Small:
      return new MarkupControlSmall(domService, eventService);
    case PlayerType.Large:
      return new MarkupControlLarge(domService, eventService);
    case PlayerType.Page:
      return new MarkupControlPage(domService, eventService);
    case PlayerType.Discover:
      return new MarkupControlDiscover(domService, eventService);
    default:
      console.log('Sorry, but this type of a player is not supported.');
      return undefined;
  }
}
