import { IEvents } from './base/Events';
import { Card, ICard } from './Card';

export class CardPreview extends Card {
	protected buttonElement?: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this.buttonElement = this.container.querySelector('.card__button') ?? undefined;

		this.buttonElement?.addEventListener('click', () => {
			const id = this.container.dataset.id;
			if (!id) {
				return;
			}

			if (this.buttonElement?.textContent === 'Удалить из корзины') {
				this.events.emit('card:remove', { id });
			} else {
				this.events.emit('card:add', { id });
			}
		});
	}

	set buttonText(value: string) {
		if (this.buttonElement) {
			this.buttonElement.textContent = value;
		}
	}

	set buttonDisabled(value: boolean) {
		if (this.buttonElement) {
			this.buttonElement.disabled = value;
		}
	}

	render(data?: Partial<ICard>): HTMLElement {
		if (data?.id) {
			this.container.dataset.id = data.id;
		}

		return super.render(data);
	}
}