# Ember & Wick — Content & Business Information Needed

The homepages (Phase 03) were written only from the business facts in the project brief:

> Handmade candle craftsmanship · creative candle-making experiences · professional **and** beginner-friendly workshops · DIY candle-making kits · a warm, welcoming brand personality.

Nothing beyond that has been invented. In particular, the site does **not** state:
- prices
- schedules
- durations
- group sizes
- availability
- awards
- statistics
- customer reviews
- named staff
- kit contents
- a studio address

Each item below needs confirmation from the business before launch.

## 1. Must confirm (copy currently written around these)

| # | Item | Where it appears | Current wording / assumption |
|---|---|---|---|
| 1 | **Workshop formats offered** | Home 01 "Workshops", Home 02 "Choose your evening" | Three formats are presented as *categories of the craft*: **Container candles**, **Scent blending**, **Pillar & decorative candles**. Replace or rename them to match the real programme. |
| 2 | Private / group bookings | Home 01 community section, Home 02 workshops | Phrased only as an invitation: "Planning something for a group? Get in touch." No claim that private sessions exist. |
| 3 | **Kit range** | Home 01 "Kits", Home 02 "Continue at home" | Kits are described by purpose only (practise after a workshop, a first try at home, a gift). No product names, contents or prices. |
| 4 | Materials used (soy, beeswax, fragrance oils, cotton wicks…) | Home 01 "The art of candle making" | Written as craft education ("what every candle is made of"), not as a claim about the studio's suppliers. Confirm the studio's own materials to make this specific. |
| 5 | Curing / take-home | Process steps, journey stage 04 | States candles need time to set before burning (true of the craft). Doesn't promise same-day take-home. |
| 6 | Studio name, email, social profiles | `assets/js/data/site.js` | "Ember & Wick" and hello@emberandwick.studio are project placeholders. The social links point to network home pages. |

## 1b. Contact page: required before launch (Phase 04)

Every item below has one home: `assets/js/data/site.js` → `contact` / `forms`. Fill in the value and set
`confirmed: true`. The Contact page, map and visit section update automatically, with no HTML edits. Until then
the page says plainly that each item is "to be confirmed". It never shows a guessed value.

| # | Item | Status now | What's needed exactly |
|---|---|---|---|
| C1 | **Studio location for the map** | **Stand-in, set by the client brief (2026-11-10).** The map shows Old Spitalfields Market, London E1 6EW (OpenStreetMap way 16306646, 51.5196, −0.075363), a real public venue chosen so the map works end to end. It is **not** the studio's verified premises, and the page shows it without a disclaimer, as briefed. | Before launch, replace `contact.location` (lat, lng) with the studio entrance confirmed by the business. Keep it identical to C2. |
| C2 | Studio address | **Stand-in:** `Old Spitalfields Market · London E1 6EW · United Kingdom` (same place as C1). Shown in Contact details, Visit and the footer. | The real full postal address, one line per array item (`contact.address.lines`). Replace it together with C1 so the pin and the text stay identical. |
| C3 | Business email | Shown **with a visible "Email to be confirmed" tag**. `hello@emberandwick.studio` is a project placeholder. | The real inbox. Then set `contact.email.confirmed: true`. |
| C4 | Phone number | Not shown. | Number in the format it should be displayed (the `tel:` link is generated). |
| C5 | Opening / visiting hours | Not shown. | One line per day range (`contact.hours.value`). |
| C6 | Visit notes | Not shown. | Anything visitors must know (entrance, floor, appointment-only, accessibility). No landmarks, parking or transport details have been invented. |
| C7 | Social profiles | Not listed on the Contact page. The footer still links the networks' home pages. | Real profile URLs. Then set `verified: true` per profile in `social`. |
| C8 | **Form submission endpoint** | **No backend exists.** The form validates fully but sends nothing. It tells the visitor so and offers a prefilled email instead. | An HTTPS endpoint that accepts a `POST` of form data and returns 2xx, from a form-handling service or the studio's own server. Set `forms.enquiryEndpoint`. Fields sent: `name`, `email`, `phone`, `enquiryType`, and for workshop enquiries `workshop`, `participants` and `date`; plus `message`. `company` is a spam trap that should stay empty. |

The success message after a real submission says explicitly that it is **not a booking confirmation**. Keep that
wording unless bookings become instantly confirmed.

## 1c. About page (Phase 04)

The About page uses only the brand facts above. **Not stated** (add these if the business wants them):
- founder or teacher names
- founding year or history
- the studio's size
- location
- private sessions
- awards

## 1d. Workshops & Kits pages (Phase 05)

Both pages use only facts already on the site: the three workshop formats (#1), "professional and beginner-friendly" (from the brief), and kits described by purpose (#3). **Nothing below is stated anywhere.** The pages say so plainly where a visitor would expect it.

| # | Item | Where it appears | Current wording | Needed |
|---|---|---|---|---|
| W1 | Workshop duration, price, schedule, dates, availability | Workshops · Explore, Book | Not shown. The booking section explains the enquiry → reply → confirmation flow, and says an enquiry isn't a booking. | Real details per format, if the business wants them published |
| W2 | **Age guidance, group sizes, accessibility** | Workshops · Who can join | A visible notice: "will be published here once confirmed" + "ask us before you book". | The studio's policy for each |
| W3 | What's included in a workshop (materials, take-home, refreshments) | Workshops | Not stated. "You'll create" lines describe the craft outcome only. | Confirmed inclusions |
| K1 | **Individual kits in the range** (names, variants) | Kits · Explore | Presented as three *uses* (after a workshop, a first candle, making with someone), plus "The individual kits in the range will be listed here once confirmed." | The real kit list |
| K2 | **Kit contents** | Kits · What's inside | An overview of candle-making essentials (wax, wick, vessel, fragrance) with a notice: "This is an overview, not a contents list." | The exact contents per kit |
| K3 | Kit prices, stock, purchase / delivery, gift packaging | Kits | Not shown. There are no buy buttons, prices, stock indicators or checkout. Every kit CTA leads to a kit enquiry (`contact.html?enquiry=kits`). | How kits are sold (enquiry only, or a shop/checkout later) |
| K4 | Kit photography | Kits (all images) | Openly licensed stand-ins showing materials and candles. Never presented as the product. | Photos of the real kit |

## 2. Needed later (not used yet)

- Real customer testimonials, with written permission. Neither homepage has a testimonial section; a community and atmosphere section is used instead.
- Accessibility information and parking, if the business wants them published (Contact page, see C6).
- Booking method: the enquiry form now exists (Contact). Decide whether the Workshops page also needs an online booking system.
- Founder or teacher names and photos, if the business wants them (About page).
- Genuine Arabic (or other RTL-language) translations. RTL is currently tested with English copy.

## 3. Photography

The homepages use openly licensed photographs (CC0, plus five CC BY-SA / CC BY photos that each carry an on-page credit line); see `assets/images/CREDITS.md`. The kit and "Made together" photos are material and activity stand-ins, not the studio's own kit or workshop. These are stand-ins with verified licences. The art direction (§8 of the design system) is written for the studio's **own** photography, which should replace them before launch. The asset checklist in `CREDITS.md` lists each slot's subject, aspect ratio and section, so new photos drop in without layout changes.
