// Импорты необходимых модулей и компонентов
import './scss/styles.scss';
import { LarekApiClient } from './components/LarekApi';
import { API_URL, CDN_URL, SETTINGS } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { Page } from './components/Page';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Modal } from './components/common/Modal';
import { Card, ICard } from './components/Card';
import { Basket } from './components/common/Basket';
import { Order } from './components/Order';
import { Success } from './components/common/Success';
import { AppState, GalleryChangeEvent } from './components/AppState';
import { IOrder, TOrderForm } from './types';
import { Form } from './components/common/Form';

// Константы
const events = new EventEmitter();
const api = new LarekApiClient(CDN_URL, API_URL);

// Шаблоны компонентов
const cardGalleryTemplate = ensureElement<HTMLTemplateElement>(SETTINGS.cardGalleryTemplate);
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>(SETTINGS.cardPreviewTemplate);
const cardBasketTemplate = ensureElement<HTMLTemplateElement>(SETTINGS.cardBasketTemplate);
const basketTemplate = ensureElement<HTMLTemplateElement>(SETTINGS.basketTemplate);
const orderTemplate = ensureElement<HTMLTemplateElement>(SETTINGS.orderTemplate);
const contactsTemplate = ensureElement<HTMLTemplateElement>(SETTINGS.contactsTemplate);
const successTemplate = ensureElement<HTMLTemplateElement>(SETTINGS.successTemplate);

// Модель данных приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new Order(cloneTemplate(contactsTemplate), events);
const success = new Success(cloneTemplate(successTemplate), {
    onClick: () => modal.close(),
});

// Получение списка товаров через API и сохранение их в модели данных
api.getProducts()
    .then(appData.setGallery.bind(appData))
    .catch((err) => console.log(err));

// Логирование всех событий (для отладки)
events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
});

// Обновление галереи товаров при изменении данных
events.on<GalleryChangeEvent>('items:changed', () => {
    page.gallery = appData.gallery.map((item) => {
            const card = new Card(cloneTemplate(cardGalleryTemplate), events, {
                    onClick: () => events.emit('card:select', item),
            });

            return card.render({
                    category: item.category,
                    title: item.title,
                    image: item.image,
                    price: item.price,
            });
    });
});

// Обработка выбора карточки товара
events.on('card:select', (item: ICard) => {
    console.log('Card selected:', item);
    appData.setPreview(item);
});

// Обновление модального окна с превью товара
events.on('preview:changed', (item: ICard) => {
    const card = new Card(cloneTemplate(cardPreviewTemplate), events, {
            onClick: () => {
                    events.emit('card:toBasket', item);
                    card.updateButtonState(appData.basket.includes(item));
            },
    });

    modal.render({
            content: card.render({
                    id: item.id,
                    title: item.title,
                    image: item.image,
                    category: item.category,
                    description: item.description,
                    price: item.price,
            }),
    });

    card.updateButtonState(appData.basket.includes(item));
});

// Добавление или удаление товара из корзины
events.on('card:toBasket', (item: ICard) => {
    appData.toggleBasketItem(item);
});

// Добавление товара в корзину
events.on('product:add', (item: ICard) => {
    appData.addToBasket(item);
    modal.close();
});

// Удаление товара из корзины
events.on('product:delete', (item: ICard) => {
    appData.removeFromBasket(item);
    basket.selected = appData.basket;
});

// Обновление счетчика товаров в корзине
events.on('counter:changed', () => (page.counter = appData.basket.length));

// Открытие модального окна с корзиной
events.on('basket:open', () => modal.render({ content: basket.render() }));

// Обновление содержимого корзины
events.on('basket:changed', (items: ICard[]) => {
    basket.items = items.map((item, basketProductCardIndex) => {
            const card = new Card(cloneTemplate(cardBasketTemplate), events, {
                    onClick: () => events.emit('product:delete', item),
            });
            return card.render({
                    basketProductCardIndex: (basketProductCardIndex + 1).toString(),
                    title: item.title,
                    price: item.price,
            });
    });
    const total = items.reduce((total, item) => total + item.price, 0);
    basket.total = total;
    appData.order.total = total;
});

// Открытие формы заказа
events.on('order:open', () => {
    appData.order.items = appData.basket.map((item) => item.id);
    modal.render({
            content: order.render({
                    payment: '',
                    address: '',
                    valid: false,
                    errors: [],
            }),
    });
});

// Открытие формы контактов
events.on('order:submit', () => {
    appData.contactsReset();
    modal.render({
            content: contacts.render({
                    email: '',
                    phone: '',
                    valid: false,
                    errors: [],
            }),
    });
});

// Обработка изменения способа оплаты
events.on('order.payment:change', ({ name }: { name: string }) => {
    appData.order.payment = name;
     appData.validateOrderForm();
});

// Обновление валидности формы
const updateFormValidity = (form: Form<any>, errors: Record<string, string>) => {
    const errorMessages = Object.values(errors).filter(Boolean);
    form.valid = errorMessages.length === 0;
    form.errors = errorMessages.join('; ');
};

// Обработка изменений ошибок в форме
events.on('formErrors:change', (errors: Partial<TOrderForm>) => {
    updateFormValidity(order, { payment: errors.payment, address: errors.address });
    updateFormValidity(contacts, { email: errors.email, phone: errors.phone });
});

// Обработка ввода данных в форму
const handleFormInputChange = (field: string, value: string) => {
    appData.setOrderField(field as keyof IOrder, value);
    if (field in order) {
            appData.validateOrderForm();
    }
};

// Обработка изменений полей формы
events.on(/^(order|contacts)\..*:change/, (data: { field: string; value: string }) => {
    handleFormInputChange(data.field, data.value);
});

// Отправка заказа
events.on('contacts:submit', () => {
    api.createOrder(appData.order)
            .then(() => {
                    success.total = `Списано ${appData.order.total} синапсов`;
                    appData.clearBasket();
                    modal.render({
                            content: success.render({}),
                    });
            })
            .catch((err) => console.error(err));
});