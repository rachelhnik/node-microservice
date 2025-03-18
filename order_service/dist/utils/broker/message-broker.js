"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageBroker = void 0;
const kafkajs_1 = require("kafkajs");
const CLIENT_ID = process.env.CLIENT_ID || "order-service";
const GROUP_ID = process.env.GROUP_ID || "order-service-group";
const BROKERS = [process.env.BROKER_1 || "localhost:9090"];
const kafka = new kafkajs_1.Kafka({
    clientId: CLIENT_ID,
    brokers: BROKERS,
    logLevel: kafkajs_1.logLevel.INFO,
});
let producer;
let consumer;
const createTopic = (topicarr) => __awaiter(void 0, void 0, void 0, function* () {
    const topics = topicarr.map((topic) => ({
        topic: topic,
        numPartitions: 2,
        replicationFactor: 1,
    }));
    const admin = kafka.admin();
    admin.connect();
    const topicExists = yield admin.listTopics();
    for (const t of topics) {
        if (!topicExists.includes(t.topic)) {
            yield admin.createTopics({
                topics: [t],
            });
        }
    }
    admin.disconnect();
});
const connectProducer = () => __awaiter(void 0, void 0, void 0, function* () {
    yield createTopic(["OrderEvents"]);
    if (producer) {
        console.log("producer connected with a existing connection");
        return producer;
    }
    producer = kafka.producer({
        createPartitioner: kafkajs_1.Partitioners.DefaultPartitioner,
    });
    yield producer.connect();
    console.log("producer connected with a new connection");
    return producer;
});
const disconnectProducer = () => __awaiter(void 0, void 0, void 0, function* () {
    if (producer) {
        yield producer.disconnect();
    }
});
const publish = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const producer = yield connectProducer();
    const result = yield producer.send({
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
});
const connectConsumer = () => __awaiter(void 0, void 0, void 0, function* () {
    if (consumer) {
        return consumer;
    }
    consumer = kafka.consumer({
        groupId: GROUP_ID,
    });
    yield consumer.connect();
    return consumer;
});
const disconnectConsumer = () => __awaiter(void 0, void 0, void 0, function* () {
    if (consumer) {
        yield consumer.disconnect();
    }
});
const subscribe = (messageHandler, topic) => __awaiter(void 0, void 0, void 0, function* () {
    const consumer = yield connectConsumer();
    yield consumer.subscribe({ topic: topic, fromBeginning: true });
    yield consumer.run({
        eachMessage: (_a) => __awaiter(void 0, [_a], void 0, function* ({ topic, partition, message }) {
            if (topic !== "OrderEvents")
                return;
            if (message.key && message.value) {
                const messageInput = {
                    headers: message.headers,
                    event: message.key.toString(),
                    data: message.value ? JSON.parse(message.value.toString()) : null,
                };
                yield messageHandler(messageInput);
                yield consumer.commitOffsets([
                    { topic, partition, offset: Number(message.offset + 1).toString() },
                ]);
            }
        }),
    });
});
exports.MessageBroker = {
    connectProducer,
    disconnectProducer,
    publish,
    connectConsumer,
    disconnectConsumer,
    subscribe,
};
