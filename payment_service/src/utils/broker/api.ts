import axios from "axios";

import { logger } from "../logger";
import { AuthorizationError, NotFoundError } from "../errors";
import { User } from "../../dtos/user.Model";
import { InProcessOrder } from "../../dtos/order.Model";

const ORDER_BASE_URL = process.env.ORDER_BASE_URL || "http://localhost:9090";

const AUTH_SERVICE_BASE_URL =
  process.env.AUTH_SERVICE_BASE_URL || "http://localhost:9050/auth";

export const GetOrderDetails = async (orderNumber: number) => {
  try {
    const response = await axios.get(
      `${ORDER_BASE_URL}/orders/${orderNumber}/checkout`
    );
    return response.data as InProcessOrder;
  } catch (error) {
    logger.error(error);
    throw new NotFoundError("Product not found.");
  }
};

export const validateUser = async (token: string) => {
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
