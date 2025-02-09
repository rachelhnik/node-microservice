import { faker } from "@faker-js/faker/.";
import { ICatalogRepository } from "../../interface/catalogRepository.interface";
import { MockCatalogRepository } from "../../repository/mockCatalog.respository";
import { CatalogService } from "../catalog.service";
import { Product } from "../../models/product.model";
import { ProductFactory } from "../../utils/fixtures";

const mockProduct = (rest: any) => {
  return {
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    stock: faker.number.int({ min: 10, max: 100 }),
    ...rest,
  };
};

describe("catalogService", () => {
  let repository: ICatalogRepository;

  beforeEach(() => {
    repository = new MockCatalogRepository();
  });
  afterEach(() => {
    repository = {} as MockCatalogRepository;
  });

  describe("create product", () => {
    test("should create product", async () => {
      const service = new CatalogService(repository);
      const reqBody = mockProduct({
        price: +faker.commerce.price(),
      });
      const result = await service.createProduct(reqBody);
      expect(result).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
        description: expect.any(String),
        price: expect.any(Number),
        stock: expect.any(Number),
      });
    });
    test("should throw error with unable to create product", async () => {
      const service = new CatalogService(repository);
      const reqBody = mockProduct({
        price: +faker.commerce.price(),
      });
      jest
        .spyOn(repository, "create")
        .mockImplementationOnce(() => Promise.resolve({} as Product));
      await expect(service.createProduct(reqBody)).rejects.toThrow(
        "Unable to create product."
      );
    });
    test("should throw error with product already exists", async () => {
      const service = new CatalogService(repository);
      const reqBody = mockProduct({
        price: +faker.commerce.price(),
      });
      jest
        .spyOn(repository, "create")
        .mockImplementationOnce(() =>
          Promise.reject(new Error("Product already exists."))
        );
      await expect(service.createProduct(reqBody)).rejects.toThrow(
        "Product already exists."
      );
    });
  });

  describe("update product", () => {
    test("should update product", async () => {
      const service = new CatalogService(repository);
      const reqBody = mockProduct({
        price: +faker.commerce.price(),
        id: faker.number.int({ min: 10, max: 1000 }),
      });
      const result = await service.updateProduct(reqBody);
      expect(result).toMatchObject(reqBody);
    });
    test("should throw error with product does not exist", async () => {
      const service = new CatalogService(repository);

      jest
        .spyOn(repository, "update")
        .mockImplementationOnce(() =>
          Promise.reject(new Error("Product does not exist."))
        );

      await expect(service.updateProduct({})).rejects.toThrow(
        "Product does not exist."
      );
    });
  });

  describe("find products", () => {
    test("should find all products", async () => {
      const service = new CatalogService(repository);
      const randomLimit = faker.number.int({ min: 10, max: 50 });
      const products = ProductFactory.buildList(randomLimit);
      jest
        .spyOn(repository, "find")
        .mockImplementationOnce(() => Promise.resolve(products));
      const result = await service.getAllProducts(randomLimit, 0);
      expect(result.length).toEqual(randomLimit);
      expect(result).toMatchObject(products);
    });

    test("should throw error with product does not exist", async () => {
      const service = new CatalogService(repository);

      jest
        .spyOn(repository, "find")
        .mockImplementationOnce(() =>
          Promise.reject(new Error("products does not exist"))
        );

      await expect(service.getAllProducts(0, 0)).rejects.toThrow(
        "products does not exist"
      );
    });
  });

  describe("find product", () => {
    test("should find a product by id", async () => {
      const service = new CatalogService(repository);

      const product = ProductFactory.build();
      jest
        .spyOn(repository, "findOne")
        .mockImplementationOnce(() => Promise.resolve(product));
      const result = await service.getSingleProduct(product.id);
      expect(result).toMatchObject(product);
    });
  });

  describe("delete product", () => {
    test("should delete a product by id ", async () => {
      const service = new CatalogService(repository);

      const product = ProductFactory.build();
      jest
        .spyOn(repository, "delete")
        .mockImplementationOnce(() => Promise.resolve({ id: product.id }));
      const result = await service.deleteProduct(product.id);
      expect(result).toMatchObject({ id: product.id });
    });
  });
});
