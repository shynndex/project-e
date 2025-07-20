# Ecommerce Microservices Application

A complete ecommerce platform built with microservices architecture, featuring both admin and client interfaces.

## Architecture Overview

This project implements a microservices architecture with the following components:

- **Frontend Service**: React.js with Tailwind CSS for both client and admin interfaces
- **Product Service**: Node.js + Express + MongoDB for product management
- **Order Service**: Node.js + Express + PostgreSQL for order processing
- **Customer Service**: Node.js + Express + MongoDB for customer management
- **Payment Service**: Node.js + Express + PostgreSQL with Stripe integration for payment processing

## Features

### Admin Dashboard
- Product management (CRUD operations)
- Order management and status updates
- Customer information management
- Revenue reports and analytics
- Inventory tracking

### Client Store
- Product browsing and searching
- User registration and authentication
- Shopping cart functionality
- Checkout with multiple payment options
- Order history and tracking

## Technology Stack

- **Frontend**: React.js, Tailwind CSS, React Router
- **Backend**: Node.js, Express.js
- **Databases**: MongoDB (for products and customers), PostgreSQL (for orders and payments)
- **Payment Processing**: Stripe API integration
- **Containerization**: Docker and Docker Compose
- **State Management**: React Context API
- **Styling**: Tailwind CSS
- **Notifications**: React-Toastify

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Docker and Docker Compose
- MongoDB
- PostgreSQL

### Installation and Setup

#### Using Docker (Recommended)

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ecommerce-microservices.git
cd ecommerce-microservices
```

2. Configure environment variables:
   - Create `.env` files in each service directory based on the provided examples

3. Start all services with Docker Compose:
```bash
docker-compose up --build
```

4. Access the application:
   - Client interface: http://localhost:3000/client
   - Admin dashboard: http://localhost:3000/admin

#### Manual Setup (Without Docker)

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ecommerce-microservices.git
cd ecommerce-microservices
```

2. Set up databases:
   - Create MongoDB databases: `ecommerce_products` and `ecommerce_customers`
   - Create PostgreSQL databases: `ecommerce_orders` and `ecommerce_payments`
   - Run the SQL scripts in the `models/database.sql` files

3. Install dependencies and start each service:

```bash
# Frontend Service
cd frontend
npm install
npm start

# Product Service
cd ../product-service
npm install
npm start

# Order Service
cd ../order-service
npm install
npm start

# Customer Service
cd ../customer-service
npm install
npm start

# Payment Service
cd ../payment-service
npm install
npm start
```

## Database Setup

### MongoDB (for Product and Customer Services)

1. Install MongoDB Compass
2. Connect to MongoDB server (mongodb://localhost:27017)
3. Create two databases:
   - `ecommerce_products`
   - `ecommerce_customers`
4. Run seed scripts to populate with sample data:
```bash
cd product-service && npm run seed
cd customer-service && npm run seed
```

### PostgreSQL (for Order and Payment Services)

1. Install pgAdmin 4
2. Connect to PostgreSQL server (localhost:5432)
3. Create two databases:
   - `ecommerce_orders`
   - `ecommerce_payments`
4. Execute the SQL scripts from:
   - `order-service/models/database.sql`
   - `payment-service/models/database.sql`

## API Endpoints

### Product Service (Port 3001)
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Order Service (Port 3002)
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create order
- `PUT /api/orders/:id` - Update order status

### Customer Service (Port 3003)
- `GET /api/customers` - Get all customers
- `GET /api/customers/:id` - Get customer by ID
- `POST /api/customers` - Create customer
- `PUT /api/customers/:id` - Update customer

### Payment Service (Port 3004)
- `GET /api/payments` - Get all payments
- `GET /api/payments/:id` - Get payment by ID
- `POST /api/payments` - Process payment
- `POST /api/payments/:id/refund` - Refund payment

## Stripe Integration

This project uses Stripe for payment processing. To set up Stripe:

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Stripe Dashboard
3. Add your Stripe secret key to the `.env` file in the payment-service directory:
```
STRIPE_SECRET_KEY=sk_test_your_key_here
```
4. For testing, use Stripe's test card numbers:
   - Success: 4242 4242 4242 4242
   - Failure: 4000 0000 0000 0002

## Docker Configuration

The project includes Docker configuration for all services:

- Each service has its own Dockerfile
- The root directory contains a docker-compose.yml file
- Docker Compose sets up all services, databases, and networking

## Project Structure

```
ecommerce-microservices/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   ├── package.json
│   └── Dockerfile
├── product-service/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── package.json
│   └── Dockerfile
├── order-service/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── package.json
│   └── Dockerfile
├── customer-service/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── package.json
│   └── Dockerfile
├── payment-service/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## Troubleshooting

### Common Issues

1. **Database Connection Errors**:
   - Ensure MongoDB and PostgreSQL are running
   - Check connection strings in `.env` files

2. **CORS Issues**:
   - All services have CORS enabled by default
   - Check browser console for CORS errors

3. **Port Conflicts**:
   - Ensure no other services are using the required ports
   - Check with `lsof -i :<port>` on Unix or `netstat -ano | findstr :<port>` on Windows

4. **Payment Processing Errors**:
   - Verify Stripe API keys
   - Use Stripe test mode and test cards

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- This project was created as a demonstration of microservices architecture
- Thanks to all the open-source libraries and frameworks used in this project