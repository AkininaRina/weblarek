import { Component } from './base/Component';

export interface ICard {
  id: string;
  title: string;
  price: number | null;
  image: string;
  category: string;
  description?: string;
}

export class Card extends Component<ICard> {
  protected titleElement?: HTMLElement;
  protected priceElement?: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.titleElement = this.container.querySelector('.card__title') ?? undefined;
    this.priceElement = this.container.querySelector('.card__price') ?? undefined;
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
}