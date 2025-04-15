// === ТИПЫ И ИНТЕРФЕЙСЫ ===

export {
	IOrderResult,
	TOrderForm,
	IProduct,
	TGalleryProduct,
	TBasketProduct,
	IOrder,
	TFormErrors,
	TPaymentMethod,
	IUserData,
	TDeliveryForm,
	TContactsForm,
	TSuccess,
	IAppState,
};

// Интерфейс для описания товара
interface IProduct {
	id: string;
	title: string;
	category: string;
	description: string;
	price: number | null;
	image: string;
}

// Тип для товаров в корзине.
type TBasketProduct = Pick<IProduct, 'id' | 'title' | 'price'>;

// Тип для товаров в галерее.
type TGalleryProduct = Omit<IProduct, 'description'>;

// Тип для способов оплаты.
type TPaymentMethod = 'online' | 'cash';

// Интерфейс о способе оплаты, адреса доставки, email и телефона.
interface IUserData {
	payment: string;
	address: string;
	email: string;
	phone: string;
}

// Тип для формы выбора способа оплаты и адреса доставки.
type TDeliveryForm = Pick<IUserData, 'payment' | 'address'>;

// Тип для формы контактных данных покупателя.
type TContactsForm = Pick<IUserData, 'email' | 'phone'>;

// Тип для объединенной формы заказа.
type TOrderForm = TDeliveryForm & TContactsForm;

// Интерфейс для заказа.
interface IOrder extends IUserData {
	items: string[];
	total: number;
}

// Интерфейс для результата оформления заказа.
interface IOrderResult {
	id: string;
	total: number;
}

// Тип для успешного результата заказа.
type TSuccess = Pick<IOrderResult, 'total'>;

// Тип для ошибок валидации форм.
type TFormErrors = Partial<Record<keyof IOrder, string>>;

// Интерфейс, для хранения актуального состояния приложения
interface IAppState {
	gallery: TGalleryProduct[];
	basket: TBasketProduct[];
	preview: string | null;
	order: IOrder | null;
	orderResponse: IOrderResult | null;
	loading: boolean;
}
