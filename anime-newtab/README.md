# ✨ Anime New Tab — Chrome Extension

A beautiful anime-themed new tab page featuring:
- 🕐 Live clock with elegant typography
- 🔍 Working Google search bar
- 🌸 Falling sakura petals
- ⭐ Animated starfield background
- 💬 Rotating anime quotes (30 sec cycle)
- 🌤️ Live weather via your location
- 🧝 Floating anime mascot with speech bubble
- 💜 Ambient purple glow orbs

---

## 🛠️ Installation (Developer Mode)

1. **Unzip** this folder somewhere permanent on your computer  
   *(e.g. `Documents/anime-newtab` — don't delete it after installing!)*

2. Open **Chrome** and go to: `chrome://extensions`

3. Enable **Developer mode** (toggle in top-right corner)

4. Click **"Load unpacked"**

5. Select the **`anime-newtab`** folder

6. Open a new tab — enjoy! 🎉

---

## 📁 File Structure

```
anime-newtab/
├── manifest.json     ← Extension config
├── newtab.html       ← Main new tab page
├── newtab.css        ← All styles
├── newtab.js         ← Clock, weather, quotes, mascot
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

---

## 🎨 Customization

**Change quotes** → Edit the `QUOTES` array in `newtab.js`

**Change mascot messages** → Edit `MASCOT_MSGS` in `newtab.js`

**Change colors** → Edit the CSS variables at the top of `newtab.css`:
```css
--purple:  #6b4db5;
--lilac:   #c9a0ff;
--pink:    #f472b6;
```

**Change mascot** → Replace the `<svg id="mascotSvg">` block in `newtab.html` with your own SVG character, or swap in an `<img>` tag pointing to a local image file.

---

## 🌤️ Weather

Uses [Open-Meteo](https://open-meteo.com/) — completely free, no API key needed.  
Chrome will ask for location permission on first load. You can deny it; it defaults to Manila.

---

## 🔧 Updating

After editing any file, go to `chrome://extensions` and click the **↻ refresh** button on the extension card, then open a new tab.
