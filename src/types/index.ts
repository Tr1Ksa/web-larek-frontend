// Интерфейс для описания товара.
interface IProduct {
  id: string;
  title: string;
  category: string;
  description: string;
  price: number;
  image: string;
}

// Тип для товаров в корзине.
type IBasketProduct = Pick<IProduct, 'id' | 'title' | 'price'>;

// Тип для товаров в галерее.
type IGalleryProduct = Omit<IProduct, 'description'>;

// Тип для способов оплаты.
type PaymentMethod = 'online' | 'cash';

// Интерфейс о способе оплаты, адресе, email и телефоне.
interface IUserData {
  payment: PaymentMethod;
  address: string;
  email: string;
  phone: string;
}

// Тип для формы выбора способа оплаты и адреса доставки.
type IDeliveryForm = Pick<IUserData, 'payment' | 'address'>;

// Тип для формы контактных данных покупателя.
type IContactsForm = Pick<IUserData, 'email' | 'phone'>;

// Тип для объединенной формы заказа.
type IOrderForm = IDeliveryForm & IContactsForm;

// Интерфейс для заказа.
interface IOrder {
  items: string[];
  total: number;
  payment: PaymentMethod;
  address: string;
  email: string;
  phone: string;
}

// Интерфейс для результата оформления заказа.
interface IOrderResult {
  id: string;
  total: number;
}

// Тип для успешного результата заказа.
type ISuccess = Pick<IOrderResult, 'total'>;

// Тип для ошибок валидации форм.
type FormErrors<T> = Partial<Record<keyof T, string | null>>;

// Интерфейс для товара, получаемого от API.
type IApiProduct = IProduct;

// Интерфейс для заказа, получаемого от API.
type IApiOrderResult = IOrderResult;