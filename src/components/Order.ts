import { ensureAllElements, ensureElement } from "../utils/utils";
import { IBuyer } from "../types";
import { IEvents } from "./base/Events";
import { Form } from "./base/Form";

export class Order extends Form<Pick<IBuyer, "payment" | "address">> {
  protected paymentButtons: HTMLButtonElement[];
  protected addressInput: HTMLInputElement;

  constructor(
    container: HTMLFormElement,
    protected events: IEvents,
  ) {
    super(container, events);

    this.paymentButtons = ensureAllElements<HTMLButtonElement>(
      ".order__buttons .button",
      this.container,
    );

    this.addressInput = ensureElement<HTMLInputElement>(
      'input[name="address"]',
      this.container,
    );

    this.paymentButtons.forEach((button) => {
      button.addEventListener("click", () => {
        this.events.emit("order.payment:change", {
          field: "payment",
          value: button.textContent === "Онлайн" ? "card" : "cash",
        });
      });
    });

    this.addressInput.addEventListener("input", () => {
      this.events.emit("order.address:change", {
        field: "address",
        value: this.addressInput.value,
      });
    });

    this.container.addEventListener("submit", (event: Event) => {
      event.preventDefault();
      this.events.emit("order:submit");
    });
  }

set payment(value: string) {
	this.paymentButtons.forEach((button) => {
		const paymentType = button.textContent === 'Онлайн' ? 'card' : 'cash';
		button.classList.toggle('button_alt-active', paymentType === value);
	});
}

  set address(value: string) {
    this.addressInput.value = value;
  }
}
