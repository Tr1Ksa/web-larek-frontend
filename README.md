# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

## Архитектура проекта (MVP)

Проект реализован по архитектуре MVP (Model-View-Presenter) с использованием брокера событий для связи между компонентами.

## Типы данных

В файле src/types/index.ts описаны необходимые типы данных:

IProduct: интерфейс товара.
IBasketProduct: тип товаров в корзине.
IGalleryProduct: тип товаров в галерее.
PaymentMethod: тип способов оплаты.
IUserData: интерфейс данных пользователя.
IDeliveryForm: тип формы выбора способа оплаты и адреса доставки.
IContactsForm: тип формы контактных данных.
IOrderForm: объединенный тип формы заказа.
IOrder: интерфейс заказа.
IOrderResult: интерфейс результата оформления заказа.
FormErrors: тип ошибок валидации форм.

## Базовые классы

- Класс Api
  Назначение : содержит базовую логику отправки запросов и обработки ответов от сервера.

Поля :
baseUrl: string: базовый URL для API.
options: RequestInit: опции для fetch.

Конструктор :
Принимает базовый адрес сервера и опциональный объект с заголовками запросов.

Методы :
get(): выполняет GET-запрос на указанный эндпоинт.
post(): отправляет данные в JSON-формате на указанный эндпоинт.
handleResponse(): обрабатывает ответ от сервера.

- Класс EventEmitter
  Назначение : обеспечивает работу событийной модели в приложении.

Поля :
events: хранилище подписчиков на события.

Методы :
on: подписывает функцию на событие.
off: отменяет подписку функции на событие.
emit: вызывает всех подписчиков события с передачей данных.
onAll: подписывает функцию на все события.
offAll: отменяет все подписки.
trigger: создает функцию-триггер для события.

- Класс Component
  Назначение : абстрактный базовый класс для всех UI-компонентов.

Методы :
toggleClass: переключает CSS-класс элемента.
setText: устанавливает текстовое содержимое элемента.
setDisabled: блокирует/разблокирует элемент.
setHidden: скрывает элемент.
setVisible: показывает элемент.
setImage: устанавливает изображение и альтернативный текст.
render: рендеринг компонента с передачей данных.

## Модель данных приложения.

- Класс BaseModel

Назначение : представляет собой центральную модель данных приложения, которая управляет состоянием и логикой работы с товарами, корзиной, заказами, валидацией форм и событиями. Он инкапсулирует все данные и методы для их обработки, предоставляя интерфейс для взаимодействия с другими частями приложения.

Поля :
galleryCards: IGalleryProduct[]: товары в галерее.
basketProducts: IBasketProduct[]: товары в корзине.
previewCard: string | null: ID карточки товара в превью.
order: IOrder: роля заказа.
orderResponse: IOrderResult: результат заказа.
loading: boolean: статус загрузки.
formValidateErrors: ошибки валидации формы.

Методы :
setGallery(data: IProduct[]): устанавливает список товаров в галерею.
addToBasket(item: IBasketProduct): добавляет товар в корзину.
removeFromBasket(item: IBasketProduct): удаляет товар из корзины.
clearBasket(): очищает корзину.
getBasketProducts(): возвращает список товаров в корзине.
getTotalPrice(): возвращает общую стоимость товаров в корзине.
validateOrderForm(): валидирует форму заказа.
setPreview(): устанавливает превью товара.
setOrderField(): устанавливает поле заказа.
resetOrder(): сбрасывает заказ.
contactsReset(): сбрасывает контактные данные после оформления заказа.

## Классы представления

Классы представления — это программные компоненты, которые отвечают за подготовку данных для их последующего отображения в пользовательском интерфейсе, обеспечивая связь между логикой приложения и его внешним видом.

- Класс Page
  Назначение : главная страница с каталогом товаров.

Методы :
counter: установка значения счетчика товаров в корзине.
gallery: обновление каталога товаров.
locked: блокировка/разблокировка страницы.

Связь с другими компонентами :
Взаимодействует с компонентами Card и Modal.

- Класс Modal
  Назначение : отображение модальных окон.

Методы :
open(): открытие модального окна.
close(): закрытие модального окна.
render(): рендеринг контента модального окна.

Взаимодействие: Используется для отображения информации о товаре, корзины и форм заказа.

- Класс Card
  Назначение : представляет компонент карточки товара, который отвечает за отображение информации о продукте (название, изображение, цена, категория и описание).

Методы :
id: получение/установка ID товара.
title: установка названия товара.
image: установка изображения товара.
price: установка цены товара.
category: установка категории товара.
description: установка описания товара.

Взаимодействие: Используется в галерее товаров (Gallery).

- Класс Basket
  Назначение : управление корзиной товаров.

Методы :
updateProductsList(listElement: HTMLElement): обновление списка товаров в корзине.
updateTotalPrice(price: number): обновление общей стоимости товаров.

Взаимодействие: Взаимодействует с компонентом Card для добавления товаров.

- Класс Form
  Назначение : представляет собой универсальный компонент формы, который расширяет базовый класс Component<T> и предоставляет функциональность для управления состоянием формы, включая валидацию полей ввода, отображение ошибок и управление кнопкой отправки.

Методы :
valid: установка состояния кнопки отправки формы (активна/неактивна).
validateErrors: установка текста ошибок валидации формы.

Взаимодействие: Используется в формах выбора способа оплаты и контактных данных.

- Класс LarekApiClient
  представляет реализацию клиента API для взаимодействия с сервером, предоставляя методы для получения списка продуктов с подстановкой CDN-пути к изображениям и создания заказов, при этом он наследует базовый функционал от класса Api и реализует интерфейс IApiClient.

Методы:
getProducts(): получает список продуктов с сервера.
createOrder(): отправляет данные заказа на сервер и возвращает результат создания заказа.

Взаимодействие: Используется для получения данных о товарах и отправки заказов на сервер.

## Список событий

События товаров:
item:click - клик по товару (передает id товара)
item:add - товар добавлен в корзину
item:remove - товар удален из корзины

События корзины:
basket:open - открытие корзины
basket:change - изменение содержимого корзины
basket:clear - очистка корзины

События заказа:
order:open - начало оформления заказа
order:submit - отправка заказа
order:paymentChange - изменение способа оплаты
order:addressChange - изменение адреса доставки
order:contactsChange - изменение контактных данных

События модальных окон:
modal:open - открытие модального окна
modal:close - закрытие модального окна

События форм:
formErrors:change - изменение ошибок валидации
formSubmit:contacts - отправка контактных данных
formSubmit:delivery - отправка данных доставки

События успешных операций:
success:open - открытие окна успеха
success:close - закрытие окна успеха
order:success - успешное оформление заказа

Системные события:
page:lock - блокировка страницы
page:unlock - разблокировка страницы
data:changed - изменение данных в модели
