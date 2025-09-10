-- Update existing products to be active by default
UPDATE products SET active = true WHERE active IS NULL;
