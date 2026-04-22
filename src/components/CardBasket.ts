import { IEvents } from './base/Events';
import { Card, ICard } from './Card';

interface ICardBasket extends ICard {
	index: number;
}

export class CardBasket extends Card {
	protected indexElement?: HTMLElement;
	protected deleteButton?: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this.indexElement =
			this.container.querySelector('.basket__item-index') ?? undefined;

		this.deleteButton =
			this.container.querySelector('.basket__item-delete') ?? undefined;

		this.deleteButton?.addEventListener('click', () => {
			const id = this.container.dataset.id;
			if (!id) {
				return;
			}

			this.events.emit('basket:remove', { id });
		});
	}

	set index(value: number) {
		if (this.indexElement) {
			this.indexElement.textContent = String(value);
		}
	}

	render(data?: Partial<ICardBasket>): HTMLElement {
		if (data?.id) {
			this.container.dataset.id = data.id;
		}

		return super.render(data);
	}
}