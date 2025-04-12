// src/components/common/Success.ts

import { TSuccess } from "../../types";
import { SETTINGS } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Components";

interface ISuccessActions {
	onClick: () => void;
}

export class Success extends Component<TSuccess> {
	protected _total: HTMLElement;
	protected _closeButton: HTMLButtonElement;

	constructor(container: HTMLElement, protected actions?: ISuccessActions) {
		super(container);

		this._total = ensureElement<HTMLElement>(SETTINGS.successSettings.description, this.container);
		this._closeButton = ensureElement<HTMLButtonElement>(SETTINGS.successSettings.action, this.container);

		if (actions?.onClick)
			this._closeButton.addEventListener('click', actions.onClick);
	}
	set total(value: string) {
		this.setText(this._total, value);
	}
}