import {
	TGalleryProduct,
	IAppState,
	TBasketProduct,
	IOrder,
	TFormErrors,
} from '../types';
import { SETTINGS } from '../utils/constants';
import { Model } from './base/Model';
import { ICard } from './Card';

export interface GalleryChangeEvent {
	products: TGalleryProduct[];
}

// Создание экземпляров регулярных выражений
const emailRegex = new RegExp(SETTINGS.regexp.email);
const phoneRegex = new RegExp(SETTINGS.regexp.phone);

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
			this.emitChanges(SETTINGS.EventsApp.counterChanged, this.basket);
			this.emitChanges(SETTINGS.EventsApp.basketChanged, this.basket);
		}
	}

	// Метод удаления товара из корзины
	removeFromBasket(item: TBasketProduct) {
		this.basket = this.basket.filter((it) => it != item);
		this.emitChanges(SETTINGS.EventsApp.counterChanged, this.basket);
		this.emitChanges(SETTINGS.EventsApp.basketChanged, this.basket);
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
		this.emitChanges(SETTINGS.EventsApp.counterChanged, this.basket);
		this.emitChanges(SETTINGS.EventsApp.basketChanged, this.basket);
	}

	// Метод расчета общей стоимости
	getTotal() {
		return this.basket.reduce((total, item) => total + item.price, 0);
	}

	// Метод обновления списка товаров
	setGallery(items: ICard[]) {
		this.gallery = items;
		this.emitChanges(SETTINGS.EventsApp.itemsChanged, {
			gallery: this.gallery,
		});
	}

	// Метод обновления превью
	setPreview(item: ICard) {
		this.preview = item.id;
		this.emitChanges(SETTINGS.EventsApp.previewChanged, item);
	}

	// Метод валидации формы
	validateOrderForm() {
		const errors: typeof this.formErrors = {};

		if (!this.order.payment) errors.payment = SETTINGS.errorsText.payment;
		if (!this.order.address) errors.address = SETTINGS.errorsText.address;

		if (!this.order.email) {
			errors.email = SETTINGS.errorsText.email;
		} else if (!emailRegex.test(this.order.email)) {
			errors.email = SETTINGS.errorsText.invalidEmail;
		}

		if (!this.order.phone) {
			errors.phone = SETTINGS.errorsText.phone;
		} else if (!phoneRegex.test(this.order.phone)) {
			errors.phone = SETTINGS.errorsText.invalidPhone;
		}

		this.formErrors = errors;
		this.events.emit(SETTINGS.EventsApp.formErrorsChange, this.formErrors);

		return Object.keys(errors).length === 0;
	}

	// Метод обновления полей заказа
	setOrderField(field: keyof IOrder, value: string | number) {
		if (field === 'total') {
			this.order[field] = value as number;
		} else if (field === 'items') {
			this.order[field].push(value as string);
		} else {
			this.order[field] = value as string;
		}

		if (this.validateOrderForm()) {
			this.events.emit(SETTINGS.EventsApp.orderSuccess, this.order);
		}
	}

	// Метод очистки полей заказа
	clearOrderForm() {
		this.order.payment = '';
		this.order.address = '';
	}

	// Метод очистки полей заказа
	contactsReset() {
		this.order.email = '';
		this.order.phone = '';
	}
}
