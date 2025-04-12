// src/components/Page.ts

import { SETTINGS } from "../utils/constants";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Components";
import { IEvents } from "./base/events";



// Интерфейс, описывающий структуру данных страницы
interface IPage {
  gallery: HTMLElement[];
  counter: number;
  locked: boolean;
}

// Класс Page, представляющий страницу приложения
export class Page extends Component<IPage> {
  protected _counter: HTMLElement; // Счетчик количества товаров в корзине
  protected _gallery: HTMLElement; // Каталог товаров
  protected _wrapper: HTMLElement; // Обертка страницы
  protected _basket: HTMLElement; // Корзина

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

/*     this._counter = ensureElement<HTMLElement>('.header__basket-counter', this.container);
    this._gallery = ensureElement<HTMLElement>('.gallery');
    this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
    this._basket = ensureElement<HTMLElement>('.header__basket'); */
    this._counter = ensureElement<HTMLElement>(SETTINGS.pageSettings.basketCounter, this.container);
this._gallery = ensureElement<HTMLElement>(SETTINGS.gallerySelector);
this._wrapper = ensureElement<HTMLElement>(SETTINGS.pageSettings.wrapper);
this._basket = ensureElement<HTMLElement>(SETTINGS.pageSettings.basket);

    

    // Добавляем обработчик события клика на корзину
    this._basket.addEventListener('click', () =>
      this.events.emit('basket:open')
    );
  }

  // Сеттер для установки значения счетчика
  set counter(value: number) {
    this.setText(this._counter, String(value));
  }

  // Сеттер для обновления каталога товаров
  set gallery(items: HTMLElement[]) {
    this._gallery.replaceChildren(...items);
  }

  // Сеттер для блокировки/разблокировки страницы
  set locked(value: boolean) {
    if (value) {
      this._wrapper.classList.add(SETTINGS.pageSettings.lockedClass);
    } else {
      this._wrapper.classList.remove(SETTINGS.pageSettings.lockedClass);
    }
  }
}