import './scss/styles.scss';

import { LarekApiClient } from './components/LarekApi';
import { API_URL, CDN_URL, SETTINGS } from './utils/constants';


import { EventEmitter } from './components/base/events';

import { Page } from './components/Page';
import { cloneTemplate, createElement, ensureElement } from './utils/utils';
import { Modal } from './components/common/Modal';
import { Card, ICard } from './components/Card';
import { Basket } from './components/common/Basket';
import { Order } from './components/Order';
import { Success } from './components/common/Success';

import { AppState, GalleryChangeEvent } from './components/AppState';
import { TContactsForm, TDeliveryForm, TOrderForm } from './types';


//Константы
const events = new EventEmitter();

// Создаем экземпляр класса LarekApiClient для работы с API 
const api = new LarekApiClient(CDN_URL, API_URL);

// Шаблоны
const cardGalleryTemplate = ensureElement<HTMLTemplateElement>(SETTINGS.cardGalleryTemplate); // Шаблон карточки товара в каталоге
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>(SETTINGS.cardPreviewTemplate); // Шаблон карточки товара в попапе
const cardBasketTemplate = ensureElement<HTMLTemplateElement>(SETTINGS.cardBasketTemplate); // Шаблон карточки товара в корзине
const basketTemplate = ensureElement<HTMLTemplateElement>(SETTINGS.basketTemplate);// Шаблон корзины
const orderTemplate = ensureElement<HTMLTemplateElement>(SETTINGS.orderTemplate); // Шаблон формы заказа
const contactsTemplate = ensureElement<HTMLTemplateElement>(SETTINGS.contactsTemplate); // Шаблон формы контактов
const successTemplate = ensureElement<HTMLTemplateElement>(SETTINGS.successTemplate); // Шаблон успешного завершения заказа

// Модель данных приложения
const appData = new AppState({}, events); // Модель данных приложения, связанная с системой событий

// Глобальные контейнеры
const page = new Page(document.body, events); // Главный компонент страницы
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events); // Компонент модального окна

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events); // Компонент корзины
const order = new Order(cloneTemplate(orderTemplate), events); // Компонент формы заказа
const contacts = new Order(cloneTemplate(contactsTemplate), events); // Компонент формы контактов
const success = new Success(cloneTemplate(successTemplate), {
    onClick: () => modal.close(), // Закрытие модального окна при клике
});

//API  Получение списка карточек продуктов
api.getProducts()
    .then(appData.setGallery.bind(appData)) // Сохранение списка товаров в модель данных
    .catch((err) => console.log(err)); // Обработка ошибок

// Мониторинг всех событий  для отладки
events.onAll(({ eventName, data }) => {
	console.log(eventName, data); // Логирование всех событий для отладки
});

// Отображение каталога товаров
events.on<GalleryChangeEvent>('items:changed', () => {
	page.gallery = appData.gallery.map((item) => {
			const card = new Card(cloneTemplate(cardGalleryTemplate), events, {
					onClick: () => events.emit('card:select', item), // Выбор карточки товара
			});

			return card.render({
					category: item.category,
					title: item.title,
					image: item.image,
					price: item.price,
			});
	});
});







// Открытие попапа карточки товара
 events.on('card:select', (item: ICard) => {
	console.log('Card selected:', item); // Логирование выбранного товара
	appData.setPreview(item) // Установка выбранного товара в модель данных
});


 // Установка выбранного товара в модель данных
events.on('preview:changed', (item: ICard) => {
    // Создание карточки товара в попапе
    const card = new Card(cloneTemplate(cardPreviewTemplate), events, {
        onClick: () => {
            events.emit('card:toBasket', item); // Добавление/удаление товара из корзины
            card.buttonTitle = appData.basket.includes(item)
                ? 'Удалить из корзины'
                : 'В корзину';
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
            buttonTitle: appData.basket.includes(item)
                ? 'Удалить из корзины'
                : 'В корзину',
        }),
    });
});


  
// Работа с корзиной
events.on('card:toBasket', (item: ICard) => {
	if (appData.basket.indexOf(item) < 0) {
			events.emit('product:add', item); // Добавление товара
	} else {
			events.emit('product:delete', item); // Удаление товара
	}
});

events.on('product:add', (item: ICard) => {
	appData.addToBasket(item); // Добавление товара в модель данных
	modal.close(); // Закрытие попапа
});

events.on('product:delete', (item: ICard) => {
	appData.removeFromBasket(item); // Удаление товара из модели данных
	basket.selected = appData.basket; // Обновление корзины
});

events.on('counter:changed', () => (page.counter = appData.basket.length)); // Обновление счетчика товаров



events.on('basket:open', () => modal.render({ content: basket.render() }));
events.on('basket:changed', (items: ICard[]) => {
	basket.items = items.map((item, basketProductCardIndex) => {
			const card = new Card(cloneTemplate(cardBasketTemplate), events, {
					onClick: () => events.emit('product:delete', item), // Удаление товара
			});
			return card.render({
					basketProductCardIndex: (basketProductCardIndex + 1).toString(),
					title: item.title,
					price: item.price,
			});
	});
	const total = items.reduce((total, item) => total + item.price, 0);
	basket.total = total; // Обновление общей суммы
	appData.order.total = total; // Обновление суммы заказа
});

// Форма заказа
events.on('order:open', () => {
	appData.order.items = appData.basket.map((item) => item.id); // Установка товаров в заказ
	modal.render({
			content: order.render({
					payment: '',
					address: '',
					valid: false,
					errors: [],
			}),
	});
});

events.on('order:submit', () => {
	appData.contactsReset(); // Сброс данных контактов
	modal.render({
			content: contacts.render({
					email: '',
					phone: '',
					valid: false,
					errors: [],
			}),
	});
});

events.on('order.payment:change', ({ name }: { name: string }) => {
	appData.order.payment = name; // Выбор способа оплаты
 	appData.validateOrderForm(); // Валидация формы 
});

events.on('formErrors:change', (errors: Partial<TOrderForm>) => {
	order.valid = !errors.payment && !errors.address; // Проверка валидности формы заказа
	order.errors = Object.values({ payment: errors.payment, address: errors.address })
			.filter((i) => !!i)
			.join('; ');
	contacts.valid = !errors.email && !errors.phone; // Проверка валидности формы контактов
	contacts.errors = Object.values({ phone: errors.phone, email: errors.email })
			.filter((i) => !!i)
			.join('; ');
});

events.on(/^order\..*:change/, (data: { field: keyof TDeliveryForm; value: string }) => {
	appData.setOrderField(data.field, data.value); // Изменение полей формы заказа
 	appData.validateOrderForm(); // Добавьте эту строку
});

events.on(/^contacts\..*:change/, (data: { field: keyof TContactsForm; value: string }) => {
	appData.setOrderField(data.field, data.value); // Изменение полей формы контактов
});

events.on('contacts:submit', () => {
	api.createOrder(appData.order) // Отправка заказа на сервер
			.then(() => {
					success.total = `Списано ${appData.order.total} синапсов`;
					appData.clearBasket(); // Очистка корзины
					modal.render({
							content: success.render({}),
					});
			})
			.catch((err) => console.error(err));
});