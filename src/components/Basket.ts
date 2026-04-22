import { ensureElement } from '../utils/utils';
import { IEvents } from './base/Events';
import { Component } from './base/Component';

interface IBasketView {
	items: HTMLElement[];
	total: number;
	selected: number;
}

export class Basket extends Component<IBasketView> {
	protected listElement: HTMLElement;
	protected priceElement: HTMLElement;
	protected orderButton: HTMLButtonElement;

	constructor(protected events: IEvents, container: HTMLElement) {
		super(container);

		this.listElement = ensureElement<HTMLElement>(
			'.basket__list',
			this.container
		);

		this.priceElement = ensureElement<HTMLElement>(
			'.basket__price',
			this.container
		);

		this.orderButton = ensureElement<HTMLButtonElement>(
			'.basket__button',
			this.container
		);

		this.orderButton.addEventListener('click', () => {
			this.events.emit('order:open');
		});
	}

	set items(items: HTMLElement[]) {
		this.listElement.replaceChildren(...items);
		this.orderButton.disabled = items.length === 0;
	}

	set total(value: number) {
		this.priceElement.textContent = `${value} синапсов`;
	}

	set selected(value: number) {
		this.orderButton.disabled = value === 0;
	}

	render(data?: Partial<IBasketView>): HTMLElement {
		return super.render(data);
	}
}