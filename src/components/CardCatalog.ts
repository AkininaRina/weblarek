import { IEvents } from './base/Events';
import { Card, ICard } from './Card';

export class CardCatalog extends Card {
  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.container.addEventListener('click', () => {
      this.events.emit('card:select', { id: this.container.dataset.id });
    });
  }

  render(data?: Partial<ICard>): HTMLElement {
    if (data?.id) {
      this.container.dataset.id = data.id;
    }

    return super.render(data);
  }
}