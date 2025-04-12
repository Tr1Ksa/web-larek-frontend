// src/components/common/Modal.ts

import { SETTINGS } from "../../utils/constants";
import {ensureElement} from "../../utils/utils";
import { Component } from "../base/Components";
import {IEvents} from "../base/events";

interface IModalData {
  content: HTMLElement;
}

export class Modal extends Component<IModalData> {
    protected _closeButton: HTMLButtonElement;
    protected _content: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._closeButton = ensureElement<HTMLButtonElement>(SETTINGS.modalSettings.close, container);
        this._content = ensureElement<HTMLElement>(SETTINGS.modalSettings.content, container);

        this._closeButton.addEventListener('click', this.close.bind(this));
        this.container.addEventListener('click', this.close.bind(this));
        this._content.addEventListener('click', (event) => event.stopPropagation());
    }

    set content(value: HTMLElement) {
        this._content.replaceChildren(value);
    }

    open() {
        this.container.classList.add(SETTINGS.modalSettings.activeClass);
        this.events.emit('modal:open');
    }

    close() {
        this.container.classList.remove(SETTINGS.modalSettings.activeClass);
        this.content = null;
        this.events.emit('modal:close');
    }

    render(data: IModalData): HTMLElement {
        super.render(data);
        this.open();
        return this.container;
    }
}