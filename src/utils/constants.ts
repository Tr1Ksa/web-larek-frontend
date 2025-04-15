import { Settings } from '../types/settings';

export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

// Настройки для приложения
export const SETTINGS: Settings = {
	// Галерея
	gallerySelector: '.gallery',
	gallerySettings: {
		activeItemClass: 'gallery__item_active',
		itemClass: 'gallery__item',
	},

	// Карточки товаров
	cardSettings: {
		text: '.card__text',
		image: '.card__image',
		title: '.card__title',
		price: '.card__price',
		category: '.card__category',
		description: '.card__text',
		button: '.card__button',
		basketProductCardIndex: '.basket__item-index',
	},
	cardGalleryTemplate: '#card-catalog',
	cardPreviewTemplate: '#card-preview',
	cardBasketTemplate: '#card-basket',

	// Корзина
	basketTemplate: '#basket',
	basketSettings: {
		activeItemClass: 'basket__item_active',
		itemClass: 'basket__item',
		total: '.basket__price',
		deleteButton: '.basket__item-delete',
		list: '.basket__list',
		button: '.basket__button',
	},

	// Модальные окна
	modalContainer: '#modal-container',
	modalTemplate: '#modal',
	modalSettings: {
		close: '.modal__close',
		content: '.modal__content',
		title: '.modal__title',
		actions: '.modal__actions',
		activeClass: 'modal_active',
	},

	// Оформление заказа
	orderTemplate: '#order',
	orderSettings: {
		address: 'input[name=address]',
		paymentMethod: {
			activeClass: 'button_alt-active',
			card: 'button[name=card]',
			cash: 'button[name=cash]',
		},
		buttonAlt: '.button_alt',
		nextButton: '.order__button',
		errors: '.form__errors',
	},

	// Контакты
	contactsTemplate: '#contacts',
	contactsSettings: {
		email: 'input[name=email]',
		phone: 'input[name=phone]',
		payButton: '.button',
	},

	// Успешное оформление заказа
	successTemplate: '#success',
	successSettings: {
		title: '.order-success__title',
		description: '.order-success__description',
		action: '.order-success__close',
	},

	// Страница
	pageSelector: '.page',
	pageSettings: {
		wrapper: '.page__wrapper',
		header: '.header',
		basket: '.header__basket',
		basketCounter: '.header__basket-counter',
		lockedClass: 'page__wrapper_locked',
	},

	// Состояние приложения
	appState: {
		formatCurrency: (value: number) => `${value} синапсов`,
		storageKey: '__webLarekCart',
	},

	// Категории карточек
	cardCategories: {
		'хард-скил': '_hard',
		'софт-скил': '_soft',
		дополнительное: '_additional',
		кнопка: '_button',
		другое: '_other',
	},

	// Текст ошибок
	errorsText: {
		payment: 'Необходимо указать способ оплаты',
		address: 'Необходимо указать адрес доставки',
		email: 'Необходимо указать email',
		invalidEmail: 'Некорректный формат email',
		phone: 'Необходимо указать номер телефона',
		invalidPhone: 'Некорректный формат номера телефона',
	},

	// Регулярные выражения
	regexp: {
		email: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
		phone:
			'^(\\+7|8)(\\s?\\(?\\d{3}\\)?|\\d{3})[\\s\\-]?\\d{3}[\\s\\-]?\\d{2}[\\s\\-]?\\d{2}$',
	},

	// События приложения
	EventsApp: {
		itemsChanged: 'items:changed',
		cardSelect: 'card:select',
		previewChanged: 'preview:changed',
		cardToBasket: 'card:toBasket',
		productAdd: 'product:add',
		productDelete: 'product:delete',
		counterChanged: 'counter:changed',
		basketOpen: 'basket:open',
		basketChanged: 'basket:changed',
		orderOpen: 'order:open',
		orderSubmit: 'order:submit',
		contactsSubmit: 'contacts:submit',
		formErrorsChange: 'formErrors:change',
		orderPaymentChange: 'order.payment:change',
		modalOpen: 'modal:open',
		modalClose: 'modal:close',
		orderSuccess: 'order:success',
	},

	buttonTitles: {
		addToBasket: 'В корзину',
		removeFromBasket: 'Удалить из корзины',
	},

	labelTexts: {
		noPriceText: 'Бесценно',
		basketEmpty: 'Корзина пуста',
		synapseCurrency: 'синапсов',
	},
};
