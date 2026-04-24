import { Card } from './Card';

export class CardBasket extends Card {
	protected indexElement?: HTMLElement;
	protected deleteButton?: HTMLButtonElement;

	constructor(container: HTMLElement, protected onDelete: () => void) {
		super(container);

		this.indexElement =
			this.container.querySelector('.basket__item-index') ?? undefined;

		this.deleteButton =
			this.container.querySelector('.basket__item-delete') ?? undefined;

		this.deleteButton?.addEventListener('click', () => {
			this.onDelete();
		});
	}

	set index(value: number) {
		if (this.indexElement) {
			this.indexElement.textContent = String(value);
		}
	}
}