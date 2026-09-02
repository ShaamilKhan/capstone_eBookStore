-- Update book cover images using Open Library Covers API
-- Format: https://covers.openlibrary.org/b/isbn/<ISBN>-L.jpg

UPDATE products SET image_url = 'https://covers.openlibrary.org/b/isbn/9780743273565-L.jpg' WHERE title = 'The Great Gatsby';
UPDATE products SET image_url = 'https://covers.openlibrary.org/b/isbn/9780061120084-L.jpg' WHERE title = 'To Kill a Mockingbird';
UPDATE products SET image_url = 'https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg' WHERE title = '1984';
UPDATE products SET image_url = 'https://covers.openlibrary.org/b/isbn/9780060929879-L.jpg' WHERE title = 'Brave New World';
UPDATE products SET image_url = 'https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg' WHERE title = 'Sapiens';
UPDATE products SET image_url = 'https://covers.openlibrary.org/b/isbn/9780399590504-L.jpg' WHERE title = 'Educated';
UPDATE products SET image_url = 'https://covers.openlibrary.org/b/isbn/9780553380163-L.jpg' WHERE title = 'A Brief History of Time';
UPDATE products SET image_url = 'https://covers.openlibrary.org/b/isbn/9780192860927-L.jpg' WHERE title = 'The Selfish Gene';
UPDATE products SET image_url = 'https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg' WHERE title = 'Clean Code';
UPDATE products SET image_url = 'https://covers.openlibrary.org/b/isbn/9780135957059-L.jpg' WHERE title = 'The Pragmatic Programmer';
UPDATE products SET image_url = 'https://covers.openlibrary.org/b/isbn/9781449373320-L.jpg' WHERE title = 'Designing Data-Intensive Applications';
UPDATE products SET image_url = 'https://covers.openlibrary.org/b/isbn/9781491924464-L.jpg' WHERE title = 'You Don''t Know JS';
