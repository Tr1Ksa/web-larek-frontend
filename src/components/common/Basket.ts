// src/components/MoiKod/Basket.ts

import { ensureElement, createElement} from '../../utils/utils';
import { TBasketProduct } from '../../types';
import { Component } from '../base/Components';
import { EventEmitter } from '../base/events';
import { SETTINGS } from '../../utils/constants';

interface IBasketView {
	items: HTMLElement[];
	total: number;
	selected: string[];
}

export class Basket extends Component<IBasketView> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);
		
		this._list = ensureElement<HTMLElement>(SETTINGS.basketSettings.list, this.container);
/* 		this._list = ensureElement<HTMLElement>('.basket__list', this.container); */
		this._total = ensureElement<HTMLElement>(SETTINGS.basketSettings.total, this.container);
	/* 	this._total = this.container.querySelector('.basket__price'); */
		this._button = ensureElement<HTMLElement>(SETTINGS.basketSettings.button, this.container);
/* 		this._button = this.container.querySelector('.basket__button'); */

		if (this._button)
			this._button.addEventListener('click', () => events.emit('order:open'));

		this.items = [];
	}

		set items(items: HTMLElement[]) {
			if (items.length) {
					this._list.replaceChildren(...items);
					this.setDisabled(this._button, false); // Активируем кнопку
			} else {
					this._list.replaceChildren(
							createElement<HTMLParagraphElement>('p', {
									textContent: 'Корзина пуста',
							})
					);
					this.setDisabled(this._button, true); // Деактивируем кнопку
			}
	}

	set selected(items: TBasketProduct[]) {
		if (items.length) {
			this.setDisabled(this._button, false);
		} else {
			this.setDisabled(this._button, true);
		}
	}

	set total(total: number) {
    this.setText(this._total, `${total.toString()}` + ' синапсов');
  }
}