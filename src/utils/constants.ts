import { Settings } from "../types/settings";

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
          card: 'button[name=card]',
          cash: 'button[name=cash]',
      },
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
    'дополнительное': '_additional',
    'кнопка': '_button',
    'другое': '_other',
  },
};