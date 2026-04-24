import { categoryMap } from '../utils/constants';
import { Card } from './Card';

interface ICardPreviewActions {
	onClick: () => void;
}

export class CardPreview extends Card {
	protected imageElement?: HTMLImageElement;
	protected categoryElement?: HTMLElement;
	protected descriptionElement?: HTMLElement;
	protected buttonElement?: HTMLButtonElement;

	constructor(container: HTMLElement, actions?: ICardPreviewActions) {
		super(container);

		this.imageElement =
			this.container.querySelector('.card__image') ?? undefined;

		this.categoryElement =
			this.container.querySelector('.card__category') ?? undefined;

		this.descriptionElement =
			this.container.querySelector('.card__text') ?? undefined;

		this.buttonElement =
			this.container.querySelector('.card__button') ?? undefined;

		if (actions?.onClick) {
			this.buttonElement?.addEventListener('click', actions.onClick);
		}
	}

	set image(value: string) {
		if (this.imageElement) {
			this.setImage(
				this.imageElement,
				value,
				this.titleElement?.textContent || ''
			);
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

	set description(value: string) {
		if (this.descriptionElement) {
			this.descriptionElement.textContent = value;
		}
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
}