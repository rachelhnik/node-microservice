export class Product {
  constructor(
    public readonly name: string,
    public readonly id: number,
    public readonly stock: number,
    public readonly price: number,
    public readonly description: string
  ) {}
}
