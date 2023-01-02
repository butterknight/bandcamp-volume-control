type CSSProperty = Exclude<
  keyof CSSStyleDeclaration,
  | 'length'
  | 'parentRule'
  | 'getPropertyPriority'
  | 'getPropertyValue'
  | 'item'
  | 'removeProperty'
  | 'setProperty'
  | 'index'
>;

export class DomManipulationService<E extends HTMLElement = HTMLElement> {
  private element: E | undefined;

  public constructor(element: E) {
    this.element = element;
  }

  public get el(): E | undefined {
    return this.element;
  }

  public setId(id: string): DomManipulationService<E> {
    this.element?.setAttribute('id', id);

    return this;
  }

  public setClass(classOrList: string | Array<string>): DomManipulationService<E> {
    if (Array.isArray(classOrList)) {
      classOrList.forEach((className: string) => this.el?.classList.add(className));
    } else if (typeof classOrList === 'string') {
      this.el?.classList.add(classOrList);
    }

    return this;
  }

  public setStyles(styles: string | Partial<CSSStyleDeclaration>): DomManipulationService<E> {
    if (typeof styles === 'string') {
      this.el!.setAttribute('style', styles);
    } else {
      Object.keys(styles as CSSStyleDeclaration).forEach(
        (property: string) => (this.el!.style[property as CSSProperty] = styles[property as CSSProperty]!),
      );
    }

    return this;
  }

  public setAttributes(attributes: Record<string, string>): DomManipulationService<E> {
    Object.keys(attributes).forEach((name: string) => this.el!.setAttribute(name, attributes[name]));

    return this;
  }
}
