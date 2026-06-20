# For Muse 🌻 — Gift Reveal

A cinematic, single-page gift reveal: a wrapped present opens into a gift card
with an editable note, a voucher, and a local-only music player. Plain HTML,
CSS, and JavaScript — no frameworks, no backend, no build step.

```
project/
├── index.html        the page (gift scene + card scene)
├── styles.css         all styling, design tokens at the top as CSS variables
├── script.js           gift-open logic, note editor, voucher copy, music player
├── assets/
│   └── sunflower.svg    standalone copy of the signature mark (reference only)
├── music/
│   ├── 01-there-is-a-light-that-never-goes-out.mp3
│   ├── 02-its-not-living-if-its-not-with-you.mp3
│   ├── 03-mirrors.mp3
│   ├── 04-robbers.mp3
│   ├── 05-those-eyes.mp3
│   ├── 06-all-too-well-10-minute-version.mp3
│   └── 07-the-bitch-is-back.mp3
└── README.md
```

> **Note on assets:** the gift box and the sunflower signature mark are built
> with inline SVG + CSS rather than PNG images. This keeps them perfectly
> crisp on any screen, lets them animate (the lid opening, the sunflower
> "blooming"), and adds zero image weight to the page. `assets/sunflower.svg`
> is kept as a standalone copy in case you want to reuse the mark elsewhere
> (e.g. as a source for a favicon or a printed card).

> **You gave me 7 song titles, not 10** — the player is fully built and works
> end to end with these 7. See "Adding or changing songs" below to drop in
> 3 more whenever you have them; it's a two-line change.

---

## Running locally in VS Code

1. Open the `project` folder in VS Code.
2. Install the **Live Server** extension (by Ritwick Dey) if you don't have
   it — search for it in the Extensions panel.
3. Right-click `index.html` → **Open with Live Server**.

That's it — your browser opens the site at `http://127.0.0.1:5500` (or
similar) with the music files loading correctly.

You *can* also just double-click `index.html` to open it directly in a
browser (`file://...`) and everything will generally work too, but a local
server is recommended since it matches how the site behaves once deployed,
and avoids occasional browser quirks with `file://` pages.

If you don't want to install a VS Code extension, an alternative is:

```bash
npx serve .
```

run from inside the `project` folder, then open the URL it prints.

---

## How it works

- **Gift opens once.** Clicking the box sets a flag in `script.js` so the
  open animation can't be retriggered. (It resets on page refresh — see the
  comment in `script.js` near `giftReveal()` if you'd rather make it
  permanent using `localStorage`.)
- **Music never autoplays.** Every track loads with `preload="metadata"`
  only (so durations show up immediately without downloading the full file),
  and actually plays only when the person taps a track's play button.
- **Only one song plays at a time.** Starting a new track automatically
  pauses whatever was playing.
- **Switching songs preserves position.** Each track has its own `<audio>`
  element under the hood, so pausing one song and coming back to it later
  resumes exactly where you left off.
- **The note is editable.** Tap "Edit," change the text, tap "Save." The
  edited note is remembered in that browser via `localStorage` (so it
  survives a refresh on the same device), and the original text you gave me
  is what loads by default.
- **Voucher code & pin** have a one-tap "Copy code & pin" button with a
  small toast confirmation.

---

## Adding or changing songs later

1. Drop the new `.mp3` file into `/music`.
2. Open `script.js` and add one line to the `SONGS` array at the top:

```js
const SONGS = [
  // ...existing songs...
  { title: "Song Title", artist: "Artist Name", file: "music/your-file.mp3" },
];
```

The playlist UI, progress bars, and timers all build themselves from this
array — nothing else needs to change. Order in the array = order in the
playlist.

---

## Pushing to GitHub

From inside the `project` folder:

```bash
git init
git add .
git commit -m "Gift reveal site"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

(Create the empty repo on GitHub first if you haven't — github.com → New
repository — and copy its URL into the `git remote add` command above.)

> Music files are real audio files (a few MB each), so the repo will be
> larger than a typical text-only project — that's expected and fine for
> GitHub and Vercel.

---

## Deploying to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (GitHub login is
   easiest).
2. **Add New… → Project**, then select the GitHub repo you just pushed.
3. Framework preset: choose **Other** (it's a static site — no build step,
   no framework). Leave the build command blank and output directory as the
   project root.
4. Click **Deploy**.

Vercel will give you a live `https://your-project.vercel.app` URL within
about a minute. Every future `git push` to `main` redeploys automatically.

---

## Customizing further

- **Colors / fonts:** all design tokens live as CSS variables at the very
  top of `styles.css` (`:root { ... }`) — change a hex value there and it
  updates everywhere.
- **Card title / voucher details:** edit the text directly in `index.html`
  inside `#scene-card`.
- **Gift card title text** ("Here is your Coconut Ice Cream 🍦") is in the
  `<h1 class="card-title">` element.
