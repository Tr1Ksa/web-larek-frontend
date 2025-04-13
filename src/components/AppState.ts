import { TGalleryProduct, IAppState, TBasketProduct, IOrder, TFormErrors } from '../types';
import { Model } from './base/Model';
import { ICard } from './Card';

export interface GalleryChangeEvent {
	products: TGalleryProduct[];
}

// Класс для хранения актуального состояния приложения
export class AppState extends Model<IAppState> {
	basket: TBasketProduct[] = [];
	gallery: TGalleryProduct[];
	loading: boolean;
	order: IOrder = {
		payment: '',
		address: '',
		email: '',
		phone: '',
		total: 0,
		items: [],
	};

	preview: string | null;
	formErrors: TFormErrors = {};

	// Метод добавления товара в корзину
	addToBasket(item: TBasketProduct) {
		if (item.price !== null && this.basket.indexOf(item) < 0) {
			this.basket.push(item);
			this.emitChanges('counter:changed', this.basket);
			this.emitChanges('basket:changed', this.basket);
		}
	}
	// Метод удаления товара из корзины
	removeFromBasket(item: TBasketProduct) {
		this.basket = this.basket.filter((it) => it != item);
		this.emitChanges('counter:changed', this.basket);
		this.emitChanges('basket:changed', this.basket);
	}
  
	// Метод переключения товара в корзине
	toggleBasketItem(item: ICard) {
		if (this.basket.includes(item)) {
				this.removeFromBasket(item);
		} else {
				this.addToBasket(item);
		}
	}
	// Метод очистки корзины
	clearBasket() {
		this.basket = [];
		this.emitChanges('counter:changed', this.basket);
		this.emitChanges('basket:changed', this.basket);
	}
	// Метод расчета общей стоимости
	getTotal() {
		return this.basket.reduce((total, item) => total + item.price, 0);
	}
	// Метод обновления списка товаров
	setGallery(items: ICard[]) {
		this.gallery = items;
		this.emitChanges('items:changed', { gallery: this.gallery });
	}
	// Метод обновления превью
	setPreview(item: ICard) {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}
	// Метод валидации формы
	validateOrderForm() {
		const errors: typeof this.formErrors = {};

		if (!this.order.payment)
			errors.payment = 'Необходимо указать способ оплаты';
		if (!this.order.address) errors.address = 'Необходимо указать адрес доставки';

		if (!this.order.email) errors.email = 'Необходимо указать email';
		else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.order.email))
			errors.email = 'Некорректный формат email';
		if (!this.order.phone) errors.phone = 'Необходимо указать номер телефона';
		else if (
			!/^(\+7|8)\s?\(?\d{3}\)?\s?\d{3}\s?\d{2}\s?\d{2}$/.test(this.order.phone)
		)
			errors.phone = 'Некорректный формат номера телефона';

		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);

		return Object.keys(errors).length === 0;
	}
  // Метод обновления полей заказа
	setOrderField(field: keyof IOrder, value: string | number) {
		if (field === 'total') this.order[field] = value as number;
		else if (field === 'items') {
			this.order[field].push(value as string);
		} else this.order[field] = value as string;
		if (this.validateOrderForm()) this.events.emit('order:success', this.order);
	}
  // Метод очистки полей заказа
	contactsReset() {
		this.order.email = '';
		this.order.phone = '';
	}
}