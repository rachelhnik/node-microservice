import * as repository from "../respository/cart.repository";
import { CartRepositoryType } from "../respository/cart.repository";

import { CreateCart } from "./cart.service";

describe("Cart Service", () => {
  let repo: CartRepositoryType;

  beforeEach(() => {
    repo = repository.CartRespository;
  });

  afterEach(() => {
    repo = {} as CartRepositoryType;
  });

  it("should return correct data while creating cart", async () => {
    const mockCart = {
      productId: 123,
      customerId: 2,
      qty: 3,
    };

    jest.spyOn(repository.CartRespository, "createCart");
    // .mockImplementationOnce(() =>
    //   Promise.resolve({
    //     message: "fake response from cart repository",
    //     input: mockCart,
    //   })
    // );

    const res = await CreateCart(mockCart, repo);

    expect(res).toEqual({
      message: "fake response from cart repository",
      input: mockCart,
    });
  });
});
