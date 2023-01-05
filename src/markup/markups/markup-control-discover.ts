import { AbstractMarkupControl } from '../abstract-markup-control';
import { IBandcampElements } from '../interfaces/elements.interface';
import { IBandcampStyles } from '../interfaces/styles.interface';

export class MarkupControlDiscover extends AbstractMarkupControl {
  protected captureBandcampElements(): IBandcampElements {
    const bcContainer: HTMLDivElement = this.domService.captureElement<HTMLDivElement>(
      '.discover-detail-inner .inline_player',
    )!;

    return {
      bcContainer,
      bcWrapper: this.domService.captureElement('tbody', bcContainer),
    };
  }

  protected captureBandcampStyles(): IBandcampStyles {
    const backgroundElementStyles: CSSStyleDeclaration = this.domService.getStyles(
      this.domService.captureElement('.inline_player .progbar_empty')!,
    );
    const handleElementStyles: CSSStyleDeclaration = this.domService.getStyles(
      this.domService.captureElement('.inline_player .thumb')!,
    );

    return {
      colour: '#f0f0f0',
      handleBackgroundColor: handleElementStyles.backgroundColor,
      handleBorder: '1px solid ' + handleElementStyles.borderColor,
      progBarBackgroundColor: backgroundElementStyles.backgroundColor,
      progBarBorder: handleElementStyles.borderTopWidth + ' solid ' + handleElementStyles.borderTopColor,
      volumeBackgroundColor: 'rgba(12, 12, 12, 0.72)',
      volumeBorder: '1px solid rgba(12, 12, 12, 0.3)',
    };
  }

  protected generateMarkup<HTMLTableRowElement extends HTMLElement>(): HTMLTableRowElement {
    const wrapperRow: HTMLTableRowElement = this.domService.createAndManipulate('tr').el! as any;
    const wrapperCol: HTMLTableCellElement = this.domService.createAndManipulate('td').setAttributes({ colspan: '3' })
      .el!;
    const wrapper: HTMLDivElement = this.domService
      .createAndManipulate('div')
      .setId('bk_wrapper')
      .setClass(['bk_wrapper', 'bk_small'])
      .setStyles({
        position: 'relative',
        width: 'auto',
        padding: '4px 10px',
        zIndex: '10',
      }).el! as any;

    const progressBarWrapper: HTMLDivElement = this.domService
      .createAndManipulate('div')
      .setClass('bk_progress_bar_wrapper')
      .setStyles({
        position: 'relative',
        width: '100%',
        margin: '0',
        padding: '0',
      }).el!;

    const progressBar: HTMLDivElement = this.domService
      .createAndManipulate('div')
      .setClass('bk_progress_bar')
      .setStyles({ width: '72%' }).el!;

    const progressBarBackground: HTMLDivElement = this.domService
      .createAndManipulate('div')
      .setId('bk_progress_bg')
      .setClass('bk_progress_bar_background')
      .setStyles({
        position: 'relative',
        height: '6px',
        backgroundColor: this.styles.progBarBackgroundColor,
        border: this.styles.progBarBorder,
      }).el!;

    const handle: HTMLDivElement = this.domService
      .createAndManipulate('div')
      .setId('bk_handle')
      .setClass('bk_handle')
      .setStyles({
        position: 'relative',
        height: '8px',
        width: '20px',
        top: '-2px',
        borderRadius: '1px',
        cursor: 'pointer',
        backgroundColor: this.styles.handleBackgroundColor,
        border: this.styles.handleBorder,
      }).el!;

    const volumeValue: HTMLSpanElement = this.domService
      .createAndManipulate('span')
      .setId('bk_volume')
      .setClass('bk_volume_value')
      .setStyles({
        position: 'absolute',
        right: '8px',
        borderRadius: '2px',
        background: this.styles.volumeBackgroundColor,
        border: this.styles.volumeBorder,
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
    this.domService.addElement(wrapper, wrapperCol);
    this.domService.addElement(wrapperCol, wrapperRow);

    return wrapperRow;
  }

  protected adjustPlayerStyles(): void {
    this.domService
      .captureAndManipulate<HTMLDivElement>('.discover-detail-inner .track_cell')
      .setStyles({ height: '24px', verticalAlign: 'top', paddingTop: '4px' });
    this.domService
      .captureAndManipulate<HTMLDivElement>('.discover-detail-inner .play_cell')
      .setAttributes({ rowspan: '3' });
  }
}
