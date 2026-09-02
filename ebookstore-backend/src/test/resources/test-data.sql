-- Seed data for H2 integration tests
-- Delete any existing rows to avoid UNIQUE conflicts on re-runs
DELETE FROM products;
DELETE FROM brands;
DELETE FROM categories;

INSERT INTO categories (name, description, image_url)
VALUES ('Technology', 'Tech books', 'https://example.com/cat.jpg');

INSERT INTO brands (name, logo_url)
VALUES ('OReilly', 'https://example.com/logo.jpg');

INSERT INTO products (title, author, description, price, stock_quantity, category_id, brand_id,
                      image_url, isbn, pages, language, rating, estimated_delivery_days)
SELECT 'Clean Code', 'Robert C. Martin',
       'A handbook of agile software craftsmanship', 39.99, 100,
       c.id, b.id,
       'https://example.com/cover.jpg', '9780132350884', 431, 'English', 4.50, 5
FROM categories c, brands b
WHERE c.name = 'Technology' AND b.name = 'OReilly';
