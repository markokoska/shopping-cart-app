CREATE DATABASE shoppingcart;

-- Create user if not exists
DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles
      WHERE  rolname = 'shoppingcart_user') THEN

CREATE ROLE shoppingcart_user LOGIN PASSWORD 'shoppingcart_password';
END IF;
END
$do$;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE shoppingcart TO shoppingcart_user;