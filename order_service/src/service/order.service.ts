import { OrderRepositoryType } from "../respository/order.repository";
import { CartRepositoryType } from "../respository/cart.repository";
import { OrderStatus } from "../types/order.types";
import {
  InProcessOrder,
  OrderLineItemType,
  OrderWithLineItems,
} from "../dtos/orderRequest.dto";
import { MessageType } from "../types";
import { SendCreateOrderMessage } from "./broker.service";
import { GetStockDetails, NotFoundError } from "../utils";

export const CreateOrder = async (
  userId: number,
  repo: OrderRepositoryType,
  cartRepo: CartRepositoryType
) => {
  // find cart by customer id
  const cart = await cartRepo.getCart(userId);

  if (!cart) {
    throw new NotFoundError("Cart not found.");
  }
  // calculate total ordre amount
  let cartTotal = 0;
  let orderLineItems: OrderLineItemType[] = [];

  const itemIds = cart.lineItems.map((item) => item.productId);

  const stockData = await GetStockDetails(itemIds);

  // create orderline items from cart items
  cart.lineItems.forEach((item) => {
    const stockItemData = stockData.find(
      (itemdata) => itemdata.id == item.productId
    );

    if (stockItemData && stockItemData?.stock < item.qty) {
      throw new Error(
        `Only ${stockItemData.stock} items left for ${stockItemData.name}.`
      );
    }
    cartTotal += item.qty * Number(item.price);
    orderLineItems.push({
      productId: item.productId,
      itemName: item.itemName,
      qty: item.qty,
      price: item.price,
    } as OrderLineItemType);
  });

  const orderNumber = Math.floor(Math.random() * 1000000);

  // create order with line items
  const orderInput: OrderWithLineItems = {
    orderNumber: orderNumber,
    txnId: null,
    status: OrderStatus.PENDING,
    customerId: userId,
    amount: cartTotal.toString(),
    orderItems: orderLineItems,
  };

  await repo.createOrder(orderInput);
  await cartRepo.clearCartData(cart.id);
  // console.log("Order created", order);
  // fire a message to subscription service [catalog service] to update stock
  await SendCreateOrderMessage(orderInput);

  // return success message
  return { message: "Order created successfully", orderNumber: orderNumber };
};

export const UpdateOrder = async (
  orderId: number,
  status: string,
  repo: OrderRepositoryType
) => {
  await repo.updateOrder(orderId, status);
  if (status === OrderStatus.CANCELLED) {
    // await repo.publishOrderEvent(order, "ORDER_CANCELLED");
  }
  return { message: "Order updated successfully" };
};

export const GetOrder = async (orderId: number, repo: OrderRepositoryType) => {
  const order = await repo.findOrder(orderId);
  if (!order) {
    throw new NotFoundError("Order not found.");
  }
  return order;
};

export const GetOrders = async (userId: number, repo: OrderRepositoryType) => {
  const orders = await repo.findOrdersByCustomerId(userId);
  if (!Array.isArray(orders)) {
    throw new NotFoundError("Orders not found.");
  }
  return orders;
};

export const DeleteOrder = async (
  orderId: number,
  repo: OrderRepositoryType
) => {
  return await repo.deleteOrder(orderId);
};

export const HandleSubscription = async (message: MessageType) => {
  console.log("Message received by order Kafka consumer", message);
  // if (message.event === OrderEvent.ORDER_UPDATED) {
  // call create order
};

export const CheckoutOrder = async (
  orderNumber: number,
  repo: OrderRepositoryType
) => {
  const order = await repo.findOrderByOrderNumber(orderNumber);
  if (!order) {
    throw new NotFoundError("Order not found.");
  }
  const checkoutOrder: InProcessOrder = {
    id: Number(order?.id),
    orderNumber: order.orderNumber,
    customerId: order.customerId,
    status: order.status,
    amount: Number(order.amount),
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
  return checkoutOrder;
};
