import { PrismaClient } from "@prisma/client";
import { ICatalogRepository } from "../interface/catalogRepository.interface";
import { Product } from "../models/product.model";
import { NotFoundError } from "@prisma/client/runtime/library";

export class CatalogRepository implements ICatalogRepository {
  _prisma: PrismaClient;

  constructor() {
    this._prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL, // Explicitly use the env var
        },
      },
    });
  }
  create(data: Product): Promise<Product> {
    return this._prisma.product.create({ data });
  }
  update(data: Product): Promise<Product> {
    return this._prisma.product.update({
      where: { id: data.id },
      data,
    });
  }
  delete(id: any) {
    return this._prisma.product.delete({
      where: { id },
    });
  }
  find(limit: number, offset: number): Promise<Product[]> {
    return this._prisma.product.findMany({
      take: limit,
      skip: offset,
    });
  }
  async findOne(id: number): Promise<Product | null> {
    const product = await this._prisma.product.findFirst({
      where: { id },
    });

    return Promise.resolve(product);
  }

  async findStock(ids: number[]): Promise<Product[]> {
    return await this._prisma.product.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }
}
