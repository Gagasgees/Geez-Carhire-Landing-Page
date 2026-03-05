# 🔧 Debugging Button Pay via WhatsApp

## Langkah-langkah Troubleshooting

### 1. **Buka Browser Developer Tools**
   - Tekan `F12` atau `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
   - Pilih tab **Console**

### 2. **Buka Halaman Booking**
   - Pergi ke `booking.html`
   - Lihat di Console apakah ada pesan seperti:
     ```
     ✅ DOMContentLoaded event fired!
     🔍 Booking Form Found: <form>
     ✅ Submit button found: <button>
     ✅ Semua fungsi sudah diinitialisasi!
     ```

### 3. **Isi Form Lengkap**
   - First Name: Test
   - Last Name: User
   - Email: test@example.com
   - Phone: 08123456789
   - Address: Jakarta
   - Car Type: Pilih salah satu (contoh: Compact Car)
   - Pickup Date: Pilih tanggal (contoh: 10 Maret 2026)
   - Return Date: Pilih tanggal (contoh: 12 Maret 2026)
   - Pickup Time: Pilih jam (contoh: 09:00)
   - Setuju Terms & Conditions ✓

### 4. **Klik "Pay via WhatsApp"**
   - Perhatikan Console untuk melihat log:
     ```
     🖱️ Submit button clicked!
     📋 Form Data: {...}
     💰 Price Per Day: 6.00
     ✅ Validasi berhasil! Mengirim ke WhatsApp...
     📱 Booking Message: ...
     Opening WhatsApp URL: https://wa.me/...
     ```

### 5. **Kemungkinan Masalah & Solusi**

#### ❌ Jika Button Tidak Merespons
- **Masalah**: Form tidak ditemukan
- **Solusi**: Refresh halaman (Ctrl+R), tunggu 2 detik sebelum klik tombol

#### ❌ Jika Ada Error "required"
- **Masalah**: Ada field yang belum diisi
- **Solusi**: Pastikan semua field wajib diisi (lihat tanda *)

#### ❌ Jika Console Menunjukkan Popup Blocked
- **Masalah**: Browser memblokir popup WhatsApp
- **Solusi**: Izinkan popup untuk domain ini di browser settings

#### ❌ Jika WhatsApp Tidak Terbuka
- **Masalah**: Nomor WhatsApp mungkin salah
- **Solusi**: Cek `assets/js/booking.js` baris 17:
   ```javascript
   const WHATSAPP_NUMBER = '62895424688302'; // GANTI DENGAN NOMOR ANDA
   ```
   - Format: `62` + nomor tanpa `0` di awal
   - Contoh: `0821xxxxxxxx` → `6281xxxxxxxx`

### 6. **Copy Log untuk Support**
Jika masih ada masalah, copy seluruh pesan Console dan kirim ke developer:

```javascript
// Paste di Console untuk melihat info sistem
console.log('Browser:', navigator.userAgent);
console.log('URL:', window.location.href);
console.log('Form:', document.getElementById('bookingForm'));
console.log('Submit Button:', document.querySelector('button[type="submit"]'));
```

---

## ⚡ Quick Test Command

Paste di Console untuk test WhatsApp tanpa isi form:

```javascript
// Test: Buka WhatsApp dengan pesan test
const testMessage = 'Ini adalah pesan test dari booking form!';
const WHATSAPP_NUMBER = '62895424688302'; // Ganti dengan nomor Anda
const encodedMsg = encodeURIComponent(testMessage);
const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMsg}`;
console.log('Test URL:', url);
window.open(url, '_blank');
```

Jika perintah ini berhasil membuka WhatsApp, maka nomor sudah benar.

---

## 📋 Checklist Sebelum Submit

- [ ] Semua field form sudah diisi
- [ ] Minimal 1 hari untuk rental (tanggal return > tanggal pickup)
- [ ] Checkbox "I agree to the terms and conditions" sudah dicentang
- [ ] Nomor WhatsApp di `assets/js/booking.js` sudah benar
- [ ] Tidak ada error di Console (F12)
- [ ] Browser tidak memblokir popup

---

**Jika semua sudah dicek dan masih ada masalah, hubungi developer dengan screenshot Console!**
