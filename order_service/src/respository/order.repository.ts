import { eq } from "drizzle-orm";
import { DB } from "../db/db.connection";
import { orderLineItems, orders } from "../db/schema";
import { OrderWithLineItems } from "../dtos/orderRequest.dto";
import { NotFoundError } from "../utils";

export type OrderRepositoryType = {
  createOrder: (lineItem: OrderWithLineItems) => Promise<number>;
  findOrder: (id: number) => Promise<OrderWithLineItems | null>;
  findOrderByOrderNumber: (
    orderNumber: number
  ) => Promise<OrderWithLineItems | null>;
  updateOrder: (id: number, status: string) => Promise<OrderWithLineItems>;
  updateOrderByOrderNumber: (
    orderNumber: number,
    status: string
  ) => Promise<boolean>;
  deleteOrder: (id: number) => Promise<boolean>;
  findOrdersByCustomerId: (customerId: number) => Promise<OrderWithLineItems[]>;
};

const createOrder = async (lineItem: OrderWithLineItems): Promise<number> => {
  const result = await DB.insert(orders)
    .values({
      customerId: lineItem.customerId,
      orderNumber: lineItem.orderNumber,
      status: lineItem.status,
      txnId: lineItem.txnId,
      amount: lineItem.amount,
    })
    .returning();

  const [{ id }] = result;

  if (id > 0) {
    for (const item of lineItem.orderItems) {
      console.log("item", item);
      await DB.insert(orderLineItems)
        .values({
          orderId: id,
          itemId: item.productId,
          itemName: item.itemName,
          price: item.price,
          qty: item.qty,
        })
        .execute();
    }
  }

  return id;
};

const findOrder = async (id: number): Promise<OrderWithLineItems | null> => {
  const order = await DB.query.orders.findFirst({
    where: (orders, { eq }) => eq(orders.id, id),
    with: {
      lineItems: true,
    },
  });

  if (!order) {
    throw new NotFoundError("Order not found.");
  }

  return order as unknown as OrderWithLineItems;
};

const findOrderByOrderNumber = async (
  orderNumber: number
): Promise<OrderWithLineItems | null> => {
  const order = await DB.query.orders.findFirst({
    where: (orders, { eq }) => eq(orders.orderNumber, orderNumber),
    with: {
      lineItems: true,
    },
  });

  if (!order) {
    throw new NotFoundError("Order not found.");
  }
  console.log("**", order);

  return order as unknown as OrderWithLineItems;
};

const updateOrder = async (
  id: number,
  status: string
): Promise<OrderWithLineItems> => {
  await DB.update(orders)
    .set({
      status: status,
    })
    .where(eq(orders.id, id))
    .execute();

  const order = await findOrder(id);
  if (!order) {
    throw new NotFoundError("Order not found.");
  }
  return order;
};

const updateOrderByOrderNumber = async (
  orderNumber: number,
  status: string
): Promise<boolean> => {
  console.log("HIII", orderNumber, status);
  await DB.update(orders)
    .set({
      status: status,
    })
    .where(eq(orders.orderNumber, orderNumber))
    .execute();

  return true;
};

const deleteOrder = async (id: number): Promise<boolean> => {
  await findOrder(id);
  await DB.delete(orders).where(eq(orders.id, id)).execute();

  return true;
};

const findOrdersByCustomerId = async (
  customerId: number
): Promise<OrderWithLineItems[]> => {
  const orders = await DB.query.orders.findMany({
    where: (orders, { eq }) => eq(orders.customerId, customerId),
    with: {
      lineItems: true,
    },
  });

  return orders as unknown as OrderWithLineItems[];
};

export const OrderRepository: OrderRepositoryType = {
  createOrder,
  findOrder,
  findOrderByOrderNumber,
  updateOrder,
  updateOrderByOrderNumber,
  deleteOrder,
  findOrdersByCustomerId,
};
