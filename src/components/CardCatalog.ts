import { categoryMap } from '../utils/constants';
import { Card } from './Card';

interface ICardActions {
	onClick: () => void;
}

export class CardCatalog extends Card {
	protected imageElement: HTMLImageElement;
	protected categoryElement: HTMLElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);

		this.imageElement = this.container.querySelector(
			'.card__image'
		) as HTMLImageElement;

		this.categoryElement = this.container.querySelector(
			'.card__category'
		) as HTMLElement;

		if (actions?.onClick) {
			this.container.addEventListener('click', actions.onClick);
		}
	}

	set image(value: string) {
		this.setImage(
			this.imageElement,
			value,
			this.titleElement?.textContent || ''
		);
	}

	set category(value: string) {
		this.categoryElement.textContent = value;

		Object.values(categoryMap).forEach((className) => {
			this.categoryElement.classList.remove(className);
		});

		if (value in categoryMap) {
			const categoryClass = categoryMap[value as keyof typeof categoryMap];
			this.categoryElement.classList.add(categoryClass);
		}
	}
}