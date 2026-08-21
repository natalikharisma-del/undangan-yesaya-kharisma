PANDUAN MENGAKTIFKAN RSVP & UCAPAN ONLINE

1. Buat Google Sheet baru di akun Google Anda.
2. Buka Extensions > Apps Script.
3. Hapus kode bawaan, lalu copy seluruh isi file GoogleAppsScript_Code.gs ke editor Apps Script.
4. Klik Save.
5. Jalankan fungsi "setup" sekali dan izinkan akses. Sheet "RSVP" dan "Ucapan" akan dibuat otomatis.
6. Klik Deploy > New deployment.
7. Pilih Type: Web app.
8. Execute as: Me.
9. Who has access: Anyone.
10. Deploy, lalu salin Web app URL.
11. Buka script.js dan ganti:
   TEMPEL_URL_GOOGLE_APPS_SCRIPT_DI_SINI
   dengan Web app URL Anda.
12. Simpan kembali website dan upload seluruh folder ke hosting.

CATATAN KEAMANAN
- Server memvalidasi jumlah tamu dan menolak angka di atas 2.
- Jangan taruh password/API key pribadi di HTML atau JavaScript.
- Google Sheet menjadi tempat penyimpanan RSVP dan ucapan.

MUSIK
Masukkan file MP3 bernama "lagu.mp3" ke folder assets.
Browser biasanya tidak mengizinkan autoplay sebelum interaksi; musik diputar setelah tombol "Buka Undangan" ditekan.
