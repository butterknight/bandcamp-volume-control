import { AbstractMarkupControl } from '../abstract-markup-control';
import { IBandcampElements } from '../interfaces/elements.interface';
import { IBandcampStyles } from '../interfaces/styles.interface';

export class MarkupControlLarge extends AbstractMarkupControl {
  protected captureBandcampElements(): IBandcampElements {
    const bcContainer: HTMLDivElement = this.domService.captureElement('#player')!;
    return {
      bcContainer,
      bcWrapper: bcContainer,
    };
  }

  protected captureBandcampStyles(): IBandcampStyles {
    const backgroundElementStyles: CSSStyleDeclaration = this.domService.getStyles(
      this.domService.captureElement('#nonartarea')!,
    );
    const handleElementStyles: CSSStyleDeclaration = this.domService.getStyles(
      this.domService.captureElement('#progbar_thumb')!,
    );

    return {
      colour: '#f0f0f0',
      handleBackgroundColor: handleElementStyles.backgroundColor,
      handleBorder: '1px solid ' + handleElementStyles.borderColor,
      progBarBackgroundColor: backgroundElementStyles.backgroundColor,
      progBarBorder: '1px solid ' + backgroundElementStyles.borderColor,
      volumeBackgroundColor: 'rgba(12, 12, 12, 0.72)',
      volumeBorder: '1px solid rgba(12, 12, 12, 0.3)',
    };
  }

  protected generateMarkup<HTMLDivElement extends HTMLElement>(): HTMLDivElement {
    const artArea: HTMLDivElement = this.domService.captureElement('#artarea')!;
    const artAreaHeight: number = artArea.clientHeight;

    const wrapper: HTMLDivElement = this.domService
      .manipulate<HTMLDivElement>(this.domService.createDiv() as any)
      .setId('bk_wrapper')
      .setClass(['bk_wrapper', 'bk_large'])
      .setStyles({
        position: 'absolute',
        width: '100%',
        padding: '6px',
        top: `${artAreaHeight - 28}px`,
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
        height: '8px',
        backgroundColor: this.styles.progBarBackgroundColor,
        border: this.styles.progBarBorder,
      }).el!;

    const handle: HTMLDivElement = this.domService
      .manipulate<HTMLDivElement>(this.domService.createDiv() as any)
      .setId('bk_handle')
      .setClass('bk_handle')
      .setStyles({
        position: 'relative',
        height: '10px',
        width: '24px',
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
        bottom: '0',
        background: this.styles.volumeBackgroundColor,
        border: this.styles.volumeBorder,
        borderRadius: '2px',
        color: this.styles.colour,
        fontSize: '10px',
        padding: '1px 4px',
      }).el!;

    this.domService.addElement(handle, progressBarBackground);
    this.domService.addElement(progressBarBackground, progressBar);
    this.domService.addElement(progressBar, wrapper);
    this.domService.addElement(volumeValue, wrapper);

    return wrapper;
  }

  protected adjustPlayerStyles(): void {
    this.domService
      .manipulate(this.domService.captureElement<HTMLDivElement>('#big_play_button') as HTMLDivElement)
      .setStyles({ bottom: '10%' });
    this.domService
      .manipulate(this.domService.captureElement<HTMLDivElement>('#artarea .logo') as HTMLDivElement)
      .setStyles({ bottom: '10%' });
  }
}
