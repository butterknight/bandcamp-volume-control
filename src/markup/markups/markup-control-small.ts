import { AbstractMarkupControl } from '../abstract-markup-control';
import { IBandcampElements } from '../interfaces/elements.interface';
import { IBandcampStyles } from '../interfaces/styles.interface';

export class MarkupControlSmall extends AbstractMarkupControl {
  protected captureBandcampElements(): IBandcampElements {
    const bcContainer: HTMLDivElement = this.domService.captureElement('#infolayer .info')!;
    return {
      bcContainer,
      bcWrapper: bcContainer,
    };
  }

  protected captureBandcampStyles(): IBandcampStyles {
    const backgroundElementStyles: CSSStyleDeclaration = this.domService.getStyles(
      this.domService.captureElement('#timeline .progbar_empty')!,
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
    const wrapper: HTMLDivElement = this.domService
      .manipulate<HTMLDivElement>(this.domService.createDiv() as any)
      .setId('bk_wrapper')
      .setClass(['bk_wrapper', 'bk_small'])
      .setStyles({
        position: 'absolute',
        width: '100%',
        padding: '6px 12px 6px 67px',
        bottom: '3%',
        zIndex: '10',
      }).el!;

    const progressBarWrapper: HTMLDivElement = this.domService
      .manipulate<HTMLDivElement>(this.domService.createDiv() as any)
      .setClass('bk_progress_bar_wrapper')
      .setStyles({
        position: 'relative',
        width: '100%',
        margin: '0',
        padding: '0',
      }).el!;

    const progressBar: HTMLDivElement = this.domService
      .manipulate<HTMLDivElement>(this.domService.createDiv() as any)
      .setClass('bk_progress_bar')
      .setStyles({ width: '72%' }).el!;

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
        width: '20px',
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
        background: this.styles.volumeBackgroundColor,
        border: this.styles.volumeBorder,
        borderRadius: '2px',
        color: this.styles.colour,
        padding: '1px 4px',
        fontSize: '10px',
        bottom: '0',
      }).el!;

    this.domService.addElement(handle, progressBarBackground);
    this.domService.addElement(progressBarBackground, progressBar);
    this.domService.addElement(progressBar, progressBarWrapper);
    this.domService.addElement(progressBarWrapper, wrapper);
    this.domService.addElement(volumeValue, wrapper);

    return wrapper;
  }

  protected adjustPlayerStyles(): void {
    this.domService
      .manipulate(this.domService.captureElement<HTMLDivElement>('#infolayer .logo .icon') as HTMLDivElement)
      .setStyles({ top: '2px' });
    this.domService
      .manipulate(this.domService.captureElement<HTMLDivElement>('#maintext') as HTMLDivElement)
      .setStyles({ marginTop: '0' });
    this.domService
      .manipulate(this.domService.captureElement<HTMLDivElement>('#linkarea') as HTMLDivElement)
      .setStyles({ marginTop: '0' });
    this.domService
      .manipulate(this.domService.captureElement<HTMLDivElement>('#currenttitlerow') as HTMLDivElement)
      .setStyles({ marginTop: '0', paddingTop: '0' });
    this.domService
      .manipulate(this.domService.captureElement<HTMLDivElement>('#big_play_button') as HTMLDivElement)
      .setStyles({ bottom: '28px' });
  }
}
