# 🎨 Asset Guide — Islamic Wedding Invitation

Panduan lengkap untuk generate, menyimpan, dan menghubungkan asset ilustrasi ke website.

---

## Daftar Ilustrasi yang Dibutuhkan

| # | Nama File | Digunakan di | Ukuran | Format |
|---|-----------|-------------|--------|--------|
| 1 | `bride.png` | Couple Section — Foto pengantin wanita | 400×400px | PNG (transparan) |
| 2 | `groom.png` | Couple Section — Foto pengantin pria | 400×400px | PNG (transparan) |
| 3 | `cover-couple.png` | Cover Section — Ilustrasi pasangan | 600×800px | PNG (transparan) |
| 4 | `story-meeting.png` | Timeline — Pertama Bertemu | 200×200px | PNG (transparan) |
| 5 | `story-closer.png` | Timeline — Mulai Dekat | 200×200px | PNG (transparan) |
| 6 | `story-proposal.png` | Timeline — Lamaran | 200×200px | PNG (transparan) |
| 7 | `story-wedding.png` | Timeline — Pernikahan | 200×200px | PNG (transparan) |
| 8 | `gallery-1.jpg` s/d `gallery-6.jpg` | Gallery Section — Foto prewedding | 600×600px | JPG |
| 9 | `bg-music.mp3` | Background music | - | MP3 |

---

## Prompt untuk Generate Ilustrasi

> **Style:** Gunakan style yang sama untuk semua → **flat illustration, simple, minimal detail, faceless Islamic, dark night sky background with stars**
>
> **Tools:** [Leonardo.ai](https://leonardo.ai) (gratis), [Midjourney](https://midjourney.com), [DALL-E](https://openai.com/dall-e-3), atau [Bing Image Creator](https://www.bing.com/create)

### 1. Cover — Pasangan (cover-couple.png)
```
Simple flat illustration of a faceless Muslim couple standing under a starry 
night sky. The bride wears an elegant white niqab (face veil) and flowing white 
dress. The groom has a beard without moustache, wears a white kopiah (Muslim 
skullcap), white formal shirt, and white formal pants cut above the ankle 
(above-ankle length). They stand close together. Surrounded by small golden 
stars and crescent moon. Deep midnight blue background (#0F1729). Minimalist 
style, soft warm gold accents, no facial features, clean vector-like 
illustration. Transparent background PNG.
```

### 2. Pengantin Wanita (bride.png)
```
Simple flat illustration of a faceless Muslim bride wearing an elegant white 
niqab (face veil covering face) with gold trim embroidery, holding a small 
bouquet of white flowers. Half-body portrait, minimalist style. Deep dark blue 
background with tiny golden stars. Warm gold accents (#D4AF61). Face completely 
covered by niqab. Clean, simple, not too detailed. Transparent background PNG.
```

### 3. Pengantin Pria (groom.png)
```
Simple flat illustration of a faceless Muslim groom with a neat beard (no 
moustache), wearing a white kopiah (Muslim skullcap), white formal dress shirt, 
and white formal pants cut above the ankle. Half-body portrait, minimalist 
style. Deep dark blue background with tiny golden stars. Warm gold accents 
(#D4AF61). No facial features shown except beard outline. Clean, simple, not 
too detailed. Hands clasped in front. Transparent background PNG.
```

### 4. Pertama Bertemu (story-meeting.png)
```
Simple flat icon-style illustration of two faceless Muslim silhouettes meeting 
for the first time, small handshake gesture. The woman wears niqab, the man 
wears kopiah and has a beard. Minimalist, circular composition. Dark blue 
background with gold sparkles. Warm gold outlines. No facial features. 
200x200px, clean and simple.
```

### 5. Menemui Ayah Mempelai Wanita (story-closer.png)
```
Simple flat icon-style illustration of a faceless young Muslim man with beard 
(no moustache) and kopiah, sitting respectfully across from an older Muslim man 
(the bride's father) who also wears kopiah. They are having a formal meeting/
conversation. Minimalist, circular composition. Dark blue background with gold 
sparkles. Warm gold outlines. No facial features. 200x200px, clean and simple.
```

### 6. Lamaran (story-proposal.png)
```
Simple flat icon-style illustration of a faceless Muslim man with beard (no 
moustache) and kopiah presenting a ring box to a woman in niqab. Both shown as 
simple silhouettes. Minimalist, circular composition. Dark blue background with 
gold sparkles and tiny stars. Warm gold outlines. No facial features. 
200x200px, clean and simple.
```

### 7. Pernikahan (story-wedding.png)
```
Simple flat icon-style illustration of a faceless Muslim bride in niqab and 
groom with beard and kopiah, standing together with a small mosque silhouette 
behind them. Groom wears white shirt and pants above ankle. Minimalist, 
circular composition. Dark blue background with gold sparkles and crescent 
moon. Warm gold outlines (#D4AF61). No facial features. 200x200px, clean and 
simple.
```

---

## Cara Menyimpan Asset

### Langkah 1: Buat folder assets
```
wedding_invitation/
├── public/
│   ├── images/
│   │   ├── bride.png
│   │   ├── groom.png
│   │   ├── cover-couple.png
│   │   ├── story-meeting.png
│   │   ├── story-closer.png
│   │   ├── story-proposal.png
│   │   ├── story-wedding.png
│   │   ├── gallery-1.jpg
│   │   ├── gallery-2.jpg
│   │   ├── gallery-3.jpg
│   │   ├── gallery-4.jpg
│   │   ├── gallery-5.jpg
│   │   └── gallery-6.jpg
│   └── audio/
│       └── bg-music.mp3
```

> **Kenapa `public/`?** File di folder `public/` akan di-copy langsung ke output build oleh Vite, tanpa processing. Akses via URL: `/images/bride.png`

### Langkah 2: Update HTML — Couple Section

Cari bagian **Bride Photo** di `index.html` (sekitar baris 78-83):
```html
<!-- SEBELUM (placeholder) -->
<div class="couple-photo-placeholder bride-placeholder">
  <div class="placeholder-icon">👰</div>
  <span class="placeholder-text">Bride Photo</span>
</div>

<!-- SESUDAH (dengan gambar) -->
<img src="/images/bride.png" alt="Foto Pengantin Wanita" 
     style="width:100%; height:100%; object-fit:cover;" />
```

Lakukan yang sama untuk **Groom Photo** (sekitar baris 100-103):
```html
<!-- SESUDAH -->
<img src="/images/groom.png" alt="Foto Pengantin Pria" 
     style="width:100%; height:100%; object-fit:cover;" />
```

### Langkah 3: Update HTML — Timeline Story Icons

Cari setiap `timeline-photo-placeholder` di `index.html` dan ganti emoji dengan gambar:
```html
<!-- SEBELUM -->
<div class="timeline-photo-placeholder">🤝</div>

<!-- SESUDAH -->
<div class="timeline-photo-placeholder">
  <img src="/images/story-meeting.png" alt="" 
       style="width:100%; height:100%; object-fit:cover; border-radius:50%;" />
</div>
```

Mapping emoji → file:
| Emoji Lama | Ganti dengan |
|------------|-------------|
| 🤝 | `/images/story-meeting.png` |
| 💛 | `/images/story-closer.png` |
| 💍 | `/images/story-proposal.png` |
| 🕌 | `/images/story-wedding.png` |

### Langkah 4: Update HTML — Gallery

Cari setiap `gallery-placeholder` (ada 6 buah) dan ganti:
```html
<!-- SEBELUM -->
<div class="gallery-placeholder">
  <span>📸</span>
  <p>Photo 1</p>
</div>

<!-- SESUDAH -->
<img src="/images/gallery-1.jpg" alt="Foto 1" 
     style="width:100%; height:100%; object-fit:cover;" />
```

Ulangi untuk `gallery-2.jpg` sampai `gallery-6.jpg`.

### Langkah 5: Update Background Music

Buka `src/js/music.js`, cari baris URL audio dan ganti:
```javascript
// SEBELUM
audio.src = 'https://example.com/your-nasheed.mp3';

// SESUDAH
audio.src = '/audio/bg-music.mp3';
```

> **Rekomendasi:** Cari nasheed instrumental tanpa lirik di YouTube, download sebagai MP3 (128kbps cukup, agar ringan). Contoh: "Maher Zain instrumental" atau "nasheed no vocal".

---

## Checklist Akhir

- [ ] Generate semua ilustrasi dari prompt di atas
- [ ] Buat folder `public/images/` dan `public/audio/`
- [ ] Simpan semua file dengan nama yang benar
- [ ] Update `index.html` — Bride photo
- [ ] Update `index.html` — Groom photo
- [ ] Update `index.html` — 4 timeline story icons
- [ ] Update `index.html` — 6 gallery photos
- [ ] Update `src/js/music.js` — URL audio
- [ ] Test di browser: `npm run dev`
- [ ] Build untuk production: `npm run build`
- [ ] Deploy ke GitHub Pages