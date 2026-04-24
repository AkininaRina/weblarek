import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class BasketModel {
	protected items: IProduct[] = [];

	constructor(protected events: IEvents) {}

	getItems(): IProduct[] {
		return this.items;
	}

	addItem(item: IProduct): void {
		this.items.push(item);
		this.events.emit('basket:changed');
	}

	removeItem(item: IProduct): void {
		this.items = this.items.filter((basketItem) => basketItem.id !== item.id);
		this.events.emit('basket:changed');
	}

	clear(): void {
		this.items = [];
		this.events.emit('basket:changed');
	}

	getTotal(): number {
		return this.items.reduce((total, item) => total + (item.price ?? 0), 0);
	}

	getCount(): number {
		return this.items.length;
	}

	hasItem(id: string): boolean {
		return this.items.some((item) => item.id === id);
	}
}