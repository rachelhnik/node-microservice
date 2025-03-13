import { Consumer, Kafka, logLevel, Partitioners, Producer } from "kafkajs";
import { MessageBrokerType, MessageHandler, PublishType } from "./broker.type";
import { MessageType, PaymentEvent, TOPIC_TYPE } from "../../types";

const CLIENT_ID = process.env.CLIENT_ID || "order-service";
const GROUP_ID = process.env.GROUP_ID || "order-service-group";
const BROKERS = [process.env.BROKER_1 || "localhost:9090"];

const kafka = new Kafka({
  clientId: CLIENT_ID,
  brokers: BROKERS,
  logLevel: logLevel.INFO,
});

let producer: Producer;
let consumer: Consumer;

const createTopic = async (topicarr: string[]) => {
  const topics = topicarr.map((topic) => ({
    topic: topic,
    numPartitions: 2,
    replicationFactor: 1,
  }));

  const admin = kafka.admin();
  admin.connect();
  const topicExists = await admin.listTopics();
  for (const t of topics) {
    if (!topicExists.includes(t.topic)) {
      await admin.createTopics({
        topics: [t],
      });
    }
  }
  admin.disconnect();
};

const connectProducer = async <T>(): Promise<T> => {
  await createTopic(["OrderEvents"]);

  if (producer) {
    console.log("producer connected with a existing connection");
    return producer as unknown as T;
  }

  producer = kafka.producer({
    createPartitioner: Partitioners.DefaultPartitioner,
  });
  await producer.connect();
  console.log("producer connected with a new connection");
  return producer as unknown as T;
};

const disconnectProducer = async () => {
  if (producer) {
    await producer.disconnect();
  }
};

const publish = async (data: PublishType): Promise<boolean> => {
  const producer = await connectProducer<Producer>();

  const result = await producer.send({
    topic: data.topic,
    messages: [
      {
        headers: data.headers,
        key: data.event,
        value: JSON.stringify(data.message),
      },
    ],
  });
  console.log("published data", result);
  return result.length > 0;
};

const connectConsumer = async <T>(): Promise<T> => {
  if (consumer) {
    return consumer as unknown as T;
  }
  consumer = kafka.consumer({
    groupId: GROUP_ID,
  });
  await consumer.connect();
  return consumer as unknown as T;
};

const disconnectConsumer = async () => {
  if (consumer) {
    await consumer.disconnect();
  }
};

const subscribe = async (
  messageHandler: MessageHandler,
  topic: TOPIC_TYPE
): Promise<void> => {
  const consumer = await connectConsumer<Consumer>();
  await consumer.subscribe({ topic: topic, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      if (topic !== "OrderEvents") return;

      if (message.key && message.value) {
        const messageInput: MessageType = {
          headers: message.headers,
          event: message.key.toString() as PaymentEvent,
          data: message.value ? JSON.parse(message.value.toString()) : null,
        };
        await messageHandler(messageInput);
        await consumer.commitOffsets([
          { topic, partition, offset: Number(message.offset + 1).toString() },
        ]);
      }
    },
  });
};

export const MessageBroker: MessageBrokerType = {
  connectProducer,
  disconnectProducer,
  publish,
  connectConsumer,
  disconnectConsumer,
  subscribe,
};
