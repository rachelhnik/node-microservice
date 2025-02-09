export interface InProcessOrder {
  id?: number;
  orderNumber: number;
  customerId: number;
  status: string;
  amount: number;
  createdAt?: Date;
  updatedAt?: Date;
}
