
# Microservices architecture with Node.js





## Tech Stack

This project follows a microservices architecture using Node.js, designed with clean code principles and event-driven communication through Kafka. The services are containerized and managed using Docker Compose for local development.

- Node.js – The primary runtime for microservices, ensuring a scalable and efficient backend.

- PostgreSQL – The relational database used for persistent data storage.
- Kafka – Used as an event broker to enable asynchronous communication between microservices.

- Docker Compose – Manages local development by orchestrating multiple services, including the application, PostgreSQL database, and Kafka broker.



## Prerequisites

Ensure you have the following installed on your machine:  

- [Docker](https://www.docker.com/get-started)  
- [Docker Compose](https://docs.docker.com/compose/install/)  
## Running the Project 

### Step 1: Clone the Repository  

```sh
git clone https://github.com/rachelhnik/node-microservice.git
cd microservices-project
```

### Step 2: Build and Start the Services
Run the following command to build and start all services:

```sh
docker-compose up --build
```

This will:

- Start PostgreSQL databases for each service
- Start Zookeeper and Kafka for event-driven messaging
- Build and run the microservices


### Step 3: Verify Running Containers
To check if all services are running, use:

You should see containers for:

```sh
docker ps
```

You should see containers for:
- PostgreSQL databases (catalog_db, order_db, user_db)
- Kafka and Zookeeper (kafka, zookeeper)
- Microservices (user_service, catalog_service, order_service, payment_service)

### Step 4: Access the Services

| Service   | Port    | URL      |
|-----------|---------|----------|
| User Service   | 9050 | http://localhost:9050 |
| Catalog Service   | 9051 | http://localhost:9051 |
| Order Service   | 9052 | http://localhost:9052  |
| Payment Service | 9053 |http://localhost:9053  |
| Kafka   | 9090 | localhost:9090  |


### Step 5: Stopping the Services
To stop the services, press Ctrl + C or run:

```sh
docker-compose down

```

To remove all volumes (including database data), use:
```sh
docker-compose down -v

```





## Conclusion

This project is built on a microservices architecture, ensuring that each service operates independently. Kafka facilitates event-driven communication, enabling loose coupling and scalability. For local development, Docker Compose streamlines the process by orchestrating all services, including the application, PostgreSQL database, and Kafka broker. This setup provides a robust and efficient environment for building, testing, and scaling microservices with ease.
## Contact

For any inquiries or issues, feel free to contact rachel.shwehnit@gmail.com. 🚀
## Documentation

[Documentation](https://documenter.getpostman.com/view/36601366/2sAYkErKqr#auth-info-66acfd1d-36a1-435a-9981-c208d88f50e7)

