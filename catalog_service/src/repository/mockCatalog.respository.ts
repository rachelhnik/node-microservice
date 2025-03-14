import { ICatalogRepository } from "../interface/catalogRepository.interface";
import { Product } from "../models/product.model";

export class MockCatalogRepository implements ICatalogRepository {
  create(data: Product): Promise<Product> {
    const mockResponse = {
      ...data,
      id: 123,
    };

    return Promise.resolve(mockResponse);
  }
  update(data: Product): Promise<Product> {
    return Promise.resolve(data);
  }
  findStock(ids: number[]): Promise<Product[]> {
    return Promise.resolve([]);
  }
  delete(id: any) {
    return Promise.resolve(id);
  }
  find(limit: number, offset: number): Promise<Product[]> {
    return Promise.resolve([]);
  }
  findOne(id: number): Promise<Product> {
    return Promise.resolve({ id } as unknown as Product);
  }
}
