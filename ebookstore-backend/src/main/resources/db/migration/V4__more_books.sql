-- V4: Add 30 more books across all 4 categories
-- Categories: 1=Fiction, 2=Non-Fiction, 3=Science, 4=Technology
-- Brands: 1=Penguin Random House, 2=HarperCollins, 3=O'Reilly Media

INSERT INTO products (title, author, description, price, stock_quantity, category_id, brand_id, isbn, pages, rating, estimated_delivery_days, image_url) VALUES

-- ── FICTION (10 more) ────────────────────────────────────────────────────────
('The Catcher in the Rye',
 'J.D. Salinger',
 'The rebellious adventures of Holden Caulfield, a teenager navigating alienation and identity in 1950s New York.',
 13.99, 55, 1, 1, '9780316769174', 277, 4.3, 4,
 'https://covers.openlibrary.org/b/isbn/9780316769174-L.jpg'),

('Animal Farm',
 'George Orwell',
 'A satirical allegory of Soviet totalitarianism told through a farm animal rebellion.',
 10.99, 65, 1, 2, '9780451526342', 112, 4.6, 3,
 'https://covers.openlibrary.org/b/isbn/9780451526342-L.jpg'),

('The Alchemist',
 'Paulo Coelho',
 'A philosophical novel about a young Andalusian shepherd''s journey to find treasure and discover his destiny.',
 14.99, 80, 1, 1, '9780062315007', 208, 4.7, 3,
 'https://covers.openlibrary.org/b/isbn/9780062315007-L.jpg'),

('The Hitchhiker''s Guide to the Galaxy',
 'Douglas Adams',
 'A comedic science fiction adventure about the last human alive and his travels through the universe.',
 13.49, 70, 1, 2, '9780345391803', 224, 4.8, 4,
 'https://covers.openlibrary.org/b/isbn/9780345391803-L.jpg'),

('Of Mice and Men',
 'John Steinbeck',
 'A tragic story of friendship between two displaced migrant ranch workers during the Great Depression.',
 11.99, 48, 1, 1, '9780140177398', 112, 4.4, 5,
 'https://covers.openlibrary.org/b/isbn/9780140177398-L.jpg'),

('The Road',
 'Cormac McCarthy',
 'A post-apocalyptic tale of a father and son walking through a devastated America.',
 15.49, 42, 1, 1, '9780307387899', 287, 4.5, 4,
 'https://covers.openlibrary.org/b/isbn/9780307387899-L.jpg'),

('Crime and Punishment',
 'Fyodor Dostoevsky',
 'A psychological novel about a student who commits murder and the moral and emotional aftermath.',
 12.99, 38, 1, 2, '9780486415871', 544, 4.6, 5,
 'https://covers.openlibrary.org/b/isbn/9780486415871-L.jpg'),

('The Handmaid''s Tale',
 'Margaret Atwood',
 'A chilling dystopian novel set in a totalitarian theocracy where women are oppressed.',
 14.99, 60, 1, 1, '9780385490818', 311, 4.7, 3,
 'https://covers.openlibrary.org/b/isbn/9780385490818-L.jpg'),

('Dune',
 'Frank Herbert',
 'An epic science fiction saga set on the desert planet Arrakis, exploring politics, religion, and ecology.',
 18.99, 75, 1, 2, '9780441013593', 896, 4.9, 4,
 'https://covers.openlibrary.org/b/isbn/9780441013593-L.jpg'),

('The Picture of Dorian Gray',
 'Oscar Wilde',
 'A Gothic novel about a man who remains young while his portrait ages and reflects his moral corruption.',
 11.49, 50, 1, 1, '9780141439570', 254, 4.5, 3,
 'https://covers.openlibrary.org/b/isbn/9780141439570-L.jpg'),

-- ── NON-FICTION (8 more) ─────────────────────────────────────────────────────
('Atomic Habits',
 'James Clear',
 'A proven framework for building good habits and breaking bad ones through tiny, incremental changes.',
 17.99, 120, 2, 2, '9780735211292', 320, 4.9, 3,
 'https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg'),

('The Subtle Art of Not Giving a F*ck',
 'Mark Manson',
 'A counterintuitive approach to living a good life by focusing only on what truly matters.',
 16.99, 90, 2, 1, '9780062457714', 224, 4.4, 4,
 'https://covers.openlibrary.org/b/isbn/9780062457714-L.jpg'),

('Thinking, Fast and Slow',
 'Daniel Kahneman',
 'An exploration of the two systems that drive human thought: fast intuition and slow rational thinking.',
 19.99, 65, 2, 1, '9780374533557', 499, 4.6, 5,
 'https://covers.openlibrary.org/b/isbn/9780374533557-L.jpg'),

('Man''s Search for Meaning',
 'Viktor E. Frankl',
 'A psychiatrist''s account of survival in Nazi concentration camps and the discovery of logotherapy.',
 13.99, 55, 2, 2, '9780807014271', 200, 4.8, 3,
 'https://covers.openlibrary.org/b/isbn/9780807014271-L.jpg'),

('The Power of Now',
 'Eckhart Tolle',
 'A guide to spiritual enlightenment through living fully in the present moment.',
 15.99, 70, 2, 1, '9781577314806', 236, 4.5, 4,
 'https://covers.openlibrary.org/b/isbn/9781577314806-L.jpg'),

('Becoming',
 'Michelle Obama',
 'An intimate memoir by the former First Lady about her journey from Chicago''s South Side to the White House.',
 18.99, 85, 2, 2, '9781524763138', 448, 4.9, 3,
 'https://covers.openlibrary.org/b/isbn/9781524763138-L.jpg'),

('Outliers',
 'Malcolm Gladwell',
 'A study of what makes high achievers different and the hidden factors behind extraordinary success.',
 16.49, 60, 2, 1, '9780316017923', 336, 4.5, 4,
 'https://covers.openlibrary.org/b/isbn/9780316017923-L.jpg'),

('The 7 Habits of Highly Effective People',
 'Stephen R. Covey',
 'A principle-centred approach to personal and professional effectiveness.',
 17.49, 75, 2, 2, '9780743269513', 381, 4.6, 5,
 'https://covers.openlibrary.org/b/isbn/9780743269513-L.jpg'),

-- ── SCIENCE (6 more) ─────────────────────────────────────────────────────────
('The Origin of Species',
 'Charles Darwin',
 'Darwin''s groundbreaking work introducing the theory of evolution by natural selection.',
 13.99, 40, 3, 1, '9780140432053', 560, 4.7, 5,
 'https://covers.openlibrary.org/b/isbn/9780140432053-L.jpg'),

('Cosmos',
 'Carl Sagan',
 'A journey through space and time exploring the universe and humanity''s place within it.',
 16.99, 55, 3, 1, '9780345539434', 365, 4.8, 4,
 'https://covers.openlibrary.org/b/isbn/9780345539434-L.jpg'),

('The Gene: An Intimate History',
 'Siddhartha Mukherjee',
 'A sweeping history of genetics and the profound implications of genetic science on humanity.',
 19.99, 45, 3, 2, '9781476733524', 592, 4.7, 4,
 'https://covers.openlibrary.org/b/isbn/9781476733524-L.jpg'),

('Astrophysics for People in a Hurry',
 'Neil deGrasse Tyson',
 'A concise guide to the most important ideas in astrophysics for those short on time.',
 14.49, 80, 3, 1, '9780393609394', 224, 4.5, 3,
 'https://covers.openlibrary.org/b/isbn/9780393609394-L.jpg'),

('The Double Helix',
 'James D. Watson',
 'A personal account of the discovery of the structure of DNA by one of its co-discoverers.',
 13.49, 38, 3, 2, '9780743216302', 256, 4.4, 5,
 'https://covers.openlibrary.org/b/isbn/9780743216302-L.jpg'),

('Gödel, Escher, Bach',
 'Douglas R. Hofstadter',
 'An exploration of the deep connections between mathematics, music, art, and consciousness.',
 22.99, 30, 3, 1, '9780465026562', 824, 4.8, 5,
 'https://covers.openlibrary.org/b/isbn/9780465026562-L.jpg'),

-- ── TECHNOLOGY (6 more) ──────────────────────────────────────────────────────
('The Mythical Man-Month',
 'Frederick P. Brooks Jr.',
 'Essays on software engineering covering project management and the complexity of building large systems.',
 36.99, 50, 4, 3, '9780201835953', 336, 4.5, 4,
 'https://covers.openlibrary.org/b/isbn/9780201835953-L.jpg'),

('Introduction to Algorithms',
 'Thomas H. Cormen et al.',
 'The definitive textbook on algorithms, covering a broad range of algorithms in depth.',
 64.99, 40, 4, 2, '9780262033848', 1292, 4.7, 5,
 'https://covers.openlibrary.org/b/isbn/9780262033848-L.jpg'),

('Structure and Interpretation of Computer Programs',
 'Harold Abelson & Gerald Jay Sussman',
 'A classic MIT textbook on computer science fundamentals using the Scheme programming language.',
 54.99, 35, 4, 2, '9780262510875', 657, 4.8, 5,
 'https://covers.openlibrary.org/b/isbn/9780262510875-L.jpg'),

('Refactoring',
 'Martin Fowler',
 'A guide to improving the design of existing code through disciplined refactoring techniques.',
 42.99, 60, 4, 3, '9780134757599', 448, 4.6, 4,
 'https://covers.openlibrary.org/b/isbn/9780134757599-L.jpg'),

('Artificial Intelligence: A Modern Approach',
 'Stuart Russell & Peter Norvig',
 'The most widely used textbook on AI, covering search, knowledge, planning, learning, and more.',
 74.99, 30, 4, 2, '9780136042594', 1152, 4.8, 5,
 'https://covers.openlibrary.org/b/isbn/9780136042594-L.jpg'),

('The Phoenix Project',
 'Gene Kim, Kevin Behr & George Spafford',
 'A novel about IT, DevOps, and helping your business win — essential reading for modern engineers.',
 29.99, 70, 4, 3, '9781942788294', 432, 4.7, 3,
 'https://covers.openlibrary.org/b/isbn/9781942788294-L.jpg');
