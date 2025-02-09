import { ICatalogRepository } from "../interface/catalogRepository.interface";

export class CatalogService {
  private _repository: ICatalogRepository;
  constructor(repository: ICatalogRepository) {
    this._repository = repository;
  }

  async createProduct(input: any) {
    const data = await this._repository.create(input);
    if (!data.id) {
      throw new Error("Unable to create product.");
    }
    return data;
  }

  async updateProduct(input: any) {
    const data = await this._repository.update(input);
    if (!data.id) {
      throw new Error("Product does not exist.");
    }
    return data;
  }

  async deleteProduct(id: any) {
    const data = await this._repository.delete(id);
    return data;
  }

  async getAllProducts(limit: number, offset: number) {
    const data = await this._repository.find(limit, offset);
    return data;
  }

  async getSingleProduct(id: number) {
    const data = await this._repository.findOne(id);
    return data;
  }

  async getProductStock(ids: number[]) {
    const data = await this._repository.findStock(ids);
    if (!data) {
      throw new Error("unable to find product stock details.");
    }
    return data;
  }
}
