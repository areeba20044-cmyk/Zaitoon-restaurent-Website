ZAITOON FAMILY RESTAURANT — WEBSITE
===================================

RUN ON YOUR PC
1. Unzip this folder.
2. Open a terminal in the folder and run:   python -m http.server 8000
3. Open http://localhost:8000
   (Double-clicking index.html also works.)

PAGES
- Website ............ index.html  (About, Menu & ordering, Dine-in, Reserve,
                                    Gallery, Reviews, Rewards, FAQ, Contact)
- Order tracking ..... index.html#track-<order number>
- Table ordering ..... index.html#table-3   (tables 1–16; this link goes on each
                                             table's QR code / NFC tag)
- Kitchen display .... index.html#kitchen   ┐
- Waiter app ......... index.html#waiter    ├ staff PIN: 2026 (change it in data.js → STAFF)
- Admin panel ........ index.html#admin     ┘   (open these addresses directly; there is
                                                no staff link on the public website)

WAITER ↔ KITCHEN
- Admin → Waiters & tables: assign tables to waiters, add waiters, auto-balance.
- New orders go to the table's waiter; if they're on break, the least busy
  waiter on duty gets it.
- Kitchen tickets show the assigned waiter; the kitchen can reassign, message
  the waiter, or call them to pick up. Waiters can message the kitchen
  (rush, allergy, guest asking for an update) and reply with one tap.

EVERYTHING IS CONNECTED
Orders from the website or a table appear in the kitchen instantly; status
changes reach the customer's tracking page and the waiter app; reservations
and messages land in the admin panel; settled bills update the guest's rewards.
Open the website and the kitchen in two tabs to see it live.

GO LIVE
Upload everything in this folder to Netlify Drop (app.netlify.com/drop) or
GitHub Pages. For multiple devices sharing orders in real time, the next step
is connecting a small backend (e.g. Firebase/Supabase) — the data layer is
in app.js (load/save).

KOT PRINTING & NOTIFICATIONS
- Kitchen: tap "KOT" on a ticket, then "Print" - prints an 80 mm thermal ticket (choose the thermal printer in the print dialog).
- Kitchen: "Auto-print KOT: On" prints every new ticket as it arrives (keep the kitchen screen open).
- Guests, kitchen and waiters can tap "Turn on notifications" to get real phone/computer notifications when the page is in the background.
  (Notifications while the site is fully closed need a push server - add when the online database is connected.)
