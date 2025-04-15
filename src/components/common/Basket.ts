import { ensureElement, createElement } from '../../utils/utils';
import { TBasketProduct } from '../../types';
import { Component } from '../base/Components';
import { EventEmitter } from '../base/events';
import { SETTINGS } from '../../utils/constants';

// Интерфейс для представления данных корзины
interface IBasketView {
    items: HTMLElement[];
    total: number;
    selected: string[];
}

// Класс Basket отвечает за отображение и управление корзиной товаров
export class Basket extends Component<IBasketView> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        this._list = ensureElement<HTMLElement>(SETTINGS.basketSettings.list, this.container);
        this._total = ensureElement<HTMLElement>(SETTINGS.basketSettings.total, this.container);
        this._button = ensureElement<HTMLElement>(SETTINGS.basketSettings.button, this.container);

        if (this._button) {
            this._button.addEventListener('click', () => events.emit(SETTINGS.EventsApp.orderOpen));
        }

        this.items = [];
    }

    // Сеттер для установки списка товаров в корзине
    set items(items: HTMLElement[]) {
        if (items.length) {
            this._list.replaceChildren(...items);
            this.setDisabled(this._button, false);
        } else {
            this._list.replaceChildren(
                createElement<HTMLParagraphElement>('p', {
                    textContent: SETTINGS.labelTexts.basketEmpty,
                })
            );
            this.setDisabled(this._button, true);
        }
    }

    // Сеттер для установки выбранных товаров
    set selected(items: TBasketProduct[]) {
        if (items.length) {
            this.setDisabled(this._button, false);
        } else {
            this.setDisabled(this._button, true);
        }
    }

    // Сеттер для установки общей стоимости товаров в корзине
    set total(total: number) {
        this.setText(this._total, `${total} ${SETTINGS.labelTexts.synapseCurrency}`);
    }
}