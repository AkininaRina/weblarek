import { IApi, IOrderRequest, IOrderResult, IProductsResponse } from '../../types';

export class WebLarekApi {
    protected api: IApi;

    constructor(api: IApi) {
        this.api = api;
    }

    getProducts(): Promise<IProductsResponse> {
        return this.api.get<IProductsResponse>('/product/');
    }

    createOrder(order: IOrderRequest): Promise<IOrderResult> {
        return this.api.post<IOrderResult>('/order/', order);
    }
}