import express, { NextFunction, Request, Response } from "express";
import { CatalogService } from "../services/catalog.service";
import { CatalogRepository } from "../repository/catalog.respository";
import { RequestValidator } from "../utils/requestValidator";
import {
  CreateProductRequest,
  EditProductRequest,
  GetAllProductsRequest,
  GetStockRequest,
  IdRequest,
} from "../dto/product.dto";
import { BrokerService } from "../services/broker.service";

const router = express.Router();

export const catalogService = new CatalogService(new CatalogRepository());

const brokerService = new BrokerService(catalogService);

brokerService.initializeBroker();

router.post(
  "/products",
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { errors, input } = await RequestValidator(
        CreateProductRequest,
        req.body
      );

      if (errors) {
        res.status(400).json(errors);
      }
      const data = await catalogService.createProduct(input);
      return res.status(201).json(data);
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  "/products/:id",
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { errors, input } = await RequestValidator(
        EditProductRequest,
        req.body
      );
      if (errors) {
        return res.status(400).json(errors);
      }
      const id = parseInt(req.params.id) || 0;
      const data = await catalogService.updateProduct({ ...input, id });
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/products",
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const limit = req.query["limit"] ? Number(req.query["limit"]) : 20;
    const offset = req.query["offset"] ? Number(req.query["offset"]) : 0;

    try {
      const { errors, input } = await RequestValidator(
        GetAllProductsRequest,
        req.params
      );
      if (errors) {
        return res.status(400).json(errors);
      }
      const data = await catalogService.getAllProducts(limit, offset);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/products/:id",
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const id = parseInt(req.params.id) || 0;
    try {
      const { errors, input } = await RequestValidator(IdRequest, req.params);
      if (errors) {
        return res.status(400).json(errors);
      }
      const data = await catalogService.getSingleProduct(id);
      return res.status(200).json(data);
    } catch (error) {
      return next(error);
    }
  }
);

router.post(
  "/products/stock",
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { errors, input } = await RequestValidator(
        GetStockRequest,
        req.body
      );
      if (errors) {
        return res.status(400).json(errors);
      }
      const data = await catalogService.getProductStock(req.body.ids);
      return res.status(200).json(data);
    } catch (error) {
      return next(error);
    }
  }
);

router.delete(
  "/products/:id",
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { errors, input } = await RequestValidator(IdRequest, req.params);
      if (errors) {
        return res.status(400).json(errors);
      }
      const id = parseInt(req.params.id) || 0;
      const data = await catalogService.deleteProduct(id);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
