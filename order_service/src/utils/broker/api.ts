import axios from "axios";
import { Product } from "../../dtos/product.dto";
import { logger } from "../logger";
import { AuthorizationError, NotFoundError } from "../errors";
import { User } from "../../dtos/user.Model";

const CATALOG_BASE_URL =
  process.env.CATALOG_BASE_URL || "http://localhost:9051";

const AUTH_SERVICE_BASE_URL =
  process.env.AUTH_SERVICE_BASE_URL || "http://localhost:9050/auth";

export const getProductDetails = async (id: number) => {
  try {
    const response = await axios.get(`${CATALOG_BASE_URL}/products/${id}`);
    return response.data as Product;
  } catch (error) {
    logger.error(error);
    throw new NotFoundError("product not found");
  }
};

export const GetStockDetails = async (ids: number[]) => {
  try {
    const response = await axios.post(`${CATALOG_BASE_URL}/products/stock`, {
      ids,
    });
    return response.data as Product[];
  } catch (error) {
    logger.error(error);
    throw new NotFoundError("error on getting stock details");
  }
};

export const validateUser = async (token: string) => {
  console.log("auth url", AUTH_SERVICE_BASE_URL);
  try {
    const response = await axios.get(`${AUTH_SERVICE_BASE_URL}/validate`, {
      headers: {
        Authorization: token,
      },
    });

    if (response.status !== 200) {
      throw new AuthorizationError("user not authorised");
    }
    return response.data as User;
  } catch (error) {
    throw new AuthorizationError("user not authorized");
  }
};
