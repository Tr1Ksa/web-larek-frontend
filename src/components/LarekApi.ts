// src/components/LarekApi.ts

import { IProduct, TOrderForm, IOrderResult } from "../types";
import { Api, ApiListResponse } from "./base/api";


// Интерфейс для клиента API.
// Определяет методы для взаимодействия с сервером.
interface IApiClient {
  getProducts(): Promise<IProduct[]>;
  createOrder(order: TOrderForm): Promise<IOrderResult>;
}

export class LarekApiClient extends Api implements IApiClient {
  readonly cdn: string;

  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
    super(baseUrl, options);
    this.cdn = cdn;
  }

  // Получение списка продуктов
  getProducts(): Promise<IProduct[]> {
    return this.get('/product').then((data: ApiListResponse<IProduct>) =>
        data.items.map((item) => ({
            ...item,
            image: this.cdn + item.image
        }))
    );
  }

  // Создание заказа
  createOrder(order: TOrderForm): Promise<IOrderResult> {
    return this.post('/order', order).then((data: IOrderResult) => data);
  }
}