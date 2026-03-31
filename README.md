# Ebupot Unifikasi CTAS Playwright

Struktur ini dibuat untuk migrasi dari Cypress ke Playwright dengan pemisahan yang jelas:

- `tests/`: skenario bisnis dan langkah test
- `pages/`: aksi UI dan locator
- `playwright/fixtures/`: setup reusable seperti session atau factory
- `playwright/data/`: data uji
- `playwright/utils/`: helper umum

Flow yang sudah dimigrasi dari Cypress:

- login valid dan invalid
- create draft e-Bupot Unifikasi CTAS

## Jalankan project

```bash
npm install
npx playwright install
copy .env.example .env
npm test
```

## Prinsip penulisan test

- Satu file `spec` fokus ke satu capability bisnis.
- Step ditulis eksplisit dengan `test.step(...)`.
- Interaksi UI diletakkan di page object, bukan di spec.
- Setup seperti auth dipusatkan di fixture atau `global-setup.ts`.
- Untuk modul yang setup awalnya sama, gunakan `test.beforeEach(...)`.

## Template penulisan test case

- `tests/templates/wpdn-template.spec.ts` dipakai sebagai pola baku.
- Step test menjelaskan aksi bisnis.
- Fungsi teknis diletakkan di `pages/` atau `playwright/utils/`.
