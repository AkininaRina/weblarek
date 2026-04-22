import { categoryMap } from '../utils/constants';
import { Component } from './base/Component';

export interface ICard {
  id: string;
  title: string;
  price: number | null;
  image: string;
  category: string;
}

export class Card extends Component<ICard> {
  protected titleElement?: HTMLElement;
  protected priceElement?: HTMLElement;
  protected imageElement?: HTMLImageElement;
  protected categoryElement?: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.titleElement = this.container.querySelector('.card__title') ?? undefined;
    this.priceElement = this.container.querySelector('.card__price') ?? undefined;
    this.imageElement = this.container.querySelector('.card__image') ?? undefined;
    this.categoryElement = this.container.querySelector('.card__category') ?? undefined;
  }

  set title(value: string) {
    if (this.titleElement) {
      this.titleElement.textContent = value;
    }
  }

  set price(value: number | null) {
    if (this.priceElement) {
      this.priceElement.textContent =
        value === null ? 'Бесценно' : `${value} синапсов`;
    }
  }

  set image(value: string) {
    if (this.imageElement) {
      this.setImage(this.imageElement, value, this.titleElement?.textContent || '');
    }
  }

set category(value: string) {
  if (this.categoryElement) {
    this.categoryElement.textContent = value;

    Object.values(categoryMap).forEach((className) => {
      this.categoryElement?.classList.remove(className);
    });

    if (value in categoryMap) {
      const categoryClass = categoryMap[value as keyof typeof categoryMap];
      this.categoryElement.classList.add(categoryClass);
    }
  }
}
}