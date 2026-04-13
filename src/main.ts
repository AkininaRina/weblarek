import './scss/styles.scss';
import { Api } from './components/base/Api';
import { WebLarekApi } from './components/Communication/WebLarekApi';
import { apiProducts } from './utils/data';
import { API_URL } from './utils/constants';
import { CatalogModel } from './components/Models/CatalogModel';
import { BasketModel } from './components/Models/BasketModel';
import { BuyerModel } from './components/Models/BuyerModel';

const catalogModel = new CatalogModel();
const basketModel = new BasketModel();
const buyerModel = new BuyerModel();

const api = new Api(API_URL);
const webLarekApi = new WebLarekApi(api);


// сохраняем товары
catalogModel.setItems(apiProducts.items);

// проверяем
console.log('Массив товаров из каталога:', catalogModel.getItems());

// сервер
webLarekApi.getProducts()
    .then((data) => {
        catalogModel.setItems(data.items);
        console.log('Каталог, полученный с сервера:', catalogModel.getItems());
    })
    .catch((error) => {
        console.error('Ошибка загрузки каталога с сервера:', error);
    });

// берём первый товар
const firstProduct = apiProducts.items[0];

// проверяем поиск
console.log('Товар по id:', catalogModel.getItem(firstProduct.id));

// проверяем preview
catalogModel.setPreview(firstProduct);
console.log('Товар для предпросмотра:', catalogModel.getPreview());

// Проверка BasketModel
basketModel.addItem(apiProducts.items[0]);
basketModel.addItem(apiProducts.items[1]);

console.log('Товары в корзине:', basketModel.getItems());
console.log('Общая стоимость товаров в корзине:', basketModel.getTotal());
console.log('Количество товаров в корзине:', basketModel.getCount());
console.log('Проверка наличия первого товара в корзине:', basketModel.hasItem(apiProducts.items[0].id));

basketModel.removeItem(apiProducts.items[0]);
console.log('Корзина после удаления первого товара:', basketModel.getItems());

basketModel.clear();
console.log('Корзина после очистки:', basketModel.getItems());

// Проверка BuyerModel
buyerModel.setData({
    payment: 'card',
    address: 'Санкт-Петербург, Невский проспект, 1'
});

console.log('Данные покупателя после частичного заполнения:', buyerModel.getData());
console.log('Ошибки валидации после частичного заполнения:', buyerModel.validate());

buyerModel.setData({
    email: 'test@test.ru',
    phone: '+7 999 123-45-67'
});

console.log('Данные покупателя после полного заполнения:', buyerModel.getData());
console.log('Ошибки валидации после полного заполнения:', buyerModel.validate());

buyerModel.clear();
console.log('Данные покупателя после очистки:', buyerModel.getData());
console.log('Ошибки валидации после очистки:', buyerModel.validate());

