//src/components/Card.ts

import { IProduct } from "../types";
import { SETTINGS } from "../utils/constants";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Components";
import { EventEmitter } from "./base/events";



export interface ICard extends IProduct {
  basketProductCardIndex?: string;
  buttonTitle?: string;
  onClick?: () => void;
}

//Класс карточки товара
export class Card<T> extends Component<ICard> {
  protected _itemId: string;
  protected _title: HTMLElement;
  protected _image?: HTMLImageElement;
  protected _category?: HTMLElement;
  protected _description?: HTMLElement;
  protected _price: HTMLElement;
  protected _button?: HTMLButtonElement;
  protected _basketProductCardIndex?: HTMLElement;
  
/*   private categoryKey: Record<string, string> = {
    'хард-скил': '_hard',
    'софт-скил': '_soft',
    'дополнительное': '_additional',
    'кнопка': '_button',
    'другое': '_other',
  } */
  
    private categoryKey = SETTINGS.cardCategories; 


  constructor(container: HTMLElement, protected events: EventEmitter, options?: Partial<ICard>) {
    super(container);

    this._title = ensureElement<HTMLElement>(SETTINGS.cardSettings.title, this.container);
    this._image = container.querySelector(SETTINGS.cardSettings.image);
    this._price = ensureElement<HTMLElement>(SETTINGS.cardSettings.price, this.container);
    this._category = container.querySelector(SETTINGS.cardSettings.category);
    this._description = container.querySelector(SETTINGS.cardSettings.description);
    this._button = container.querySelector(SETTINGS.cardSettings.button) as HTMLButtonElement;
    this._basketProductCardIndex = container.querySelector(SETTINGS.cardSettings.basketProductCardIndex);

/*     this._title = ensureElement<HTMLElement>('.card__title', this.container); */
 /*    this._image = container.querySelector('.card__image'); */
/*     this._price = ensureElement<HTMLElement>('.card__price', this.container);
    this._category = container.querySelector('.card__category');
    this._description = container.querySelector('.card__text');
    this._button = container.querySelector('.card__button') as HTMLButtonElement;
    this._basketProductCardIndex = container.querySelector('.basket__item-index'); */
  

    if (options?.onClick) {
      if (this._button) {
        this._button.addEventListener("click", options.onClick);
      } else {
        container.addEventListener("click", options.onClick);
      }
    }
  }

  disableButton(value: number | null) {
    if (!value) {
      if(this._button) {
        this._button.disabled = true;
      }
    }
  }

  set id(value: string) {
    this.container.dataset.id = value;
  }

  get id(): string {
    return this.container.dataset.id || "";
  }

  set basketProductCardIndex(value: string) {
		this._basketProductCardIndex.textContent = value;
	}

	get basketProductCardIndex(): string {
		return this._basketProductCardIndex.textContent || '';
	}

  set title(value: string) {
    this.setText(this._title, value);
  }

  get title(): string {
    return this._title.textContent || "";
  }

  set buttonTitle(value: string) {
    if(this._button) {
      this._button.textContent = value;
    }
  }

  set image(value: string) {
    this.setImage(this._image, value, this.title);

  }

  set price(value: number | null) {
    this.setText(this._price, value ? SETTINGS.appState.formatCurrency(value) : 'Бесценно');
    this.disableButton(value);
    }

  get price(): number {
    return Number(this._price.textContent || '');
  }

  set category(value: string) {
    this.setText(this._category, value);
    const category = this._category.classList[0];
    this._category.className = '';
    this._category.classList.add(`${category}`);
    this._category.classList.add(`${category}${this.categoryKey[value]}`)
  }

  set description(value: string | string[]) {
    if (Array.isArray(value)) {
      this._description.replaceWith(...value.map(str => {
        const descTemplate = this._description.cloneNode() as HTMLElement;
        this.setText(descTemplate, str);
        return descTemplate;
      }))
    } else {
      this.setText(this._description, value);
    }
  }
}