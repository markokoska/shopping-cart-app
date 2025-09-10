INSERT INTO products (id, name, description, price, stock_quantity, image_url) VALUES
                                                                                   (1, 'Laptop', 'High-performance laptop for work and gaming', 999.99, 10, 'https://via.placeholder.com/300x200'),
                                                                                   (2, 'Smartphone', 'Latest smartphone with advanced features', 699.99, 15, 'https://via.placeholder.com/300x200'),
                                                                                   (3, 'Headphones', 'Wireless noise-canceling headphones', 199.99, 20, 'https://via.placeholder.com/300x200'),
                                                                                   (4, 'Tablet', '10-inch tablet for productivity', 399.99, 8, 'https://via.placeholder.com/300x200'),
                                                                                   (5, 'Smart Watch', 'Fitness tracking smartwatch', 299.99, 12, 'https://via.placeholder.com/300x200');

-- Update sequence
SELECT setval('products_id_seq', 5);