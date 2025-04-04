// Типизация настроек
export interface Settings {
    // Галерея
    gallerySelector: string;
    gallerySettings: {
        activeItemClass: string;
        itemClass: string;
    };

    // Карточки товаров
    cardSettings: {
        text: string;
        image: string;
    };
    cardTemplate: string;
    cardPreviewTemplate: string;
    cardBasketTemplate: string;

    // Корзина
    basketTemplate: string;
    basketSettings: {
        activeItemClass: string;
        itemClass: string;
        price: string;
        deleteButton: string;
    };

    // Модальные окна
    modalTemplate: string;
    modalSettings: {
        close: string;
        content: string;
        title: string;
        actions: string;
        activeClass: string;
    };

    // Оформление заказа
    orderTemplate: string;
    orderSettings: {
        address: string;
        paymentMethod: {
            card: string;
            cash: string;
        };
        nextButton: string;
        errors: string;
    };

    // Контакты
    contactsTemplate: string;
    contactsSettings: {
        email: string;
        phone: string;
        payButton: string;
    };

    // Успешное оформление заказа
    successTemplate: string;
    successSettings: {
        title: string;
        description: string;
        action: string;
    };

    // Страница
    pageSelector: string;
    pageSettings: {
        wrapper: string;
        header: string;
        basket: string;
        basketCounter: string;
        lockedClass: string;
    };

    // Состояние приложения
    appState: {
        formatCurrency: (value: number) => string;
        storageKey: string;
    };
}