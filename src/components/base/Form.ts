import { ensureElement } from '../../utils/utils';
import { IEvents } from './Events';
import { Component } from './Component';

interface IFormState {
	valid: boolean;
	errors: string;
}

export class Form<T> extends Component<IFormState & T> {
	protected submitButton: HTMLButtonElement;
	protected errorsElement: HTMLElement;

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container);

		this.submitButton = ensureElement<HTMLButtonElement>(
			'button[type="submit"]',
			this.container
		);

		this.errorsElement = ensureElement<HTMLElement>(
			'.form__errors',
			this.container
		);
	}

	set valid(value: boolean) {
		this.submitButton.disabled = !value;
	}

	set errors(value: string) {
		this.errorsElement.textContent = value;
	}

	render(state?: Partial<IFormState & T>): HTMLFormElement {
		super.render(state);
		return this.container;
	}
}