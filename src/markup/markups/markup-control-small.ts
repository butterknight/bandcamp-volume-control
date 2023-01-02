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
      this.domService.captureElement('#nonartarea')!,
    );
    const handleElementStyles: CSSStyleDeclaration = this.domService.getStyles(
      this.domService.captureElement('.inline_player .thumb')!,
    );

    return {
      progBarBackgroundColor: backgroundElementStyles.backgroundColor,
      border: handleElementStyles.borderTopWidth + ' solid ' + handleElementStyles.borderTopColor,
      handleBackgroundColor: handleElementStyles.backgroundColor,
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
        zIndex: '1000',
      }).el!;

    const progressBarWrapper: HTMLDivElement = this.domService
      .manipulate<HTMLDivElement>(this.domService.createDiv() as any)
      .setClass('bk_progress_bar_wrapper')
      .setStyles({ position: 'relative', width: '100%', margin: '0', padding: '0' }).el!;

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
        height: '6px',
        backgroundColor: this.styles.progBarBackgroundColor,
        border: this.styles.border,
      }).el!;

    const handle: HTMLDivElement = this.domService
      .manipulate<HTMLDivElement>(this.domService.createDiv() as any)
      .setId('bk_handle')
      .setClass('bk_handle')
      .setStyles({
        position: 'relative',
        height: '12px',
        width: '24px',
        top: '-4px',
        borderRadius: '12px',
        cursor: 'pointer',
        backgroundColor: this.styles.handleBackgroundColor,
        border: this.styles.border,
      }).el!;

    const volumeValue: HTMLSpanElement = this.domService
      .manipulate<HTMLSpanElement>(this.domService.createSpan() as any)
      .setId('bk_volume')
      .setClass('bk_volume_value')
      .setStyles({
        position: 'absolute',
        right: '8px',
        borderRadius: '2px',
        background: 'rgba(12, 12, 12, 0.72)',
        color: '#f0f0f0',
        padding: '2px 4px',
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
