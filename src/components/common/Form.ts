import { IEvents } from "../base/events";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Components";
import { SETTINGS } from "../../utils/constants";

// Интерфейс состояния формы, включающий флаг валидности и массив ошибок
interface IFormState {
    valid: boolean;
    errors: string[];
}

// Класс Form представляет форму, которая может быть использована для ввода данных
export class Form<T> extends Component<IFormState> {
    protected _submit: HTMLButtonElement;
    protected _errors: HTMLElement;

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container);

        this._submit = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
        this._errors = ensureElement<HTMLElement>(SETTINGS.orderSettings.errors, this.container);

        // Обработчик события ввода данных в поля формы
        this.container.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            const field = target.name as keyof T;
            const value = target.value;
            this.onInputChange(field, value);
        });

        // Обработчик события отправки формы
        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit(`${this.container.name}:submit`);
        });
    }

    // Метод, вызываемый при изменении значения в поле ввода
    protected onInputChange(field: keyof T, value: string) {
        this.events.emit(`${this.container.name}.${String(field)}:change`, {
            field,
            value
        });
    }

    // Сеттер для установки состояния валидности формы
    set valid(value: boolean) {
        this._submit.disabled = !value;
    }

    // Сеттер для установки текста ошибок
    set errors(value: string) {
        this.setText(this._errors, value);
    }

    // Метод для отрисовки состояния формы
    render(state: Partial<T> & IFormState) {
        const { valid, errors, ...inputs } = state;
        super.render({ valid, errors });

        Object.assign(this, inputs);

        return this.container;
    }
}