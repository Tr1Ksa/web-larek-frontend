import { IProduct } from '../types';
import { SETTINGS } from '../utils/constants';
import { ensureElement } from '../utils/utils';
import { Component } from './base/Components';
import { EventEmitter } from './base/events';

// Интерфейс для карточки товара, расширяющий интерфейс IProduct
export interface ICard extends IProduct {
	basketProductCardIndex?: string;
	buttonTitle?: string;
	onClick?: () => void;
}

// Класс карточки товара
export class Card extends Component<ICard> {
	protected _itemId: string;
	protected _title: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _category?: HTMLElement;
	protected _description?: HTMLElement;
	protected _price: HTMLElement;
	protected _button?: HTMLButtonElement;
	protected _basketProductCardIndex?: HTMLElement;
	// Маппинг категорий товаров на CSS-классы
	private categoryKey = SETTINGS.cardCategories;

	constructor(
		container: HTMLElement,
		protected events: EventEmitter,
		options?: Partial<ICard>
	) {
		super(container);

		this._title = ensureElement<HTMLElement>(
			SETTINGS.cardSettings.title,
			this.container
		);
		this._image = container.querySelector(SETTINGS.cardSettings.image);
		this._price = ensureElement<HTMLElement>(
			SETTINGS.cardSettings.price,
			this.container
		);
		this._category = container.querySelector(SETTINGS.cardSettings.category);
		this._description = container.querySelector(
			SETTINGS.cardSettings.description
		);
		this._button = container.querySelector(
			SETTINGS.cardSettings.button
		) as HTMLButtonElement;
		this._basketProductCardIndex = container.querySelector(
			SETTINGS.cardSettings.basketProductCardIndex
		);

		if (options?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', options.onClick);
			} else {
				container.addEventListener('click', options.onClick);
			}
		}
	}

	// Отключает кнопку, если цена товара равна null.
	disableButton(value: number | null) {
		if (this._button) {
			this.setDisabled(this._button, !value);
		}
	}

	// Обновляет текст кнопки в зависимости от состояния товара в корзине.
	updateButtonState(isInBasket: boolean) {
		this.buttonTitle = isInBasket
			? SETTINGS.buttonTitles.removeFromBasket
			: SETTINGS.buttonTitles.addToBasket;
	}

	// Устанавливает ID товара.
	set id(value: string) {
		this.container.dataset.id = value;
	}

	// Возвращает ID товара.
	get id(): string {
		return this.container.dataset.id || '';
	}

	// Устанавливает индекс товара в корзине.
	set basketProductCardIndex(value: string) {
		if (this._basketProductCardIndex) {
			this.setText(this._basketProductCardIndex, value);
		}
	}

	// Возвращает индекс товара в корзине.
	get basketProductCardIndex(): string {
		return this._basketProductCardIndex?.textContent || '';
	}

	// Устанавливает заголовок карточки товара.
	set title(value: string) {
		this.setText(this._title, value);
	}

	// Возвращает заголовок карточки товара.
	get title(): string {
		return this._title.textContent || '';
	}

	// Устанавливает текст на кнопке.
	set buttonTitle(value: string) {
		if (this._button) {
			this.setText(this._button, value);
		}
	}

	// Устанавливает изображение товара.
	set image(value: string) {
		if (this._image) {
			this.setImage(this._image, value, this.title);
		}
	}

	// Устанавливает цену товара.
	set price(value: number | null) {
		this.setText(
			this._price,
			value
				? SETTINGS.appState.formatCurrency(value)
				: SETTINGS.labelTexts.noPriceText
		);
		this.disableButton(value);
	}

	// Возвращает цену товара.
	get price(): number {
		return Number(this._price.textContent || '');
	}

 	// Устанавливает категорию товара и обновляет CSS-классы.
	set category(value: string) {
		if (this._category) {
				this.setText(this._category, value);
				const baseClass = this._category.classList[0];
					
				Object.values(this.categoryKey).forEach((key) => {
						this.toggleClass(this._category, `${baseClass}${key}`, false);
				});
	
				this.toggleClass(this._category, `${baseClass}${this.categoryKey[value]}`, true);
		}
	}

	// Устанавливает описание товара.
	set description(value: string | string[]) {
		if (this._description) {
			if (Array.isArray(value)) {
				this._description.replaceWith(
					...value.map((str) => {
						const descTemplate = this._description.cloneNode() as HTMLElement;
						this.setText(descTemplate, str);
						return descTemplate;
					})
				);
			} else {
				this.setText(this._description, value);
			}
		}
	}
}
