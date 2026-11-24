# Stache Pad

Stache Pad is a mid-century three-bedroom rental house at 628 Fire Island Boulevard in Fire Island Pines. This system is built from the live site at stachepad.com: its two stylesheets, its markup, and its wordmark. The look is white and sand, black type, square corners, and one angled edge.

## Voice

The site talks like the owner showing a friend around the house. It is warm, specific and a little bit rude.

- **First person, plural for the house, singular for Joey.** "We've got an enormous kitchen (seriously)". The outdoor shower line switches to "I'm not here to tell you what to do with it."
- **Name the thing.** Casper Wave Snow mattresses, Miele dishwasher, 250Mbps FiOS mesh Wi-Fi. A brand and a number beat an adjective.
- **Parentheses carry the jokes.** "(not just a silly topper)", "(come on, protein shakes!)". The aside is where the personality goes; the main sentence stays useful.
- **Mild profanity is in bounds.** "No shitty desk vibes here!" Keep it to one per section and never aim it at the guest.
- **Exclamation marks are allowed**, about one per paragraph.
- **Headlines:** the page headline is a plain sentence with a period. Accordion titles are Title Case and can trail off into the body ("There's a very sexy outdoor shower...").
- **Buttons and nav** are short verb phrases set in capitals by the type style, not typed in capitals: "Book a week", "See Availability".

## Color

Two grounds, one ink, three accents. Every value is in the Colors tab.

- `white` is the page. `sand` is the band: the hero band, the booking band, fact chips, a selected week card.
- `ink` is pure black and does nearly everything: text, links, primary buttons, accordion rules, focus borders. Text on `ink` is white.
- `muted` is the only second text color. It passes on both grounds (7.2:1 on `white`, 5.7:1 on `sand`).
- `line` draws 1px hairlines on `white`. At 1.5:1 it is decoration. An input at rest uses it, so the focused state switches the border to `ink`; don't rely on `line` alone to show where a control is.
- `sage` is the quote rule and nothing else. At 4.4:1 on `white` it is fine for rules and large type and just short of the 4.5:1 needed for body text, so don't set paragraphs in it.
- `sun` flags things worth noticing: a note, a discount, a hot week. Text on it is `ink`.
- `sea-soft` is the quiet tag background.

There is no dark theme on the site.

## Type

Two families, both served from Google Fonts.

- **Display:** Anybody, weight 700, set wide (`font-stretch: 125%`), tracking -0.01em, line height 1.15. Headings, accordion titles, pull quotes, prices. Its squared, wide letters were chosen to sit with the wordmark. Load it with `family=Anybody:wdth,wght@125,700`.
- **Text:** Familjen Grotesk, 19px on 1.6. The site loads weights 400 to 700 and mostly uses 400.
- **Labels** are Familjen Grotesk in capitals with 0.06em tracking (buttons, nav) or 0.1em (month labels).

Don't set headings in capitals. The wordmark is the only wide all-caps line on a page.

## Shape and layout

- **Square.** `radius-none` everywhere. Buttons, inputs, chips, tags, cards and photos have hard corners.
- **No shadows.** Depth comes from the sand bands and 1px borders. A selected card gets a second 1px `ink` line inside its border.
- **The angled edge.** Sand hero bands end in a shallow V: the right side sits 50px above the lowest point, the left side 22px above it, and the low point is 45% of the way across. It is the one diagonal on the site. Use it once per page, on the top band.
- **Width:** content sits in a 1120px wrap with `space-gutter` on each side. Prose pages narrow to 780px.
- **Buttons:** `ink` fill, white text, 15px by 26px padding. The ghost button is transparent with a 2px `ink` border. On an `ink` bar the button inverts to white.
- **Photos** are edge-to-edge crops with `space-grid` between them, and `sand` behind them while they load.

## Logo

One mark: the STACHE PAD wordmark, wide squared capitals in solid black. Files and rules are in Assets, under Logos.

## Icons

The site has no icon set. It uses three text glyphs: ☰ for the mobile menu, and + and – on accordion rows. Don't add an icon library to match; if a new surface needs icons, that is a decision to make first.

## Not synced

- **Spacing names are mine.** The site's CSS has no spacing variables. The six spacing tokens are literal values from the stylesheets, named for where they are used.
- **Heading sizes** are the desktop ends of the site's `clamp()` ranges; the fluid ranges are in each style's note.
- **Three literal colors** in the booking stylesheet are not tokens there and are not tokens here: `#3f4936` (tag text on `sea-soft`), `#a02020` (form error text), `#e7eadf` written out where `sea-soft` would do.
- **Legacy variable names** `paper`, `pink`, `pink-soft` and `sea` duplicate `white`, `ink`, `sand` and `sage` and were left out.
- **The headline face is ahead of the site.** stachepad.com still uses Calistoga at larger sizes. Display sizes here are about 86% of the site's, to keep line lengths similar in the wider face.
- **Photos** were not copied. They can be dropped onto the Assets tab.
- **Components** (button, fact chip, accordion, week card, form fields) are described above but not built as live components yet.
- **Favicon:** the home page declares none.
