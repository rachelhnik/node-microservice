import express from "express";
import CatalogRoutes, { catalogService } from "../catalog.route";
import { faker } from "@faker-js/faker/.";
import request from "supertest";
import { ProductFactory } from "../../utils/fixtures";

const app = express();
app.use(express.json());
app.use(CatalogRoutes);

const mockProduct = () => {
  return {
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    stock: faker.number.int({ min: 1, max: 100 }),
    price: faker.number.int({ min: 10, max: 10000 }),
  };
};

describe("Catalog Routes", () => {
  describe("POST /products", () => {
    test("should create a product successfully", async () => {
      const reqBody = mockProduct();
      const product = ProductFactory.build();
      jest
        .spyOn(catalogService, "createProduct")
        .mockImplementationOnce(() => Promise.resolve(product));
      const response = await request(app)
        .post("/products")
        .send(reqBody)
        .set("Accept", "application/json");
      expect(response.status).toEqual(201);
      expect(response.body).toMatchObject(product);
    });
    test("should throw error on bad request", async () => {
      const reqBody = mockProduct();
      const response = await request(app)
        .post("/products")
        .send({ ...reqBody, name: "" })
        .set("Accept", "application/json");
      expect(response.status).toEqual(400);
      expect(response.body).toEqual("name should not be empty");
    });
    test("should throw error on internal server error", async () => {
      const reqBody = mockProduct();
      jest
        .spyOn(catalogService, "createProduct")
        .mockImplementationOnce(() =>
          Promise.reject(new Error("Internal server error."))
        );
      const response = await request(app)
        .post("/products")
        .send(reqBody)
        .set("Accept", "application/json");
      expect(response.status).toEqual(500);
      expect(response.body).toEqual("Internal server error.");
    });
  });

  describe("PATCH /products/:id", () => {
    test("should update a product", async () => {
      const product = ProductFactory.build();
      const req = {
        name: product.name,
        stock: product.stock,
        price: product.price,
      };
      jest
        .spyOn(catalogService, "updateProduct")
        .mockImplementationOnce(() => Promise.resolve(product));
      const response = await request(app)
        .patch(`/products/${product.id}`)
        .send(req)
        .set("Accept", "application/json");

      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject(product);
    });
    test("should return validation error with 400", async () => {
      const product = ProductFactory.build();
      const req = {
        name: product.name,
        stock: product.stock,
        price: -2,
      };
      const response = await request(app)
        .patch(`/products/${product.id}`)
        .send(req)
        .set("Accept", "application/json");
      expect(response.status).toEqual(400);
    });
    test("should return internal server error with 500", async () => {
      const product = ProductFactory.build();
      const req = {
        name: product.name,
        stock: product.stock,
        price: product.price,
      };
      jest
        .spyOn(catalogService, "updateProduct")
        .mockImplementationOnce(() =>
          Promise.reject(new Error("Internal server error."))
        );
      const response = await request(app)
        .patch(`/products/${product.id}`)
        .send(req)
        .set("Accept", "application/json");
      expect(response.status).toEqual(500);
    });
  });

  describe("GET /products?limit=0&offset=0", () => {
    test("should return a range of products based on limit and offset", async () => {
      const randomLimit = faker.number.int({ min: 10, max: 50 });
      const products = ProductFactory.buildList(randomLimit);
      jest
        .spyOn(catalogService, "getAllProducts")
        .mockImplementationOnce(() => Promise.resolve(products));
      const response = await request(app)
        .get(`/products?limit=${randomLimit}&offset=0`)
        .set("Accept", "application/json");
      expect(response.status).toBe(200);
      expect(response.body).toEqual(products);
    });
  });

  describe("GET /products/:id", () => {
    test("should return a product by id", async () => {
      const product = ProductFactory.build();
      jest
        .spyOn(catalogService, "getSingleProduct")
        .mockImplementationOnce(() => Promise.resolve(product));
      const response = await request(app)
        .get(`/products/${product.id}`)
        .set("Accept", "application/json");
      expect(response.status).toBe(200);
      expect(response.body).toEqual(product);
    });
  });

  describe("DELETE /products/:id", () => {
    test("should delete product successfully", async () => {
      const product = ProductFactory.build();

      jest
        .spyOn(catalogService, "deleteProduct")
        .mockImplementationOnce(() => Promise.resolve({ id: product.id }));
      const response = await request(app)
        .delete(`/products/${product.id}`)
        .set("Accept", "application/json");
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ id: product.id });
    });
  });
});
