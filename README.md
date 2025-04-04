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

## Основные типы данных в приложении

### Интерфейс и типы данных карточки товара.

```
interface IProduct {
    id: string;
    title: string;
    category: string;
    description: string;
    price: number | null;
    image: string;
}
```

###  Тип для товаров в корзине.
```
type TBasketProduct = Pick<IProduct, 'id' | 'title' | 'price'>;
```

### Тип для товаров в галерее.
```
type TGalleryProduct = Omit<IProduct, 'description'>;
```

### Интерфейс о способе оплаты, адреса, email и телефона покупателя.
```
interface IUserData {
    payment: TPaymentMethod;
    address: string;
    email: string;
    phone: string;
}
```

###  Тип способов оплаты.
```
type TPaymentMethod = 'online' | 'cash';
```

###  Тип для формы выбора способа оплаты и адреса доставки.
```
type TDeliveryForm = Pick<IUserData, 'payment' | 'address'>;
```

### Тип для формы контактных данных покупателя.
```
type TContactsForm = Pick<IUserData, 'email' | 'phone'>;
```

###  Тип для объединенной формы заказа.
```
type TOrderForm = TDeliveryForm & TContactsForm;
```

###  Интерфейс для заказа.
```
interface IOrder extends IUserData {
    items: string[];
    total: number;
}
```

### Интерфейс для результата оформления заказа.
```
interface IOrderResult {
    id: string;
    total: number;
}
```

### Тип для успешного результата заказа.
```
type TSuccess = Pick<IOrderResult, 'total'>;
```

### Тип для ошибок валидации форм.
```
type TFormErrors = Partial<Record<keyof IOrder, string>>;
```

###  Интерфейс, для хранения актуального состояния приложения.
```
interface IAppState {
    gallery: TGalleryProduct[];
    basket: TBasketProduct[];
    preview: string | null;
    order: IOrder | null;
    orderResponse: IOrderResult | null;
    loading: boolean;
}
```


## Базовые классы


## Класс Api

Класс Api представляет собой базовый класс для работы с HTTP-запросами. Он предоставляет методы для выполнения GET и POST-запросов, а также обработки ответов от сервера.

### Свойства:
`baseUrl: string` - базовый URL для всех запросов.  
`options: RequestInit` - дополнительные параметры для HTTP-запросов, такие как заголовки.  

### Конструктор :
`constructor(baseUrl: string, options: RequestInit = {})` -  инициализирует экземпляр класса Api. Принимает базовый URL и дополнительные параметры запроса. По умолчанию устанавливает заголовок Content-Type в application/json.

### Методы:
- `handleResponse(response: Response): Promise<object>` - обрабатывает HTTP-ответ. Если статус ответа успешный (response.ok === true), возвращает данные в формате JSON. В противном случае возвращает ошибку, извлекая её из тела ответа или используя стандартное сообщение об ошибке.  
- `get(uri: string): Promise<object>` - выполняет GET-запрос на указанный URI. Возвращает промис с результатом запроса в формате JSON.  
- `post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - выполняет POST, PUT или DELETE-запрос на указанный URI. Принимает данные для отправки в теле запроса и метод запроса (по умолчанию POST). Возвращает промис с результатом запроса в формате JSON.  

## Интерфейс IEvents
```
interface IEvents {
    on<T extends object>(event: EventName, callback: (data: T) => void): void;
    emit<T extends object>(event: string, data?: T): void;
    trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
}
```

### Описание:
Интерфейс IEvents определяет методы для работы с событиями. Он используется для подписки на события, генерации событий и создания триггеров.  

## Класс EventEmitter implements IEvents

Класс `EventEmitter` реализует интерфейс `IEvents` и предоставляет функциональность для работы с событиями.  

### Свойства:
- `_events: Map<EventName, Set<Subscriber>>` - хранилище подписчиков на события. Ключ — название события, значение — множество подписчиков.  

### Методы:
- `on<T extends object>(eventName: EventName, callback: (event: T) => void)` - устанавливает обработчик на указанное событие.  
- `off(eventName: EventName, callback: Subscriber)` - удаляет обработчик с указанного события.  
- `emit<T extends object>(eventName: string, data?: T)` - генерирует событие с передачей данных всем подписчикам.  
- `onAll(callback: (event: EmitterEvent) => void)` - подписывается на все события.  
- `offAll()` - сбрасывает все обработчики событий.  
- `trigger<T extends object>(eventName: string, context?: Partial<T>)` - создаёт коллбек-триггер, который генерирует событие при вызове.  

## Абстрактный класс Component

Абстрактный класс `Component<T>` предоставляет базовую функциональность для работы с DOM-элементами.  

### Свойства:

- `protected readonly container: HTMLElement` - корневой DOM-элемент, связанный с компонентом.  

### Конструктор:

- `protected constructor(protected readonly container: HTMLElement)` Инициализирует экземпляр класса Component. Принимает корневой DOM-элемент.  

### Методы:
- `toggleClass(element: HTMLElement, className: string, force?: boolean)` - переключает CSS-класс у указанного элемента.  
- `protected setText(element: HTMLElement, value: unknown)` - устанавливает текстовое содержимое для указанного элемента.  
- `setDisabled(element: HTMLElement, state: boolean)` - блокирует или разблокирует указанный элемент.  
- `protected setHidden(element: HTMLElement)` - скрывает указанный элемент.  
- `protected setVisible(element: HTMLElement)` - делает указанный элемент видимым.  
- `protected setImage(element: HTMLImageElement, src: string, alt?: string)` - устанавливает изображение и альтернативный текст для указанного элемента.  
- `render(data?: Partial<T>)` - HTMLElement: Рендерит компонент, обновляя его состояние данными data, и возвращает корневой DOM-элемент.

## Класс Model

### Описание:
Абстрактный класс для моделей данных. Хранит состояние и оповещает подписчиков об изменениях.  

### Свойства:
- `events: IEvents` — экземпляр брокера событий.  

### Конструктор:
```
constructor(data: Partial<T>, events: IEvents)
```

Инициализирует экземпляр класса `Model`. Принимает начальные данные и экземпляр брокера событий.  

### Методы:
- `emitChanges(event: string, payload?: object): void ` - Генерация события изменения состояния. Оповещает подписчиков через eventsemit.  

# Модель данных приложения.

## Интерфейс IAppState

```
interface IAppState {
    gallery: TGalleryProduct[];
    basket: TBasketProduct[];
    preview: string | null;
    order: IOrder | null;
    orderResponse: IOrderResult | null;
    loading: boolean;
}

```

### Описание:
Определяет полную модель данных состояния приложения: каталог, корзину, выбранный товар, заказ, результат заказа и флаг загрузки.  

## Класс AppState

### Реализует: `Model<IAppState>`

### Описание:
Реализует интерфейс состояния приложения и предоставляет методы для управления корзиной, каталогом товаров и данными заказа.  

### Свойства:

- `basket : TBasketProduct[]` - хранит список товаров, добавленных в корзину.  
- `gallery : TGalleryProduct[]` - хранит список товаров, доступных в каталоге.  
- `loading : boolean` - указывает, находится ли приложение в состоянии загрузки.  
- `order : IOrder` - хранит текущие детали заказа, включая способ оплаты, адрес, контактную информацию и общую сумму.  
- `preview : string | null`- хранит ID товара, который в данный момент просматривается.  
- `formErrors : TFormErrors` - хранит ошибки валидации формы заказа.  

### Конструктор:

Инициализирует экземпляр `AppState` с значениями по умолчанию для всех свойств.  

### Методы :

- `addToBasket(item: TBasketProduct): void` - добавляет товар в корзину, если он еще не добавлен.  
- `removeFromBasket(item: TBasketProduct): void` - удаляет товар из корзины.  
- `clearBasket(): void` - очищает все товары из корзины.  
- `getTotal(): number` - вычисляет и возвращает общую стоимость всех товаров в корзине.  
- `setGallery(items: ICard[]): void` - устанавливает данные каталога.  
- `setPreview(item: ICard): void` - устанавливает ID товара для предпросмотра.  
- `validateOrderForm(): boolean` - проверяет поля формы заказа (способ оплаты, адрес, email, телефон) и обновляет свойство `formErrors`.  
- `setOrderField(field: keyof IOrder, value: string | number): void` - Обновляет конкретное поле, если форма проходит валидацию после обновления.  
- `contactsReset(): void` - сбрасывает поля `email` и `phone`.  

# Классы представления

### Интерфейс IPage
```
interface IPage {
    gallery: HTMLElement[];
    counter: number;
    locked: boolean;
}
```

### Описание:
Интерфейс IPage определяет структуру данных страницы приложения, включая элементы галереи товаров, счетчик товаров в корзине и состояние блокировки интерфейса.  

## Класс Page

### Реализует `Component<IPage>`  

### Описание:
Реализует интерфейс главной страницы и предоставляет методы для управления отображением каталога, счетчика корзины и блокировки интерфейса.  

### Свойства:

- `_counter: HTMLElement` - счетчик товаров в корзине.  
- `_gallery: HTMLElement` - контейнер каталога товаров.  
- `_wrapper: HTMLElement` - обертка страницы.  
- `_basket: HTMLElement` - кнопка корзины.  

### Конструктор:
```
constructor(container: HTMLElement, protected events: IEvents)
```

Инициализирует основные элементы страницы и обработчик клика по корзине.  

### Методы:
- `set counter(value: number)` - устанавливает значение счетчика.  
- `set gallery(items: HTMLElement[])` - обновляет каталог товаров.  
- `set locked(value: boolean)` - блокирует/разблокирует страницу.  

### Интерфейс IModalData

```
interface IModalData {
    content: HTMLElement;
}
```

### Описание:
Интерфейс IModalData определяет структуру данных модального окна, содержащую только HTMLElement для отображения контента.  

## Класс Modal
### Реализует: `Component<IModalData>`

### Описание:
Реализует интерфейс модального окна и предоставляет методы для открытия/закрытия и управления содержимым модального окна.

### Свойства:
- `_closeButton: HTMLButtonElement` - кнопка закрытия модального окна.  
- `_content: HTMLElement` - контейнер содержимого модального окна.  

### Конструктор:
```
constructor(container: HTMLElement, events: IEvents)

```
Настраивает модальное окно с обработчиками закрытия и предотвращением всплытия событий.  

### Методы:
- `set content(value: HTMLElement)` - устанавливает содержимое модального окна.  
- `open()` - открывает модальное окно.  
- `close()` - закрывает модальное окно.  
- `render(data: IModalData)` - рендерит модальное окно с переданными данными.  

### Интерфейс ICard
```
interface ICard extends IProduct {
    basketProductCardIndex?: string;
    buttonTitle?: string;
}
```

### Описание:
Интерфейс `ICard` расширяет базовый интерфейс товара (IProduct), добавляя опциональные поля для индекса товара в корзине и кастомного текста кнопки.

## Класс Card

### Реализует `Component<ICard>`

### Описание:
Реализует интерфейс карточки товара и предоставляет методы для отображения и взаимодействия с товаром в различных контекстах (каталог, корзина, превью).  

### Свойства:
- `_itemId: string` - уникальный идентификатор товара.  
- `_title: HTMLElement` - DOM-элемент для отображения названия товара.  
- `_image?: HTMLImageElement` - изображение товара.  
- `_category?: HTMLElement` - категория товара.  
- `_description?: HTMLElement` - описание товара.  
- `_price: HTMLElement` - цена товара.  
- `_button?: HTMLButtonElement` - кнопка действия.  
- `_basketProductCardIndex?: HTMLElement` - индекс товара в корзине.  
- `protected events: EventEmitter` - экземпляр EventEmitter для обработки событий.  

### Конструктор:
```
constructor(container: HTMLElement, events: EventEmitter)
```

Создает карточку товара, находит все необходимые DOM-элементы и настраивает обработчик клика.

### Методы:
- `disableButton(value: number | null)` - отключает кнопку, если цена товара равна null.
- `Геттеры/сеттеры` для всех свойств карточки.

### Интерфейс IBasketView
```
interface IBasketView {
    items: HTMLElement[];
    total: number;
    selected: string[];
}
```

### Описание:
Интерфейс `IBasketView` определяет структуру данных для отображения корзины, включая список товаров (как DOM-элементы), общую сумму и массив выбранных ID товаров.  

## Класс Basket

### Реализует `Component<IBasketView>`

### Описание:
Реализует интерфейс компонента корзины и предоставляет методы для управления списком товаров, общей суммой и состоянием кнопки оформления заказа.  

### Свойства:

- `_list: HTMLElement` - контейнер для списка товаров в корзине.  
- `_total: HTMLElement` - элемент для отображения общей суммы.  
- `_button: HTMLElement` - кнопка оформления заказа.  

### Конструктор:
```
constructor(container: HTMLElement, events: EventEmitter)
```
Инициализирует корзину, принимая контейнер и `EventEmitter` для обработки событий.

### Методы:
- `set items(items: HTMLElement[])` - обновляет список товаров в корзине.
- `set selected(items: TBasketProduct[])` - управляет состоянием кнопки оформления заказа.
- `set total(total: number)` - устанавливает общую сумму заказа.

### Интерфейс IFormState

```
interface IFormState {
    valid: boolean;
    errors: string[];
}
```

### Описание:
Интерфейс `IFormState` определяет состояние формы с двумя ключевыми полями: флаг валидности и список ошибок валидации.  

## Класс Form

### Реализует `Component<IFormState>`

### Описание:
Реализует интерфейс базовой формы и предоставляет функционал для валидации, отображения ошибок и обработки submit-событий.  

### Свойства:

- `_submit: HTMLButtonElement` - кнопка отправки формы.  
- _`errors: HTMLElement` - контейнер для отображения ошибок.  

### Конструктор:
```
constructor(container: HTMLFormElement, events: IEvents)
```
Создает форму с указанным контейнером и подключает обработчики событий ввода и отправки.  

### Методы:
- `protected onInputChange(field: keyof T, value: string)` - обработчик изменения полей формы.  
- `set valid(value: boolean)` - управляет состоянием кнопки отправки.  
- `set errors(value: string)` - устанавливает текст ошибок.  
- `render(state: Partial<T> & IFormState)` - рендерит форму с переданными данными.  

## Класс Order

### Наследует `Form<TDeliveryForm & TContactsForm>`

### Описание:
Расширяет функциональность базовой формы для работы с данными заказа, включая выбор способа оплаты и ввод контактных данных.

### Свойства:
- `payment: HTMLButtonElement[]` - кнопки выбора способа оплаты.  

### Конструктор:
```
constructor(container: HTMLFormElement, events: IEvents)
```
Настраивает форму заказа с обработчиками выбора способа оплаты.

### Методы:
- `set address(value: string)` - устанавливает адрес доставки.
- `set email(value: string)` - устанавливает email.
- `set phone(value: string)` - устанавливает телефон.
- `selected(name: string)` - выбирает способ оплаты.

## Класс Success

### Реализует `Component<TSuccess>`

### Описание:
Реализует интерфейс компонента успешного заказа и предоставляет методы для отображения итоговой информации о заказе.  

### Свойства:
- `_total: HTMLElement` - элемент для отображения суммы заказа.  
- `_closeButton: HTMLButtonElement` - кнопка закрытия.  

### Конструктор:
```
constructor(container: HTMLElement, actions?: ISuccessActions)
```
Инициализирует компонент успешного заказа с опциональными обработчиками клика.

### Методы:
- `set total(value: string)` - устанавливает сумму заказа.  


## Интерфейс для клиента API.
```
interface IApiClient {
    getProducts(): Promise<IProduct[]>;
    createOrder(order: TOrderForm): Promise<IOrderResult>;
}
```
Определяет методы для взаимодействия с сервером.


## Класс LarekApiClient

### Наследует класс `Api` и имплементирует `IApiClient`

### Описание:
Реализует интерфейс API-клиента и предоставляет методы для получения товаров и оформления заказов через внешнее API.

### Свойства:
- `cdn: string` - базовый URL для CDN.  

### Конструктор:
```
constructor(cdn: string, baseUrl: string, options?: RequestInit)
```
Инициализирует API клиент с базовым URL CDN и настройками запросов.

### Методы:
- `getProducts(): Promise<IProduct[]> `- получает список продуктов с сервера.  
- `createOrder(order: TOrderForm): Promise<IOrderResult>` - отправляет данные заказа на сервер и возвращает результат создания заказа.  

## Список событий

### События товаров:
`item:click` - клик по товару (передает id товара)
`item:add` - товар добавлен в корзину
`item:remove` - товар удален из корзины

### События корзины:
`basket:open `- открытие корзины
`basket:change` - изменение содержимого корзины
`basket:clear` - очистка корзины

### События заказа:
`order:open` - начало оформления заказа
`order:submit` - отправка заказа
`order:paymentChange` - изменение способа оплаты
`order:addressChange` - изменение адреса доставки
`order:contactsChange` - изменение контактных данных

### События модальных окон:
`modal:open` - открытие модального окна
`modal:close `- закрытие модального окна

### События форм:
`formErrors:change` - изменение ошибок валидации
`formSubmit:contacts` - отправка контактных данных
`formSubmit:delivery` - отправка данных доставки

### События успешных операций:
`success:open` - открытие окна успеха
`success:close` - закрытие окна успеха
`order:success` - успешное оформление заказа

### Системные события:
`page:lock` - блокировка страницы
`page:unlock` - разблокировка страницы
`data:changed` - изменение данных в модели

