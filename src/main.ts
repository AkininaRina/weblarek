import "./scss/styles.scss";

import { Api } from "./components/base/Api";
import { EventEmitter } from "./components/base/Events";
import { WebLarekApi } from "./components/Communication/WebLarekApi";

import { API_URL, CDN_URL } from "./utils/constants";

import { CatalogModel } from "./components/Models/CatalogModel";
import { BasketModel } from "./components/Models/BasketModel";
import { BuyerModel } from "./components/Models/BuyerModel";

import { Header } from "./components/Header";
import { Gallery } from "./components/Gallery";
import { Modal } from "./components/Modal";

import { CardCatalog } from "./components/CardCatalog";
import { CardPreview } from "./components/CardPreview";

import { Basket } from "./components/Basket";
import { CardBasket } from "./components/CardBasket";

import { Order } from "./components/Order";

import { Contacts } from './components/Contacts';
import { Success } from './components/Success';

const events = new EventEmitter();

// МОДЕЛИ
const catalogModel = new CatalogModel(events);
const basketModel = new BasketModel(events);
const buyerModel = new BuyerModel(events);

// API
const api = new Api(API_URL);
const webLarekApi = new WebLarekApi(api);

// ОСНОВНЫЕ VIEW
const header = new Header(
  events,
  document.querySelector(".header") as HTMLElement,
);

const gallery = new Gallery(document.querySelector(".gallery") as HTMLElement);

const modal = new Modal(
  events,
  document.querySelector("#modal-container") as HTMLElement,
);

// ШАБЛОНЫ
const cardCatalogTemplate = document.querySelector(
  "#card-catalog",
) as HTMLTemplateElement;

const cardPreviewTemplate = document.querySelector(
  "#card-preview",
) as HTMLTemplateElement;

const basketTemplate = document.querySelector("#basket") as HTMLTemplateElement;

const cardBasketTemplate = document.querySelector(
  "#card-basket",
) as HTMLTemplateElement;

const orderTemplate = document.querySelector("#order") as HTMLTemplateElement;

const contactsTemplate = document.querySelector(
	'#contacts'
) as HTMLTemplateElement;

const successTemplate = document.querySelector(
	'#success'
) as HTMLTemplateElement;

const basket = new Basket(
  events,
  basketTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement,
);

const order = new Order(
  orderTemplate.content.firstElementChild?.cloneNode(true) as HTMLFormElement,
  events,
);

const contacts = new Contacts(
	contactsTemplate.content.firstElementChild?.cloneNode(true) as HTMLFormElement,
	events
);

const success = new Success(
	successTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement,
	events
);


// КАТАЛОГ

events.on("catalog:changed", () => {
  const items = catalogModel.getItems();

  const cards = items.map((item) => {
    const cardElement =
      cardCatalogTemplate.content.firstElementChild?.cloneNode(
        true,
      ) as HTMLElement;

    const card = new CardCatalog(cardElement, events);

    return card.render({
      id: item.id,
      title: item.title,
      price: item.price,
      image: `${CDN_URL}${item.image}`,
      category: item.category,
    });
  });

  gallery.catalog = cards;
});

// ОТКРЫТИЕ PREVIEW

events.on("card:select", (data: { id: string }) => {
  const item = catalogModel.getItem(data.id);

  if (item) {
    catalogModel.setPreview(item);
  }
});

events.on("preview:changed", () => {
  const item = catalogModel.getPreview();

  if (!item) {
    return;
  }

  const cardElement = cardPreviewTemplate.content.firstElementChild?.cloneNode(
    true,
  ) as HTMLElement;

  const previewCard = new CardPreview(cardElement, events);

  const card = previewCard.render({
    id: item.id,
    title: item.title,
    description: item.description,
    price: item.price,
    image: `${CDN_URL}${item.image}`,
    category: item.category,
  });

  // Логика кнопки preview
  if (item.price === null) {
    previewCard.buttonText = "Недоступно";
    previewCard.buttonDisabled = true;
  } else if (basketModel.hasItem(item.id)) {
    previewCard.buttonText = "Удалить из корзины";
    previewCard.buttonDisabled = false;
  } else {
    previewCard.buttonText = "Купить";
    previewCard.buttonDisabled = false;
  }

  modal.render({
    content: card,
  });

  modal.open();
});

// ДОБАВЛЕНИЕ В КОРЗИНУ

events.on("card:add", (data: { id: string }) => {
  const item = catalogModel.getItem(data.id);

  if (item) {
    basketModel.addItem(item);
    modal.close();
  }
});

events.on("basket:open", () => {
  const items = basketModel.getItems();

  const basketCards = items.map((item, index) => {
    const cardElement = cardBasketTemplate.content.firstElementChild?.cloneNode(
      true,
    ) as HTMLElement;

    const card = new CardBasket(cardElement, events);

    return card.render({
      id: item.id,
      title: item.title,
      price: item.price,
      index: index + 1,
    });
  });

  basket.items = basketCards;
  basket.total = basketModel.getTotal();

  modal.render({
    content: basket.render(),
  });

  modal.open();
});

// УДАЛЕНИЕ ИЗ КОРЗИНЫ

events.on("basket:remove", (data: { id: string }) => {
  const item = catalogModel.getItem(data.id);

  if (item) {
    basketModel.removeItem(item);
  }
});

// УДАЛЕНИЕ ИЗ PREVIEW

events.on("card:remove", (data: { id: string }) => {
  const item = catalogModel.getItem(data.id);

  if (item) {
    basketModel.removeItem(item);
    modal.close();
  }
});

// ОБНОВЛЕНИЕ СЧЕТЧИКА

events.on("basket:changed", () => {
  header.counter = basketModel.getCount();

  const items = basketModel.getItems();

  const basketCards = items.map((item, index) => {
    const cardElement = cardBasketTemplate.content.firstElementChild?.cloneNode(
      true,
    ) as HTMLElement;

    const card = new CardBasket(cardElement, events);

    return card.render({
      id: item.id,
      title: item.title,
      price: item.price,
      index: index + 1,
    });
  });

  basket.items = basketCards;
  basket.total = basketModel.getTotal();
});

// ОТКРЫТИЕ ФОРМЫ ЗАКАЗА
events.on("order:open", () => {
  modal.render({
    content: order.render({
      address: "",
      valid: false,
      errors: "",
    }),
  });

  modal.open();
});

// Выбор способа оплаты

events.on("order.payment:change", (data: { field: string; value: string }) => {
  buyerModel.setData({
    payment: data.value as "card" | "cash",
  });
});

// Ввод адреса

events.on("order.address:change", (data: { field: string; value: string }) => {
  buyerModel.setData({
    address: data.value,
  });
});

// Переход ко второй форме

events.on('order:submit', () => {
	modal.render({
		content: contacts.render({
			email: '',
			phone: '',
			valid: false,
			errors: ''
		})
	});

	modal.open();
});

//Обновление формы при изменении покупателя

events.on('buyer:changed', () => {
	const data = buyerModel.getData();
	const errors = buyerModel.validate();

	order.render({
		payment: data.payment,
		address: data.address,
		valid: !errors.address && !errors.payment,
		errors: errors.address || errors.payment || ''
	});

	contacts.render({
		email: data.email,
		phone: data.phone,
		valid: !errors.email && !errors.phone,
		errors: errors.email || errors.phone || ''
	});
});

//Обработка email и телефона 

events.on('contacts.email:change', (data: { field: string; value: string }) => {
	buyerModel.setData({
		email: data.value
	});
});

events.on('contacts.phone:change', (data: { field: string; value: string }) => {
	buyerModel.setData({
		phone: data.value
	});
});

// отравка заказа 

events.on('contacts:submit', () => {
	const buyer = buyerModel.getData();

	webLarekApi
		.createOrder({
			payment: buyer.payment,
			address: buyer.address,
			email: buyer.email,
			phone: buyer.phone,
			total: basketModel.getTotal(),
			items: basketModel.getItems().map((item) => item.id)
		})
		.then((result) => {
			success.total = result.total;

			basketModel.clear();
			buyerModel.clear();

			modal.render({
				content: success.render()
			});

			modal.open();
		})
		.catch((error) => {
			console.error('Ошибка оформления заказа:', error);
		});
});

// Заказ оформлен
events.on('success:close', () => {
	modal.close();
});

// ЗАГРУЗКА КАТАЛОГА

webLarekApi
  .getProducts()
  .then((data) => {
    catalogModel.setItems(data.items);
  })
  .catch((error) => {
    console.error("Ошибка загрузки каталога:", error);
  });
