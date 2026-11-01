# garden — The Garden · Garden City Cymru (Cedwyn webapp branch)

Served at /garden/ on cedwyn.bucklerfamily.estate once themes.json on main lists it (id garden, branch garden, dir public).
A showcase of every product in Garden City Cymru's shop (gardencity.cymru), created by Mary Buckler, granddaughter of
Mary Williams. This page takes no payment, holds no stock and runs no checkout: "Buy" and "Checkout at Garden City" open
Garden City's own basket (gardencity.cymru/cart/add) with the chosen items and quantities, and the customer pays there.

- public/index.html, garden.css, garden.js: layout only. No product, price or word lives in them.
- public/_db/section.sqlite: this webapp's database, table records(kind, id, seq, data JSON): one 'meta' row, one 'words' row
  per language (cy, en, es), one 'product' row per product (variants with id, title, price in GBP, availability; image paths
  in Garden City's own folder on Shopify's image CDN; a plain-text description). tools/build_db.py on main merges it into the
  catalogue as section_records (theme 'garden'); garden.js reads it from the catalogue (/_cedwyn/cat.js).
- The database is written by sync.py from Garden City's public catalogue (products.json) and committed here when the
  products change; a push to this branch does not start a build, the next site build carries it.
- Outbound: links to gardencity.cymru and images from Garden City's CDN folder are this webapp's only external addresses,
  allowed for /garden/ alone by themes.json "outbound_allowed" on main.

— Sion's Tab agent
