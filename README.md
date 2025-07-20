# Ecommerce Microservices Application

Ứng dụng Ecommerce được xây dựng với kiến trúc microservices, bao gồm frontend và 4 backend services độc lập.

## Kiến trúc

- **Frontend Service**: ReactJS + Tailwind CSS (Client & Admin interface)
- **Product Service**: Node.js + Express + MongoDB
- **Order Service**: Node.js + Express + PostgreSQL
- **Customer Service**: Node.js + Express + MongoDB
- **Payment Service**: Node.js + Express + PostgreSQL + Stripe

## Tính năng

### Admin Dashboard
- Quản lý sản phẩm (CRUD)
- Quản lý đơn hàng
- Quản lý khách hàng
- Báo cáo doanh thu

### Client Store
- Trang chủ sản phẩm
- Đăng ký/Đăng nhập
- Chi tiết sản phẩm
- Giỏ hàng
- Thanh toán (Stripe và COD)
- Lịch sử đơn hàng

## Hướng dẫn chạy dự án

### Cách 1: Chạy với Docker Compose (Khuyến nghị)

1. **Cài đặt Docker và Docker Compose**

2. **Clone và chạy dự án**
```bash
git clone <repository>
cd ecommerce-microservice
docker-compose up --build
```

3. **Truy cập ứng dụng**
- Client: http://localhost:3000/client
- Admin: http://localhost:3000/admin
- API endpoints:
  - Products: http://localhost:3001/api/products
  - Orders: http://localhost:3002/api/orders
  - Customers: http://localhost:3003/api/customers
  - Payments: http://localhost:3004/api/payments

### Cách 2: Chạy Local (Không dùng Docker)

#### Yêu cầu
- Node.js 18+
- MongoDB
- PostgreSQL
- MongoDB Compass (tùy chọn)
- pgAdmin4 (tùy chọn)

#### 1. Cài đặt cơ sở dữ liệu

**MongoDB**
- Tạo database `ecommerce_products` và `ecommerce_customers`
- Tạo collection `products` và `customers`

**PostgreSQL**
- Tạo database `ecommerce_orders` và `ecommerce_payments`
- Chạy scripts SQL trong thư mục `models/database.sql` của mỗi service

#### 2. Cài đặt và chạy các services

**Product Service**
```bash
cd product-service
npm install
npm start
# Chạy trên port 3001
```

**Order Service**
```bash
cd order-service
npm install
npm start
# Chạy trên port 3002
```

**Customer Service**
```bash
cd customer-service
npm install
npm start
# Chạy trên port 3003
```

**Payment Service**
```bash
cd payment-service
npm install
npm start
# Chạy trên port 3004
```

**Frontend Service**
```bash
cd frontend
npm install
npm start
# Chạy trên port 3000
```

## Cấu trúc Database

### MongoDB Collections

**Products (ecommerce_products)**
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  stock: Number,
  image: String,
  category: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

**Customers (ecommerce_customers)**
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  phone: String,
  address: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### PostgreSQL Tables

**Orders (ecommerce_orders)**
```sql
orders: id, customer_email, total, status, delivery_address, payment_method, created_at, updated_at
order_items: id, order_id, product_id, name, price, quantity, created_at
```

**Payments (ecommerce_payments)**
```sql
payments: id, order_id, amount, method, status, transaction_id, stripe_payment_id, gateway_response, created_at, updated_at
```

## Hướng dẫn tạo database thủ công

### MongoDB với MongoDB Compass

1. **Kết nối MongoDB**:
   - Mở MongoDB Compass
   - Kết nối đến `mongodb://localhost:27017`

2. **Tạo database và collections**:
   - Tạo database `ecommerce_products` với collection `products`
   - Tạo database `ecommerce_customers` với collection `customers`

3. **Thêm dữ liệu mẫu**:
   - Trong collection `products`, thêm:
   ```json
   {
     "name": "iPhone 14 Pro",
     "description": "Latest iPhone with Pro camera system",
     "price": 999,
     "stock": 50,
     "image": "https://images.unsplash.com/photo-1678652197829-ae56d8010d26",
     "category": "Electronics",
     "isActive": true
   }
   ```

   - Trong collection `customers`, thêm:
   ```json
   {
     "name": "John Doe",
     "email": "john.doe@example.com",
     "phone": "123-456-7890",
     "address": "123 Main St, New York, NY 10001",
     "isActive": true
   }
   ```

### PostgreSQL với pgAdmin4

1. **Kết nối PostgreSQL**:
   - Mở pgAdmin4
   - Kết nối đến server (localhost:5432, user: postgres, password: password)

2. **Tạo database**:
   - Tạo database `ecommerce_orders`
   - Tạo database `ecommerce_payments`

3. **Chạy scripts SQL**:
   - Trong database `ecommerce_orders`, chạy:
   ```sql
   CREATE TABLE IF NOT EXISTS orders (
       id SERIAL PRIMARY KEY,
       customer_email VARCHAR(255) NOT NULL,
       total DECIMAL(10, 2) NOT NULL,
       status VARCHAR(50) DEFAULT 'pending',
       delivery_address TEXT,
       payment_method VARCHAR(50),
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   CREATE TABLE IF NOT EXISTS order_items (
       id SERIAL PRIMARY KEY,
       order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
       product_id VARCHAR(255) NOT NULL,
       name VARCHAR(255) NOT NULL,
       price DECIMAL(10, 2) NOT NULL,
       quantity INTEGER NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

   - Trong database `ecommerce_payments`, chạy:
   ```sql
   CREATE TABLE IF NOT EXISTS payments (
       id SERIAL PRIMARY KEY,
       order_id VARCHAR(255) NOT NULL,
       amount DECIMAL(10, 2) NOT NULL,
       method VARCHAR(50) NOT NULL,
       status VARCHAR(50) DEFAULT 'pending',
       transaction_id VARCHAR(255) UNIQUE,
       stripe_payment_id VARCHAR(255),
       gateway_response TEXT,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

## Cấu hình Stripe

1. **Đăng ký tài khoản Stripe**:
   - Tạo tài khoản tại [stripe.com](https://stripe.com)

2. **Lấy API keys**:
   - Đăng nhập vào tài khoản Stripe
   - Vào Dashboard > Developers > API keys
   - Sử dụng "Secret key" (bắt đầu bằng `sk_test_`) cho biến `STRIPE_SECRET_KEY` trong file `.env` của payment-service
   - Sử dụng "Publishable key" (bắt đầu bằng `pk_test_`) cho biến `REACT_APP_STRIPE_PUBLISHABLE_KEY` trong file `.env` của frontend

3. **Thẻ test của Stripe**:
   - Thẻ thành công: 4242 4242 4242 4242
   - Thẻ thất bại: 4000 0000 0000 0002
   - Ngày hết hạn: Bất kỳ ngày trong tương lai (MM/YY)
   - CVC: Bất kỳ 3 số

## API Endpoints

### Product Service (Port 3001)
- `GET /api/products` - Lấy tất cả sản phẩm
- `GET /api/products/:id` - Lấy sản phẩm theo ID
- `POST /api/products` - Tạo sản phẩm mới
- `PUT /api/products/:id` - Cập nhật sản phẩm
- `DELETE /api/products/:id` - Xóa sản phẩm

### Order Service (Port 3002)
- `GET /api/orders` - Lấy tất cả đơn hàng
- `GET /api/orders/stats` - Lấy thống kê đơn hàng
- `GET /api/orders/:id` - Lấy đơn hàng theo ID
- `POST /api/orders` - Tạo đơn hàng mới
- `PUT /api/orders/:id` - Cập nhật đơn hàng

### Customer Service (Port 3003)
- `GET /api/customers` - Lấy tất cả khách hàng
- `GET /api/customers/:id` - Lấy khách hàng theo ID
- `POST /api/customers` - Tạo khách hàng mới
- `PUT /api/customers/:id` - Cập nhật khách hàng

### Payment Service (Port 3004)
- `GET /api/payments` - Lấy tất cả thanh toán
- `GET /api/payments/:id` - Lấy thanh toán theo ID
- `POST /api/payments` - Xử lý thanh toán
- `POST /api/payments/:id/refund` - Hoàn tiền

## Troubleshooting

### Lỗi thường gặp

1. **Port đã được sử dụng**
```bash
# Kiểm tra port đang sử dụng
lsof -i :3000
# Kill process
kill -9 <PID>
```

2. **Lỗi kết nối database**
- Kiểm tra MongoDB và PostgreSQL đã chạy
- Kiểm tra connection string trong environment variables

3. **CORS issues**
- Đảm bảo tất cả services đã cấu hình CORS

4. **Lỗi `_id.slice is not a function`**
- Đây là lỗi khi hiển thị ID đơn hàng từ PostgreSQL (số nguyên) như một chuỗi
- Sửa bằng cách kiểm tra kiểu dữ liệu: `typeof id === 'string' ? id.slice(-8) : id`

## Technology Stack

- **Frontend**: ReactJS, Tailwind CSS, HTML5
- **Backend**: Node.js, Express.js
- **Databases**: MongoDB, PostgreSQL
- **Payment**: Stripe API
- **Containerization**: Docker, Docker Compose
- **Architecture**: Microservices, REST API

## License

MIT License