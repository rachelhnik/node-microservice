import {
  MessageType,
  OrderEvent,
  TOPIC_TYPE,
} from "../../types/subscription.types";

export interface PublishType {
  headers: Record<string, any>;
  topic: TOPIC_TYPE;
  event: OrderEvent;
  message: Record<string, any>;
}

export type MessageHandler = (input: MessageType) => void;

export type MessageBrokerType = {
  connectProducer: <T>() => Promise<T>;
  disconnectProducer: () => Promise<void>;
  publish: (data: PublishType) => Promise<boolean>;

  connectConsumer: <T>() => Promise<T>;
  disconnectConsumer: () => Promise<void>;
  subscribe: (
    messageHandler: MessageHandler,
    topic: TOPIC_TYPE
  ) => Promise<void>;
};
