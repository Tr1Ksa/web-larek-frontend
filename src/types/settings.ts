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
        title: string;
        price: string;
        category: string;
        description: string;
        button: string;
        basketProductCardIndex: string;

    };
    cardGalleryTemplate: string;
    cardPreviewTemplate: string;
    cardBasketTemplate: string;

    // Корзина
    basketTemplate: string;
    basketSettings: {
        activeItemClass: string;
        itemClass: string;
        deleteButton: string;
        list: string;
        total: string;
        button: string;
    };

    // Модальные окна
    modalContainer: string;
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
            activeClass: string;
            card: string;
            cash: string;
        };
        buttonAlt: string;
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

    // Категории карточек
    cardCategories: Record<string, string>;

    errorsText: {
        payment: string;
        address: string;
        email: string;
        invalidEmail: string;
        phone: string;
        invalidPhone: string;
    },
    regexp: {
        email: string;
        phone: string;
    },

    // События
    EventsApp: {
        itemsChanged: string;
        cardSelect: string;
        previewChanged: string;
        cardToBasket: string;
        productAdd: string;
        productDelete: string;
        counterChanged: string;
        basketOpen: string;
        basketChanged: string;
        orderOpen: string;
        orderSubmit: string;
        contactsSubmit: string;
        formErrorsChange: string;
        orderPaymentChange: string;
        modalOpen: string;
        modalClose: string;
        orderSuccess: string;
    },

    buttonTitles: {
        addToBasket: string;
        removeFromBasket: string;
    },

    labelTexts: {
        noPriceText: string;
        basketEmpty: string;
        synapseCurrency: string;
      }

}