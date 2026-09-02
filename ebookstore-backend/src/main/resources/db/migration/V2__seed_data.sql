INSERT INTO categories (name, description, image_url) VALUES
('Fiction', 'Novels, short stories, and imaginative literature', 'https://images.pexels.com/photos/1130980/pexels-photo-1130980.jpeg?auto=compress&cs=tinysrgb&w=400'),
('Non-Fiction', 'Biographies, history, and true stories', 'https://images.pexels.com/photos/256431/pexels-photo-256431.jpeg?auto=compress&cs=tinysrgb&w=400'),
('Science', 'Physics, biology, chemistry, and scientific exploration', 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=400'),
('Technology', 'Programming, AI, software engineering, and tech', 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=400');

INSERT INTO brands (name, logo_url) VALUES
('Penguin Random House', 'https://via.placeholder.com/100x50?text=PRH'),
('HarperCollins', 'https://via.placeholder.com/100x50?text=HC'),
('O''Reilly Media', 'https://via.placeholder.com/100x50?text=OReilly');

INSERT INTO products (title, author, description, price, stock_quantity, category_id, brand_id, isbn, pages, rating, estimated_delivery_days) VALUES
('The Great Gatsby', 'F. Scott Fitzgerald', 'A story of wealth, love, and the American Dream in the 1920s.', 12.99, 50, 1, 1, '978-0-7432-7356-5', 180, 4.5, 3),
('To Kill a Mockingbird', 'Harper Lee', 'A powerful story of racial injustice and moral growth in the American South.', 14.99, 45, 1, 1, '978-0-06-112008-4', 281, 4.8, 4),
('1984', 'George Orwell', 'A dystopian novel about totalitarianism, surveillance, and freedom.', 11.99, 60, 1, 2, '978-0-452-28423-4', 328, 4.7, 3),
('Brave New World', 'Aldous Huxley', 'A futuristic society where people are controlled through pleasure and conditioning.', 13.49, 40, 1, 2, '978-0-06-092987-0', 311, 4.3, 5),
('Sapiens', 'Yuval Noah Harari', 'A brief history of humankind from the Stone Age to the modern era.', 18.99, 70, 2, 1, '978-0-06-231609-7', 443, 4.6, 4),
('Educated', 'Tara Westover', 'A memoir about growing up in a survivalist family and pursuing education.', 16.99, 35, 2, 2, '978-0-399-59050-4', 352, 4.7, 3),
('A Brief History of Time', 'Stephen Hawking', 'An exploration of cosmology and the universe for general readers.', 15.99, 55, 3, 1, '978-0-553-38016-3', 212, 4.8, 5),
('The Selfish Gene', 'Richard Dawkins', 'A landmark work on evolutionary biology and gene-centred view of evolution.', 14.49, 42, 3, 2, '978-0-19-929114-4', 360, 4.5, 4),
('Clean Code', 'Robert C. Martin', 'A handbook of agile software craftsmanship and best coding practices.', 39.99, 80, 4, 3, '978-0-13-235088-4', 464, 4.7, 3),
('The Pragmatic Programmer', 'David Thomas & Andrew Hunt', 'Your journey to mastery in software development.', 44.99, 65, 4, 3, '978-0-13-595705-9', 352, 4.8, 4),
('Designing Data-Intensive Applications', 'Martin Kleppmann', 'The big ideas behind reliable, scalable, and maintainable systems.', 49.99, 55, 4, 3, '978-1-4493-7332-0', 616, 4.9, 5),
('You Don''t Know JS', 'Kyle Simpson', 'A deep dive into the core mechanisms of the JavaScript language.', 34.99, 90, 4, 3, '978-1-4919-0415-2', 278, 4.6, 3);
