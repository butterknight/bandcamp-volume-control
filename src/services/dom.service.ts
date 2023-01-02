import { IControlElements } from '../markup/interfaces/elements.interface';
import { DomManipulationService } from './dom-manipulation-service';

export class DomService {
  constructor(private readonly document: Document, private readonly window: Window) {}

  public getUrl(): string {
    return this.window.location.href;
  }

  public createElement<T extends keyof HTMLElementTagNameMap>(tagName: T): HTMLElementTagNameMap[T] {
    return this.document.createElement(tagName);
  }

  public createDiv(): HTMLDivElement {
    return this.document.createElement<'div'>('div');
  }

  public createSpan(): HTMLSpanElement {
    return this.document.createElement<'span'>('span');
  }

  public manipulate<T extends HTMLElement = HTMLElement>(element: T): DomManipulationService<T> {
    return new DomManipulationService<T>(element);
  }

  public createAndManipulate<T extends keyof HTMLElementTagNameMap>(
    tagName: T,
  ): DomManipulationService<HTMLElementTagNameMap[T]> {
    return this.manipulate(this.createElement(tagName));
  }

  public captureAndManipulate<T extends HTMLElement = HTMLElement>(
    query: string,
    parentElement: HTMLElement | null = null,
  ): DomManipulationService<T> {
    return this.manipulate<T>(this.captureElement<T>(query, parentElement) as T);
  }

  public getStyles(element: HTMLElement): CSSStyleDeclaration {
    return this.window.getComputedStyle(element);
  }

  public captureElement<T extends HTMLElement = HTMLElement>(
    query: string,
    parentElement: HTMLElement | null = null,
  ): T | null {
    return (parentElement || this.document).querySelector<T>(query);
  }

  public captureElements<T extends HTMLElement = HTMLElement>(
    query: string,
    parentElement: HTMLElement | null = null,
  ): Array<T> {
    return Array.from((parentElement || this.document).querySelectorAll<T>(query));
  }

  public removeElement(element: HTMLElement, parentElement: HTMLElement): void {
    parentElement?.removeChild(element);
  }

  public addElement(element: HTMLElement, parentElement: HTMLElement): void {
    parentElement?.appendChild(element);
  }

  public getControlElements(): IControlElements {
    return {
      controlWrapper: this.captureElement<HTMLDivElement>('#bk_wrapper'),
      controlProgress: this.captureElement<HTMLDivElement>('#bk_progress_bg'),
      controlHandle: this.captureElement<HTMLDivElement>('#bk_handle'),
      controlVolume: this.captureElement<HTMLDivElement>('#bk_volume'),
    };
  }

  public attachEvent<T extends keyof HTMLElementEventMap>(
    element: HTMLElement,
    event: T,
    handler: (this: HTMLElement, ev: HTMLElementEventMap[T]) => any,
  ): void {
    element.addEventListener<T>(event, handler);
  }

  public attachDocumentEvent<T extends keyof HTMLElementEventMap>(
    event: T,
    handler: (this: Document, ev: HTMLElementEventMap[T]) => any,
  ): void {
    this.document.addEventListener<T>(event, handler);
  }

  public attachWindowEvent<T extends keyof WindowEventMap>(
    event: T,
    handler: (this: Window, ev: WindowEventMap[T]) => any,
  ): void {
    this.window.addEventListener<T>(event, handler);
  }

  public hasErrors(): boolean {
    const errorElements: Array<HTMLDivElement> = this.captureElements<HTMLDivElement>('.inline_player .error');

    return errorElements.some((errorElement: HTMLDivElement): boolean => {
      return errorElement.style?.visibility === 'visible';
    });
  }

  public getElementLeftOffset(element: HTMLElement): number {
    const rect: DOMRect = element.getBoundingClientRect();
    return rect.left + this.document.body.scrollLeft;
  }
}
