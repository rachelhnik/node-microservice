CREATE TABLE IF NOT EXISTS "order_line_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"item_name" varchar NOT NULL,
	"qty" integer NOT NULL,
	"amount" numeric NOT NULL,
	"order_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_number" integer NOT NULL,
	"customer_id" integer NOT NULL,
	"amount" numeric NOT NULL,
	"status" varchar DEFAULT 'pending',
	"txn_id" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "orders_order_number_unique" UNIQUE("order_number"),
	CONSTRAINT "orders_customer_id_unique" UNIQUE("customer_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_line_items" ADD CONSTRAINT "order_line_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
