# E-Commerce Backend (Microservices Structure)

## Project Structure

```text
api-gateway/
  src/
    routes/
    middleware/
    index.js
  package.json
  .env

services/
  auth-service/
    src/
      controllers/
      routes/
      models/
      services/
      config/db.js
      index.js
    package.json
    .env

  product-service/
  order-service/
  cart-service/
```

## Notes

- Database connection logic has been moved out of service `src/index.js` files.
- Each service now has `src/config/db.js` for MongoDB connection.
- Health route is available at `/health` for gateway and each service.
