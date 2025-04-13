import { TDeliveryForm, TContactsForm } from "../types";
import { ensureAllElements } from "../utils/utils";
import { IEvents } from "./base/events";
import { Form } from "./common/Form";

// Класс Order расширяет базовый класс Form и работает с объединением типов TDeliveryForm и TContactsForm.
export class Order extends Form<TDeliveryForm & TContactsForm> {
    protected _payment: HTMLButtonElement[];

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this._payment = ensureAllElements<HTMLButtonElement>('.button_alt', container);
        this._payment.forEach((button) =>
            button.addEventListener('click', () => this.selected(button.name))
        );
    }

    // Сеттер для установки значения адреса в поле формы.
    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }

    // Сеттер для установки значения email в поле формы.
    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }

    // Сеттер для установки значения телефона в поле формы.
    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    }

    // Сеттер для установки состояния валидности формы.
    set valid(value: boolean) {
        this._submit.disabled = !value;
    }

    // Метод для обработки выбора способа оплаты.
    selected(name: string) {
        this._payment.forEach((button) =>
            this.toggleClass(button, 'button_alt-active', button.name === name)
        );

        this.events.emit('order.payment:change', { name });
    }
}