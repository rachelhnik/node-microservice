export enum OrderStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export enum PaymentStatus {
  SUCCEEDED = "succeeded",
  INCOMPLETE = "incomplete",
  FAILED = "failed",
  CANCELLED = "cancelled",
  UNCAPTURED = "uncaptured",
}
