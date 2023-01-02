import { EventType } from '../enums/events.enum';
import { DomService } from '../services/dom.service';
import { EventService } from '../services/event-service';
import { IBandcampElements, IControlElements } from './interfaces/elements.interface';
import { IState } from './interfaces/state.interface';
import { IBandcampStyles } from './interfaces/styles.interface';

export abstract class AbstractMarkupControl {
  protected controlElements: IControlElements;
  protected bandcampElements: IBandcampElements;
  protected styles: IBandcampStyles;
  protected handleState: IState;
  protected markup: HTMLElement;

  constructor(protected readonly domService: DomService, protected readonly eventService: EventService) {
    this.handleState = this.getInitialHandleState();
    this.bandcampElements = this.captureBandcampElements();
    this.styles = this.captureBandcampStyles();
    this.markup = this.generateMarkup();

    this.checkForErrors();
    this.adjustPlayerStyles();
    this.reloadMarkup();
    this.controlElements = this.captureControlElements();
    this.attachEvents();
  }

  protected abstract captureBandcampElements(): IBandcampElements;
  protected abstract captureBandcampStyles(): IBandcampStyles;
  protected abstract generateMarkup<T extends HTMLElement>(): T;
  protected abstract adjustPlayerStyles(): void;

  public updateVolume(volume: number, isManualChange = false): void {
    const volumePercentage = Math.round(volume * 100);
    const text = `Vol: ${volumePercentage} %`;
    this.controlElements.controlVolume!.textContent = text;

    if (!isManualChange) {
      this.updateHandlePosition(this.getHandlePositionByVolume(volume));
    }
  }

  private captureControlElements(): IControlElements {
    return this.domService.getControlElements();
  }

  private getInitialHandleState(): IState {
    return {
      clicked: false,
      deltaX: 0,
      lastHandlePosition: 0,
    };
  }

  private reloadMarkup(): void {
    const existingControl: HTMLDivElement | null = this.domService.captureElement<HTMLDivElement>(
      '#bk_wrapper',
      this.bandcampElements.bcWrapper,
    );

    if (existingControl) {
      this.domService.removeElement(existingControl, this.bandcampElements.bcWrapper!);
    }

    this.domService.addElement(this.markup, this.bandcampElements.bcWrapper!);
  }

  private checkForErrors(): void {
    if (this.domService.hasErrors()) {
      console.error('Player has errors. Quitting');
    }
  }

  private attachEvents(): void {
    this.domService.attachEvent<'mousedown'>(
      this.controlElements.controlHandle!,
      'mousedown',
      this.mouseDown.bind(this),
    );
    this.domService.attachDocumentEvent<'mousemove'>('mousemove', this.mouseMove.bind(this));
    this.domService.attachWindowEvent<'mouseup'>('mouseup', this.mouseUp.bind(this));
  }

  private mouseDown(event: MouseEvent): any {
    this.handleState.clicked = true;
    this.handleState.deltaX = event.offsetX;

    return false;
  }

  private mouseUp(event: MouseEvent): any {
    if (this.handleState.clicked) {
      this.handleState.clicked = false;
      this.eventService.emit(
        EventType.HandleRelease,
        this.normaliseVolumeByPosition(this.handleState.lastHandlePosition),
      );
      // this.BVC.saveVolume(this.normaliseVolumeByPosition(this.state.lastHandlePosition));
    }
  }

  private mouseMove(event: MouseEvent): any {
    if (this.handleState.clicked) {
      this.handleState.lastHandlePosition = this.getCurrentHandlePosition(event);
      this.updateHandlePosition(this.handleState.lastHandlePosition);
      // this.BVC.updateVolume(this.normaliseVolumeByPosition(this.state.lastHandlePosition), true);
      this.eventService.emit(EventType.HandleMove, this.normaliseVolumeByPosition(this.handleState.lastHandlePosition));
    }
  }

  private getCurrentHandlePosition(event: MouseEvent): number {
    const progBarLeft: number = this.domService.getElementLeftOffset(this.controlElements.controlProgress!);
    let posX = event.pageX - progBarLeft - this.handleState.deltaX;

    if (posX < 0) {
      posX = 0;
    }

    if (posX > this.controlElements.controlProgress!.clientWidth - this.controlElements.controlHandle!.clientWidth) {
      posX = this.controlElements.controlProgress!.clientWidth - this.controlElements.controlHandle!.clientWidth;
    }
    return posX;
  }

  private getHandlePositionByVolume(volume: number): number {
    const handleWidth: number = this.controlElements.controlHandle!.clientWidth;
    const progbarWidth: number = this.controlElements.controlProgress!.clientWidth;
    const trackWidth = progbarWidth - handleWidth;
    const position = trackWidth * volume;

    return position;
  }

  private normaliseVolumeByPosition(position: number): number {
    const handleWidth = this.controlElements.controlHandle!.clientWidth;
    const progbarWidth = this.controlElements.controlProgress!.clientWidth;
    const trackWidth = progbarWidth - handleWidth;
    let volume = position / trackWidth;

    if (volume < 0) {
      volume = 0;
    } else if (volume > 1) {
      volume = 1;
    }

    return volume;
  }

  private updateHandlePosition(position: number): void {
    this.domService.manipulate(this.controlElements.controlHandle!).setStyles({ left: `${position}px` });
  }
}
