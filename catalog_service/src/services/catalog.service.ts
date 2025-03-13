import { ICatalogRepository } from "../interface/catalogRepository.interface";
import { OrderWithLineItems } from "../types";

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
    if (!data) {
      throw new Error("Something wrong with deleting the product.");
    }
    return data;
  }

  async getAllProducts(limit: number, offset: number) {
    const data = await this._repository.find(limit, offset);

    return data;
  }

  async getSingleProduct(id: number) {
    const data = await this._repository.findOne(id);
    if (!data) {
      throw new Error("Product is not found.");
    }
    return data;
  }

  async getProductStock(ids: number[]) {
    const data = await this._repository.findStock(ids);
    if (!data) {
      throw new Error("Unable to find product stock details.");
    }
    return data;
  }

  async handleBrokerMessage(message: any) {
    console.log("Catalog service receives event", message);
    const orderdata = message.data as OrderWithLineItems;
    const { orderItems } = orderdata;
    orderItems.forEach(async (item) => {
      console.log("Updating stock for item", item.productId, item.qty);
      const product = await this.getSingleProduct(item.productId);
      if (!product) {
        throw new Error("product not found.");
      }
      const updatedStock = product.stock - item.qty;
      await this.updateProduct({ ...product, stock: updatedStock });
    });
  }
}
