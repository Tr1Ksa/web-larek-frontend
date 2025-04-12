// src/components/common/Form.ts

import { IEvents } from "../base/events"; // Импорт интерфейса для работы с событиями
import { ensureElement } from "../../utils/utils"; // Утилита для безопасного получения элементов DOM
import { Component } from "../base/Components"; // Базовый класс компонента
import { SETTINGS } from "../../utils/constants";

// Интерфейс состояния формы, включающий флаг валидности и массив ошибок
interface IFormState {
    valid: boolean; // Флаг валидности формы
    errors: string[]; // Массив ошибок валидации
}

// Класс Form представляет форму, которая может быть использована для ввода данных
export class Form<T> extends Component<IFormState> {
    protected _submit: HTMLButtonElement; // Кнопка отправки формы
    protected _errors: HTMLElement; // Элемент для отображения ошибок

    // Конструктор принимает контейнер формы (HTMLFormElement) и объект событий
    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container); // Вызов конструктора базового класса

        // Находим кнопку отправки формы внутри контейнера
        this._submit = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
        // Находим элемент для отображения ошибок внутри контейнера
        this._errors = ensureElement<HTMLElement>(SETTINGS.orderSettings.errors, this.container);

        // Обработчик события ввода данных в поля формы
        this.container.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement; // Получаем элемент, который вызвал событие
            const field = target.name as keyof T; // Имя поля (ключ типа T)
            const value = target.value; // Значение, введенное пользователем
            this.onInputChange(field, value); // Вызываем метод для обработки изменения значения
        });

        // Обработчик события отправки формы
        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault(); // Предотвращаем стандартное поведение отправки формы
            this.events.emit(`${this.container.name}:submit`); // Генерируем событие отправки формы
        });
    }

    // Метод, вызываемый при изменении значения в поле ввода
    protected onInputChange(field: keyof T, value: string) {
        // Генерируем событие изменения значения поля
        this.events.emit(`${this.container.name}.${String(field)}:change`, {
            field, // Имя поля
            value  // Новое значение
        });
    }

    // Сеттер для установки состояния валидности формы
    set valid(value: boolean) {
        this._submit.disabled = !value; // Активируем или деактивируем кнопку отправки
    }

    // Сеттер для установки текста ошибок
    set errors(value: string) {
        this.setText(this._errors, value); // Устанавливаем текст ошибок в соответствующий элемент
    }

    // Метод для отрисовки состояния формы
    render(state: Partial<T> & IFormState) {
        const { valid, errors, ...inputs } = state; // Деструктурируем состояние на валидность, ошибки и остальные данные
        super.render({ valid, errors }); // Отрисовываем базовое состояние (валидность и ошибки)

        // Применяем изменения к полям формы
        Object.assign(this, inputs);

        return this.container; // Возвращаем контейнер формы
    }
}