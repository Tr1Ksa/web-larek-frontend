import { SETTINGS } from '../utils/constants';
import { ensureElement } from '../utils/utils';
import { Component } from './base/Components';
import { IEvents } from './base/events';

// Интерфейс, описывающий структуру данных страницы
interface IPage {
	gallery: HTMLElement[];
	counter: number;
	locked: boolean;
}

// Класс Page, представляющий страницу приложения
export class Page extends Component<IPage> {
	protected _counter: HTMLElement;
	protected _gallery: HTMLElement;
	protected _wrapper: HTMLElement;
	protected _basket: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._counter = ensureElement<HTMLElement>(
			SETTINGS.pageSettings.basketCounter,
			this.container
		);
		this._gallery = ensureElement<HTMLElement>(SETTINGS.gallerySelector);
		this._wrapper = ensureElement<HTMLElement>(SETTINGS.pageSettings.wrapper);
		this._basket = ensureElement<HTMLElement>(SETTINGS.pageSettings.basket);

		// Добавляем обработчик события клика на корзину
		this._basket.addEventListener('click', () =>
			this.events.emit(SETTINGS.EventsApp.basketOpen)
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
		this.toggleClass(this._wrapper, SETTINGS.pageSettings.lockedClass, value);
	}
}
