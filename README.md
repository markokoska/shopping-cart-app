# Shopping Cart Application

A full-stack shopping cart application built with Java Spring Boot backend and React frontend, using H2 file database for persistence.

## Features

### User Features
- User registration and login with JWT authentication
- Browse products with instant search (letter by letter)
- Add products to cart
- View and modify cart items
- Checkout process
- View order history

### Admin Features
- Create, edit, and delete products
- View all orders
- Update order status
- Product inventory management

## Technology Stack

### Backend
- Java 17
- Spring Boot 3.2.0
- Spring Security with JWT
- Spring Data JPA
- H2 Database (file-based)
- Maven

### Frontend
- React 18
- React Router
- Axios for API calls
- CSS3 for styling

## Setup Instructions

### Prerequisites
- Java 17 or higher
- Node.js 16 or higher
- Maven 3.6 or higher

### Backend Setup
1. Navigate to the project root directory
2. Run `mvn clean install` to install dependencies
3. Run `mvn spring-boot:run` to start the backend server
4. The backend will start on `http://localhost:8080`

### Frontend Setup
1. Navigate to the `frontend` directory
2. Run `npm install` to install dependencies
3. Run `npm start` to start the React development server
4. The frontend will start on `http://localhost:3000`

### Quick Start
You can use the provided batch files:
- `start-backend.bat` - Starts the Spring Boot backend
- `start-frontend.bat` - Starts the React frontend

## Database

The application uses H2 file database which persists data in the `./data/shoppingcart.mv.db` file. The database will be created automatically when you first run the application.

### H2 Console Access
- URL: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:file:./data/shoppingcart`
- Username: `sa`
- Password: `password`

## Default Admin User

To create an admin user, you can:
1. Register a normal user through the UI
2. Access the H2 console
3. Update the user's role: `UPDATE users SET role = 'ADMIN' WHERE username = 'your-username'`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login

### Products
- `GET /api/products` - Get all products
- `GET /api/products/search?name={name}` - Search products
- `GET /api/products/{id}` - Get product by ID

### Cart
- `GET /api/cart` - Get user's cart items
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/{id}` - Update cart item quantity
- `DELETE /api/cart/{id}` - Remove item from cart

### Orders
- `GET /api/orders` - Get user's orders
- `POST /api/orders/checkout` - Place order

### Admin
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/{id}` - Update product
- `DELETE /api/admin/products/{id}` - Delete product
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/{id}/status` - Update order status

## Usage

1. Start both backend and frontend servers
2. Navigate to `http://localhost:3000`
3. Register a new account or login
4. Browse products and add them to cart
5. Checkout to place orders
6. View your order history
7. To access admin features, update your user role in the database

## Development

### Adding New Features
1. Backend: Add new entities, repositories, services, and controllers as needed
2. Frontend: Create new React components and update routing
3. Update the API endpoints in this README

### Database Schema
The application automatically creates the following tables:
- `users` - User accounts and roles
- `products` - Product catalog
- `cart_items` - Shopping cart items
- `orders` - Order information
- `order_items` - Items within orders

## Troubleshooting

### Common Issues
1. **Port conflicts**: Make sure ports 8080 and 3000 are available
2. **Database issues**: Check the H2 console for data verification
3. **CORS errors**: Ensure the backend CORS configuration allows frontend requests
4. **Authentication errors**: Verify JWT token configuration

### Logs
- Backend logs: Check console output when running Spring Boot
- Frontend logs: Check browser developer console
- Database logs: Enable SQL logging in `application.properties`

## Docker Setup

### Prerequisites
- Docker Desktop installed and running
- Docker Compose (included with Docker Desktop)

### Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/shopping-cart-app.git
   cd shopping-cart-app
   ```

2. **Build and run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
    - Frontend: http://localhost:3000
    - Backend API: http://localhost:8080
    - H2 Console: http://localhost:8080/h2-console

### Docker Commands

**Build and start all services:**
```bash
docker-compose up --build
```

**Start in background (detached mode):**
```bash
docker-compose up -d --build
```

**Stop all services:**
```bash
docker-compose down
```

**View logs:**
```bash
docker-compose logs -f
```

**Rebuild specific service:**
```bash
docker-compose up --build backend
docker-compose up --build frontend
```

**Clean up (remove containers, networks, volumes):**
```bash
docker-compose down -v --rmi all
```

### Individual Container Commands

**Build backend only:**
```bash
docker build -t shopping-cart-backend .
```

**Build frontend only:**
```bash
docker build -t shopping-cart-frontend ./frontend
```

**Run backend container:**
```bash
docker run -p 8080:8080 -v $(pwd)/data:/app/data shopping-cart-backend
```

**Run frontend container:**
```bash
docker run -p 3000:80 shopping-cart-frontend
```
```

### Step 9: Build and Test Your Dockerized Application

**9.1 Build the application:**
```bash
cd "C:\Users\Markt\ShoppingCart3"
docker-compose up --build
```

**9.2 Test the application:**
- Open http://localhost:3000 in your browser
- Test the API at http://localhost:8080/api/products
- Check H2 console at http://localhost:8080/h2-console

**9.3 Stop the application:**
```bash
docker-compose down
```

### Step 10: Push to GitHub

**10.1 Add Docker files to git:**
```bash
git add .
git commit -m "Add Docker support with docker-compose"
git push origin main
```

## Benefits of Dockerizing Your Application

1. **Consistent Environment**: Runs the same way on any machine
2. **Easy Deployment**: One command to start the entire application
3. **Isolation**: Each service runs in its own container
4. **Scalability**: Easy to scale individual services
5. **Development**: New developers can start with just `docker-compose up`
6. **Production Ready**: Can be deployed to any Docker-compatible platform

## Next Steps

1. **Test the Docker setup** thoroughly
2. **Add health checks** to your Docker containers
3. **Consider using Docker secrets** for sensitive data
4. **Set up CI/CD** with GitHub Actions to build Docker images
5. **Deploy to cloud platforms** like AWS, Azure, or Google Cloud

Your ShoppingCart3 application is now fully dockerized and ready for deployment anywhere!