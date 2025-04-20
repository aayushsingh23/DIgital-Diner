# Digital Diner
A full stack system built using React, Node.js, Express and PostgreSQL

## Demo
* [Digital Diner on Netlify](https://digi-diner.netlify.app/)

## Features

* User authentication
* Oder history
* Admin Dashboard
* Order placement
* Veg/Non-veg Filter

## Technologies Used

Frontend: React.js, Material-UI, Axios, Redux

Backend: Node.js, Express.js, PostgreSQL, MongoDB

## Database Design Choices
#### MongoDB for Menu Items

1. Flexibility: Menu items have varying attributes and structures
2. Schema Evolution: Easy to add new fields without migrations
3. Performance: Better for read-heavy operations
4. Document Structure: Natural fit for menu items with nested data
5. Scalability: Horizontal scaling for growing menu items
Development Speed: Faster iteration during development

#### PostgreSQL for Orders
1. Data Integrity: Strong consistency and ACID compliance
2. Relationships: Better for handling order relationships
3. Transactions: Support for complex order operations
4. Query Performance: Efficient for order history and filtering
5. Data Validation: Built-in constraints and validations
Reporting: Better support for complex queries and analytics

## Setup Instructions

Required
* Node.js (v16 or higher)
* PostgreSQL
* MongoDB
* git
* npm or yarn

Note: you can also check their availability by using the following commands:
```
node -v
npm -v
git -v
psql --version
mongosh --version
```

### Backend Setup:
1. Clone repo:
```
git clone https://github.com/aayushsingh23/DIgital-Diner.git
```
2. Navigate to repo locally"
```
cd DIgital-Diner/Backend
```
3. Install dependencies:
```
npm install
 ```

4. Create a .env file in the same (backend) directory with the following content:
```
PORT=5000
MONGODB_URI=your_mongodb_uri
POSTGRES_URI=your_postgres_uri
JWT_SECRET=your_jwt_secret
```
5. Setup MongoDB
```
mongosh
use digital_diner
```

6. Setup PostgreSQL
```
psql
CREATE DATABASE digital_diner;
```

7. Start backend server:
```
npm run dev
```

This will run your backend Express server on `PORT 5000`

### Frontend Setup:

1. Navigate to Frontend directory:
```
cd ../frontend
```

2. Install dependencies
```
npm install
```

3. Create a .env file:

```
VITE_API_URL=http://localhost:5000
```
4. Start Deployement server
```
npm run dev
```

## API Endpoints:

#### Authentication
```
/api/auth/login - User login
/api/auth/logout - User logout
/api/users/signup - User registration
```
#### Admin
```
/api/admin/dashboard - Get admin dashboard data
/api/admin/orders - Get all orders with details
/api/admin/menu-items - Get all menu items with details
/api/admin/stats - Get restaurant statistics
```
#### Menu
```
/api/menu - Get all menu items
/api/menu/categories - Get all menu categories
/api/menu/:id - Get menu item by ID
/api/menu - Create menu item (admin only)
/api/menu/:id - Delete menu item (admin only)
/api/menu/:id - Update menu item (admin only)


```
#### Orders
```
/api/orders - Get all orders (admin only)
/api/orders/:id/status - Update order status (admin only)
/api/orders/:id - Get order details
/api/orders/phone/:phoneNumber - Get orders by phone number
/api/orders - Create new order
/api/orders/:id/cancel - Cancel order

```
## Asumptions
1. Users will give a valid mobile number.
2. All items added to the menu will have all the required attributes
3. No two users will have the same mobile number.
4. No menu item will run out of stock until marked unavailable by admin.
5. Admin will act wisely.

## Challenges

1. CORS Configuration: Setup for CORS
2. Managing and Setup of PostgreSQL
3. Deployment
4. Moving orders from MongoDB to PostgreSQL

## AI Tools usage

* Code debugging
* UI idea implementation
* Code review
* Code optimization
* Document Generation

The whole code has been thoroughly reviewed and deployed only after that.

## Contact
Phone number: `9958467077`