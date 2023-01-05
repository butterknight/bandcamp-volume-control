import { AbstractMarkupControl } from '../abstract-markup-control';
import { IBandcampElements } from '../interfaces/elements.interface';
import { IBandcampStyles } from '../interfaces/styles.interface';

export class MarkupControlPage extends AbstractMarkupControl {
  protected captureBandcampElements(): IBandcampElements {
    const bcContainer: HTMLDivElement = this.domService.captureElement('#trackInfoInner .inline_player')!;
    return {
      bcContainer,
      bcWrapper: bcContainer,
    };
  }

  protected captureBandcampStyles(): IBandcampStyles {
    const backgroundElementStyles: CSSStyleDeclaration = this.domService.getStyles(
      this.domService.captureElement('.inline_player .progbar_empty')!,
    );
    const handleElementStyles: CSSStyleDeclaration = this.domService.getStyles(
      this.domService.captureElement('.inline_player .thumb')!,
    );
    const textStyles: CSSStyleDeclaration = this.domService.getStyles(
      this.domService.captureElement('.inline_player .title')!,
    );

    return {
      colour: textStyles.color,
      handleBackgroundColor: handleElementStyles.backgroundColor,
      handleBorder: '1px solid ' + handleElementStyles.borderTopColor,
      progBarBackgroundColor: backgroundElementStyles.backgroundColor,
      progBarBorder: '1px solid ' + backgroundElementStyles.borderTopColor,
      volumeBackgroundColor: backgroundElementStyles.backgroundColor,
      volumeBorder: '1px solid ' + handleElementStyles.borderTopColor,
    };
  }

  protected generateMarkup<HTMLDivElement extends HTMLElement>(): HTMLDivElement {
    const wrapper: HTMLDivElement = this.domService
      .manipulate<HTMLDivElement>(this.domService.createDiv() as any)
      .setId('bk_wrapper')
      .setClass(['bk_wrapper', 'bk_page'])
      .setStyles({
        position: 'absolute',
        width: '100%',
        padding: '6px',
        bottom: '-24px',
        zIndex: '10',
      }).el!;

    const progressBar: HTMLDivElement = this.domService
      .manipulate<HTMLDivElement>(this.domService.createDiv() as any)
      .setClass('bk_progress_bar')
      .setStyles({ width: '78%' }).el!;

    const progressBarBackground: HTMLDivElement = this.domService
      .manipulate<HTMLDivElement>(this.domService.createDiv() as any)
      .setId('bk_progress_bg')
      .setClass('bk_progress_bar_background')
      .setStyles({
        position: 'relative',
        height: '6px',
        backgroundColor: this.styles.progBarBackgroundColor,
        border: this.styles.progBarBorder,
      }).el!;

    const handle: HTMLDivElement = this.domService
      .manipulate<HTMLDivElement>(this.domService.createDiv() as any)
      .setId('bk_handle')
      .setClass('bk_handle')
      .setStyles({
        position: 'relative',
        height: '8px',
        width: '18px',
        top: '-2px',
        borderRadius: '1px',
        cursor: 'pointer',
        backgroundColor: this.styles.handleBackgroundColor,
        border: this.styles.handleBorder,
      }).el!;

    const volumeValue: HTMLSpanElement = this.domService
      .manipulate<HTMLSpanElement>(this.domService.createSpan() as any)
      .setId('bk_volume')
      .setClass('bk_volume_value')
      .setStyles({
        position: 'absolute',
        right: '8px',
        border: this.styles.volumeBorder,
        borderRadius: '2px',
        background: this.styles.volumeBackgroundColor,
        color: this.styles.colour,
        padding: '1px 4px',
        fontSize: '10px',
        bottom: '0',
      }).el!;

    this.domService.addElement(handle, progressBarBackground);
    this.domService.addElement(progressBarBackground, progressBar);
    this.domService.addElement(progressBar, wrapper);
    this.domService.addElement(volumeValue, wrapper);

    return wrapper;
  }

  protected adjustPlayerStyles(): void {
    this.domService
      .manipulate(this.domService.captureElement<HTMLDivElement>('#trackInfoInner .inline_player') as HTMLDivElement)
      .setStyles({ marginBottom: '30px' });
  }
}
