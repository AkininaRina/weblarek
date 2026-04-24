import "./scss/styles.scss";

import { Api } from "./components/base/Api";
import { EventEmitter } from "./components/base/Events";
import { WebLarekApi } from "./components/Communication/WebLarekApi";

import { API_URL, CDN_URL } from "./utils/constants";
import { ensureElement, cloneTemplate } from "./utils/utils";

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
import { IProduct } from "./types";
import { Order } from "./components/Order";

import { Contacts } from "./components/Contacts";
import { Success } from "./components/Success";

const events = new EventEmitter();

// МОДЕЛИ
const catalogModel = new CatalogModel(events);
const basketModel = new BasketModel(events);
const buyerModel = new BuyerModel(events);

// API
const api = new Api(API_URL);
const webLarekApi = new WebLarekApi(api);

// ОСНОВНЫЕ VIEW
const header = new Header(events, ensureElement<HTMLElement>(".header"));

const gallery = new Gallery(ensureElement<HTMLElement>(".gallery"));

const modal = new Modal(events, ensureElement<HTMLElement>("#modal-container"));

// ШАБЛОНЫ
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>("#card-catalog");

const cardPreviewTemplate = ensureElement<HTMLTemplateElement>("#card-preview");

const basketTemplate = ensureElement<HTMLTemplateElement>("#basket");

const cardBasketTemplate = ensureElement<HTMLTemplateElement>("#card-basket");
const orderTemplate = ensureElement<HTMLTemplateElement>("#order");

const contactsTemplate = ensureElement<HTMLTemplateElement>("#contacts");
const successTemplate = ensureElement<HTMLTemplateElement>("#success");

const basket = new Basket(
  events,
  cloneTemplate<HTMLElement>(basketTemplate)
);

const order = new Order(
  cloneTemplate<HTMLFormElement>(orderTemplate),
  events,
);

const contacts = new Contacts(
 cloneTemplate<HTMLFormElement>(contactsTemplate),
  events,
);

const success = new Success(
  cloneTemplate<HTMLElement>(successTemplate),
  events,
);

// КАТАЛОГ

events.on("catalog:changed", () => {
  const items = catalogModel.getItems();

  const cards = items.map((item) => {
    const cardElement =
    cloneTemplate<HTMLElement>(cardCatalogTemplate);

    const card = new CardCatalog(cardElement, {
      onClick: () => {
        events.emit("card:select", item);
      },
    });

    return card.render({
      title: item.title,
      price: item.price,
      image: `${CDN_URL}${item.image}`,
      category: item.category,
    });
  });

  gallery.catalog = cards;
});

// ОТКРЫТИЕ PREVIEW

events.on("card:select", (item: IProduct) => {
  catalogModel.setPreview(item);
});

events.on("preview:changed", () => {
  const item = catalogModel.getPreview();

  if (!item) {
    return;
  }

  const cardElement = cloneTemplate<HTMLElement>(cardPreviewTemplate);

  const previewCard = new CardPreview(cardElement, {
    onClick: () => {
      if (basketModel.hasItem(item.id)) {
        basketModel.removeItem(item);
      } else {
        basketModel.addItem(item);
      }

      modal.close();
    },
  });

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

events.on("basket:open", () => {
	modal.render({
		content: basket.render(),
	});

	modal.open();
});

// ОБНОВЛЕНИЕ СЧЕТЧИКА

events.on("basket:changed", () => {
  header.counter = basketModel.getCount();

  const items = basketModel.getItems();

  const basketCards = items.map((item, index) => {
   const cardElement = cloneTemplate<HTMLElement>(cardBasketTemplate);

    const card = new CardBasket(cardElement, () => {
      basketModel.removeItem(item);
    });

    card.index = index + 1;

    return card.render({
      title: item.title,
      price: item.price,
    });
  });

  basket.items = basketCards;
  basket.total = basketModel.getTotal();
});

// ОТКРЫТИЕ ФОРМЫ ЗАКАЗА
events.on("order:open", () => {
	const data = buyerModel.getData();
	const errors = buyerModel.validate();

	modal.render({
		content: order.render({
			payment: data.payment,
			address: data.address,
			valid: !errors.address && !errors.payment,
			errors: errors.address || errors.payment || "",
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

events.on("order:submit", () => {
	const data = buyerModel.getData();
	const errors = buyerModel.validate();

	modal.render({
		content: contacts.render({
			email: data.email,
			phone: data.phone,
			valid: !errors.email && !errors.phone,
			errors: errors.email || errors.phone || "",
		}),
	});

	modal.open();
});
//Обновление формы при изменении покупателя

events.on("buyer:changed", () => {
  const data = buyerModel.getData();
  const errors = buyerModel.validate();

  order.render({
    payment: data.payment,
    address: data.address,
    valid: !errors.address && !errors.payment,
    errors: errors.address || errors.payment || "",
  });

  contacts.render({
    email: data.email,
    phone: data.phone,
    valid: !errors.email && !errors.phone,
    errors: errors.email || errors.phone || "",
  });
});

//Обработка email и телефона

events.on("contacts.email:change", (data: { field: string; value: string }) => {
  buyerModel.setData({
    email: data.value,
  });
});

events.on("contacts.phone:change", (data: { field: string; value: string }) => {
  buyerModel.setData({
    phone: data.value,
  });
});

// отравка заказа

events.on("contacts:submit", () => {
  const buyer = buyerModel.getData();

  webLarekApi
    .createOrder({
      payment: buyer.payment,
      address: buyer.address,
      email: buyer.email,
      phone: buyer.phone,
      total: basketModel.getTotal(),
      items: basketModel.getItems().map((item) => item.id),
    })
    .then((result) => {
      success.total = result.total;

      basketModel.clear();
      buyerModel.clear();

      modal.render({
        content: success.render(),
      });

      modal.open();
    })
    .catch((error) => {
      console.error("Ошибка оформления заказа:", error);
    });
});

// Заказ оформлен
events.on("success:close", () => {
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
