"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderItemRelations = exports.orderRelations = exports.orderLineItems = exports.orders = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
exports.orders = (0, pg_core_1.pgTable)("orders", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    orderNumber: (0, pg_core_1.integer)("order_number").notNull().unique(),
    customerId: (0, pg_core_1.integer)("customer_id").notNull(),
    amount: (0, pg_core_1.numeric)("amount").notNull(),
    status: (0, pg_core_1.varchar)("status").default("pending"),
    txnId: (0, pg_core_1.varchar)("txn_id"),
    createdAt: (0, pg_core_1.timestamp)("created_at").notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").notNull().defaultNow(),
});
exports.orderLineItems = (0, pg_core_1.pgTable)("order_line_items", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    itemName: (0, pg_core_1.varchar)("item_name").notNull(),
    itemId: (0, pg_core_1.integer)("item_id").notNull(),
    qty: (0, pg_core_1.integer)("qty").notNull(),
    price: (0, pg_core_1.numeric)("amount").notNull(),
    orderId: (0, pg_core_1.integer)("order_id")
        .references(() => exports.orders.id, { onDelete: "cascade" })
        .notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").notNull().defaultNow(),
});
exports.orderRelations = (0, drizzle_orm_1.relations)(exports.orders, ({ many }) => ({
    lineItems: many(exports.orderLineItems),
}));
exports.orderItemRelations = (0, drizzle_orm_1.relations)(exports.orderLineItems, ({ one }) => ({
    order: one(exports.orders, {
        fields: [exports.orderLineItems.orderId],
        references: [exports.orders.id],
    }),
}));
