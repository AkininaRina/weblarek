import { ensureElement } from '../utils/utils';
import { IBuyer } from '../types';
import { IEvents } from './base/Events';
import { Form } from './base/Form';

export class Contacts extends Form<Pick<IBuyer, 'email' | 'phone'>> {
	protected emailInput: HTMLInputElement;
	protected phoneInput: HTMLInputElement;

	constructor(container: HTMLFormElement, protected events: IEvents) {
		super(container, events);

		this.emailInput = ensureElement<HTMLInputElement>(
			'input[name="email"]',
			this.container
		);

		this.phoneInput = ensureElement<HTMLInputElement>(
			'input[name="phone"]',
			this.container
		);

		this.emailInput.addEventListener('input', () => {
			this.events.emit('contacts.email:change', {
				field: 'email',
				value: this.emailInput.value,
			});
		});

		this.phoneInput.addEventListener('input', () => {
			this.events.emit('contacts.phone:change', {
				field: 'phone',
				value: this.phoneInput.value,
			});
		});

		this.container.addEventListener('submit', (event: Event) => {
			event.preventDefault();
			this.events.emit('contacts:submit');
		});
	}

	set email(value: string) {
		this.emailInput.value = value;
	}

	set phone(value: string) {
		this.phoneInput.value = value;
	}
}