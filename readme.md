# Bangladesh Geo API

বাংলাদেশের সম্পূর্ণ ভৌগোলিক তথ্যের জন্য একটি Production-ready REST API। এই API-তে বিভাগ, জেলা, উপজেলা, পোস্ট অফিস এবং পোস্ট কোডের সমস্ত তথ্য পাওয়া যায়। Pagination, Search, Filter এবং GeoJSON সাপোর্টসহ সম্পূর্ণভাবে তৈরি।

---

## 📋 সূচিপত্র

- [প্রজেক্ট পরিচিতি](#-প্রজেক্ট-পরিচিতি)
- [ডেটা কাঠামো](#-ডেটা-কাঠামো)
- [ফিচার সমূহ](#-ফিচার-সমূহ)
- [টেকনোলজি স্ট্যাক](#-টেকনোলজি-স্ট্যাক)
- [প্রজেক্ট ফোল্ডার স্ট্রাকচার](#-প্রজেক্ট-ফোল্ডার-স্ট্রাকচার)
- [ডেটাবেজ স্কিমা](#-ডেটাবেজ-স্কিমা)
- [লোকাল মেশিনে রান করার নিয়ম](#-লোকাল-মেশিনে-রান-করার-নিয়ম)
- [API এন্ডপয়েন্ট সমূহ](#-api-এন্ডপয়েন্ট-সমূহ)
- [Query Parameter গাইড](#-query-parameter-গাইড)
- [Response ফরম্যাট](#-response-ফরম্যাট)
- [Error Response](#-error-response)
- [Postman Collection](#-postman-collection)
- [ডেটা সোর্স](#-ডেটা-সোর্স)

---

## 🎯 প্রজেক্ট পরিচিতি

**Bangladesh Geo API** হলো বাংলাদেশের প্রশাসনিক ভৌগোলিক তথ্যের একটি সম্পূর্ণ REST API। যেকোনো অ্যাপ্লিকেশনে বাংলাদেশের লোকেশন ডেটা ব্যবহার করতে চাইলে এই API সরাসরি ইন্টিগ্রেট করা যাবে।

### এই API দিয়ে কী করা যাবে?

- বাংলাদেশের **৮টি বিভাগ**, **৬৪টি জেলা**, **৪৯৪টি উপজেলা** এবং **১৩৪৯টি পোস্ট অফিসের** সম্পূর্ণ তথ্য পাওয়া যাবে
- যেকোনো **GPS কোঅর্ডিনেট** (latitude/longitude) দিলে সেই স্থানের বিভাগ, জেলা ও উপজেলা খুঁজে বের করা যাবে
- **পোস্ট কোড** দিয়ে সম্পূর্ণ ঠিকানার হায়ারার্কি জানা যাবে
- বাংলা ও ইংরেজি উভয় ভাষায় **নাম দিয়ে সার্চ** করা যাবে
- **GeoJSON বাউন্ডারি** ডেটা পাওয়া যাবে — মানচিত্রে সীমানা দেখানোর জন্য

---

## 🗂 ডেটা কাঠামো

বাংলাদেশের প্রশাসনিক বিভাজন নিচের ৪-স্তরের হায়ারার্কি অনুসরণ করে:

```
বিভাগ (Division) — ৮টি
    └── জেলা (District) — ৬৪টি
             └── উপজেলা (Upazila) — ৪৯৪টি
                      └── পোস্ট অফিস (Post Office) — ১৩৪৯টি
```

| স্তর | ইংরেজি নাম               | সংখ্যা | উদাহরণ                     |
| ---- | ------------------------ | ------ | -------------------------- |
| ১    | Division (বিভাগ)         | ৮      | ঢাকা, চট্টগ্রাম, খুলনা     |
| ২    | District (জেলা)          | ৬৪     | ঢাকা, গাজীপুর, নারায়ণগঞ্জ |
| ৩    | Upazila (উপজেলা/থানা)    | ৪৯৪    | মতিঝিল, মিরপুর, সাভার      |
| ৪    | Post Office (পোস্ট অফিস) | ১৩৪৯   | GPO, মতিঝিল, বনানী         |

---

## ✨ ফিচার সমূহ

### ✅ মূল ফিচার

- **সম্পূর্ণ CRUD-less Read API** — শুধুমাত্র GET endpoint, নিরাপদ ও দ্রুত
- **৪-স্তরের হায়ারার্কিক্যাল ডেটা** — বিভাগ থেকে পোস্ট অফিস পর্যন্ত সম্পূর্ণ সম্পর্ক
- **Pagination** — সব লিস্ট এন্ডপয়েন্টে `page` ও `limit` সাপোর্ট
- **Smart Search** — `searchTerm` দিয়ে বাংলা ও ইংরেজি উভয় নামে case-insensitive সার্চ
- **Multi-field Filter** — একাধিক ফিল্ড একসাথে ফিল্টার করার সুবিধা
- **Sorting** — যেকোনো ফিল্ড দিয়ে ascending বা descending সর্ট

### 🗺 জিওগ্রাফিক ফিচার

- **GeoJSON বাউন্ডারি** — বিভাগ, জেলা ও উপজেলার সীমানা মানচিত্রে দেখানোর জন্য
- **Reverse Geocoding (`/locate`)** — GPS কোঅর্ডিনেট দিলে নিকটতম বিভাগ/জেলা/উপজেলা খুঁজে দেয়
- **Global Search (`/search`)** — একটি query দিয়ে সব ধরনের ডেটায় একসাথে সার্চ

### 📮 পোস্ট কোড ফিচার

- **পোস্ট কোড লিস্ট** — সব unique পোস্ট কোডের তালিকা
- **পোস্ট কোড লোকেশন** — পোস্ট কোড দিলে সম্পূর্ণ বিভাগ → জেলা → উপজেলা হায়ারার্কি

### 🔧 টেকনিক্যাল ফিচার

- **TypeScript** দিয়ে সম্পূর্ণ type-safe কোড
- **Prisma ORM** — কোনো raw SQL নেই, সম্পূর্ণ type-safe database query
- **Express v5** — সর্বশেষ Express framework
- **Standard JSON response** — সব response একই ফরম্যাটে

---

## 🛠 টেকনোলজি স্ট্যাক

| লেয়ার    | টেকনোলজি           | ভার্সন | কাজ                     |
| --------- | ------------------ | ------ | ----------------------- |
| Runtime   | Node.js            | v20+   | সার্ভার রানটাইম         |
| Language  | TypeScript         | ^5.9   | Type-safe কোড           |
| Framework | Express.js         | ^5.2   | HTTP routing            |
| ORM       | Prisma             | ^7.2   | Database query          |
| Database  | PostgreSQL         | 15+    | ডেটা স্টোরেজ            |
| Adapter   | @prisma/adapter-pg | ^7.2   | Prisma-PostgreSQL সংযোগ |
| Env       | dotenv             | ^17    | Environment variable    |

---

## 📁 প্রজেক্ট ফোল্ডার স্ট্রাকচার

```
bangladesh-geo/
│
├── 📁 data/                          ← সোর্স JSON ডেটা ফাইল
│   ├── bd-divisions.json             ← ৮টি বিভাগের তথ্য
│   ├── bd-districts.json             ← ৬৪টি জেলার তথ্য
│   ├── bd-upazilas.json              ← ৪৯৪টি উপজেলার তথ্য
│   ├── bd-postcodes.json             ← ১৩৪৯টি পোস্ট অফিসের তথ্য
│   └── bangladesh.geojson            ← GeoJSON বাউন্ডারি ডেটা
│
├── 📁 prisma/
│   ├── schema/                       ← Prisma schema ফাইল
│   └── seed.ts                       ← ডেটাবেজ সিড স্ক্রিপ্ট
│
├── 📁 src/
│   ├── 📁 divisions/                 ← বিভাগ মডিউল
│   │   ├── division.constants.ts     ← Filterable/searchable fields
│   │   ├── division.interfaces.ts    ← TypeScript interfaces
│   │   ├── division.service.ts       ← Business logic
│   │   ├── division.controller.ts    ← Request handlers
│   │   └── division.routes.ts        ← Route definitions
│   │
│   ├── 📁 districts/                 ← জেলা মডিউল
│   │   ├── district.constants.ts
│   │   ├── district.interfaces.ts
│   │   ├── district.service.ts
│   │   ├── district.controller.ts
│   │   └── district.routes.ts
│   │
│   ├── 📁 upazilas/                  ← উপজেলা মডিউল
│   │   ├── upazila.constants.ts
│   │   ├── upazila.interfaces.ts
│   │   ├── upazila.service.ts
│   │   ├── upazila.controller.ts
│   │   └── upazila.routes.ts
│   │
│   ├── 📁 postOffices/               ← পোস্ট অফিস, পোস্ট কোড ও Geo মডিউল
│   │   ├── postOffice.constants.ts
│   │   ├── postOffice.interfaces.ts
│   │   ├── postOffice.service.ts     ← locate ও search লজিকও এখানে
│   │   ├── postOffice.controller.ts
│   │   └── postOffice.routes.ts      ← তিনটি router export করে
│   │
│   ├── 📁 routes/
│   │   └── index.ts                  ← সব route একত্রিত করে mount করে
│   │
│   ├── 📁 shared/
│   │   ├── prisma.ts                 ← PrismaClient singleton
│   │   ├── catchAsync.ts             ← Async error wrapper
│   │   ├── sendResponse.ts           ← Standard response helper
│   │   └── pick.ts                   ← Object field picker
│   │
│   ├── 📁 helpers/
│   │   └── paginationHelper.ts       ← Pagination calculation
│   │
│   ├── 📁 middleware/
│   │   └── errorHandler.ts           ← Global error handler
│   │
│   ├── app.ts                        ← Express app setup
│   └── server.ts                     ← HTTP server start
│
├── prisma.config.ts                  ← Prisma 7 configuration
├── .env                              ← Environment variables
├── .env.example                      ← Environment variables এর উদাহরণ
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🗄 ডেটাবেজ স্কিমা

প্রজেক্টে ৪টি মডেল ব্যবহার করা হয়েছে:

### Division (বিভাগ)

| ফিল্ড       | টাইপ    | বিবরণ                        |
| ----------- | ------- | ---------------------------- |
| `id`        | Int     | Primary Key, auto-increment  |
| `bbsCode`   | String  | BBS অফিশিয়াল কোড (unique)   |
| `nameEn`    | String  | ইংরেজি নাম                   |
| `nameBn`    | String  | বাংলা নাম                    |
| `latitude`  | Decimal | কেন্দ্রীয় অক্ষাংশ           |
| `longitude` | Decimal | কেন্দ্রীয় দ্রাঘিমাংশ        |
| `geometry`  | Json?   | GeoJSON বাউন্ডারি (nullable) |

### District (জেলা)

| ফিল্ড        | টাইপ    | বিবরণ             |
| ------------ | ------- | ----------------- |
| `id`         | Int     | Primary Key       |
| `bbsCode`    | String  | BBS কোড (unique)  |
| `divisionId` | Int     | FK → Division     |
| `nameEn`     | String  | ইংরেজি নাম        |
| `nameBn`     | String  | বাংলা নাম         |
| `latitude`   | Decimal | অক্ষাংশ           |
| `longitude`  | Decimal | দ্রাঘিমাংশ        |
| `geometry`   | Json?   | GeoJSON বাউন্ডারি |

### Upazila (উপজেলা)

| ফিল্ড        | টাইপ    | বিবরণ                                               |
| ------------ | ------- | --------------------------------------------------- |
| `id`         | Int     | Primary Key                                         |
| `bbsCode`    | String  | BBS কোড (unique)                                    |
| `districtId` | Int     | FK → District                                       |
| `divisionId` | Int     | FK → Division _(Denormalized — দ্রুত query-র জন্য)_ |
| `nameEn`     | String  | ইংরেজি নাম                                          |
| `nameBn`     | String  | বাংলা নাম                                           |
| `latitude`   | Decimal | অক্ষাংশ                                             |
| `longitude`  | Decimal | দ্রাঘিমাংশ                                          |
| `geometry`   | Json?   | GeoJSON বাউন্ডারি                                   |

### PostOffice (পোস্ট অফিস)

| ফিল্ড         | টাইপ     | বিবরণ                      |
| ------------- | -------- | -------------------------- |
| `id`          | Int      | Primary Key                |
| `divisionId`  | Int      | FK → Division              |
| `districtId`  | Int      | FK → District              |
| `upazilaId`   | Int?     | FK → Upazila _(nullable)_  |
| `upazilaName` | String?  | উপজেলার raw নাম (fallback) |
| `nameEn`      | String   | পোস্ট অফিসের নাম           |
| `postCode`    | String   | ৪ ডিজিটের পোস্ট কোড        |
| `latitude`    | Decimal? | অক্ষাংশ _(optional)_       |
| `longitude`   | Decimal? | দ্রাঘিমাংশ _(optional)_    |

---

## 🚀 লোকাল মেশিনে রান করার নিয়ম

### ধাপ ১ — প্রয়োজনীয় সফটওয়্যার ইনস্টল করুন

নিচের সফটওয়্যারগুলো আগে থেকে ইনস্টল থাকতে হবে:

| সফটওয়্যার | ডাউনলোড লিংক           | প্রয়োজনীয় ভার্সন |
| ---------- | ---------------------- | ------------------ |
| Node.js    | https://nodejs.org     | v20 বা তার উপরে    |
| PostgreSQL | https://postgresql.org | v15 বা তার উপরে    |
| Git        | https://git-scm.com    | যেকোনো ভার্সন      |

### ধাপ ২ — রিপোজিটরি ক্লোন করুন

```bash
git clone https://github.com/your-username/bangladesh-geo.git
cd bangladesh-geo
```

### ধাপ ৩ — Dependencies ইনস্টল করুন

```bash
npm install
```

### ধাপ ৪ — PostgreSQL ডেটাবেজ তৈরি করুন

PostgreSQL-এ `psql` বা pgAdmin খুলে নিচের কমান্ড রান করুন:

```sql
CREATE DATABASE bangladesh_geo;
```

> ⚠️ **নোট:** এই প্রজেক্টে PostGIS দরকার নেই। Standard PostgreSQL যথেষ্ট।

### ধাপ ৫ — Environment Variable সেট করুন

প্রজেক্টের root-এ `.env` ফাইল তৈরি করুন:

```bash
cp .env.example .env
```

এরপর `.env` ফাইলটি খুলে নিজের তথ্য দিন:

```env
DATABASE_URL="postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/bangladesh_geo"
NODE_ENV=development
PORT=3000
```

**উদাহরণ:**

```env
DATABASE_URL="postgresql://postgres:12345@localhost:5432/bangladesh_geo"
NODE_ENV=development
PORT=3000
```

### ধাপ ৬ — `prisma.config.ts` তৈরি করুন

প্রজেক্টের root-এ `prisma.config.ts` ফাইল তৈরি করুন:

```ts
import { defineConfig } from "prisma/config";

export default defineConfig({
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
});
```

### ধাপ ৭ — ডেটাবেজ Migration রান করুন

```bash
npx prisma migrate dev --name init
```

সফল হলে এরকম দেখাবে:

```
✔ Your database is now in sync with your schema.
```

এরপর Prisma Client generate করুন:

```bash
npx prisma generate
```

### ধাপ ৮ — ডেটা ফাইল রাখুন

`data/` ফোল্ডারে নিচের ফাইলগুলো রাখুন:

```
data/
├── bd-divisions.json
├── bd-districts.json
├── bd-upazilas.json
├── bd-postcodes.json
└── bangladesh.geojson
```

> ডেটা সোর্স: [github.com/ifahimreza/bangladesh-geojson](https://github.com/ifahimreza/bangladesh-geojson)

### ধাপ ৯ — ডেটাবেজ Seed করুন

```bash
npm run seed
```

সফল হলে এরকম দেখাবে:

```
🌱 Bangladesh Geo API — Database Seeder
=========================================
📍 Seeding divisions...
   ✓ 8 divisions seeded
🗺  Seeding districts...
   ✓ 64 districts seeded
🏘  Seeding upazilas...
   ✓ 494 upazilas seeded
📮 Seeding post offices...
   ✓ 1349 post offices seeded
🗾  Loading GeoJSON geometries...
   ✓ 445 upazila geometries loaded
   ✓ 64 district geometries loaded
   ✓ 6 division geometries loaded
=========================================
✅ Seeding complete!
```

### ধাপ ১০ — সার্ভার স্টার্ট করুন

```bash
# Development mode (hot reload সহ)
npm run dev

# Production build
npm run build
npm start
```

সার্ভার চালু হলে দেখাবে:

```
🚀 Server running on port 3000
```

### ধাপ ১১ — পরীক্ষা করুন

ব্রাউজারে বা Postman-এ এই URL খুলুন:

```
http://localhost:3000/api/v1/divisions
```

সফল response:

```json
{
  "success": true,
  "message": "Divisions retrieved successfully!",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 8
  },
  "data": [...]
}
```

---

## 📡 API এন্ডপয়েন্ট সমূহ

**Base URL:** `http://localhost:3000/api/v1`

---

### 🏛 বিভাগ (Divisions)

| Method | Endpoint                      | বিবরণ                                                    |
| ------ | ----------------------------- | -------------------------------------------------------- |
| `GET`  | `/divisions`                  | সব বিভাগের তালিকা (district/upazila/postOffice সংখ্যাসহ) |
| `GET`  | `/divisions/:id`              | নির্দিষ্ট বিভাগের বিস্তারিত তথ্য                         |
| `GET`  | `/divisions/:id/districts`    | একটি বিভাগের সব জেলার তালিকা                             |
| `GET`  | `/divisions/:id/upazilas`     | একটি বিভাগের সব উপজেলার তালিকা                           |
| `GET`  | `/divisions/:id/post-offices` | একটি বিভাগের সব পোস্ট অফিসের তালিকা                      |
| `GET`  | `/divisions/:id/geojson`      | বিভাগের GeoJSON বাউন্ডারি                                |

**Filter Parameters (`/divisions`):**

| Parameter    | টাইপ   | বিবরণ                                     |
| ------------ | ------ | ----------------------------------------- |
| `searchTerm` | string | `nameEn`, `nameBn`, `bbsCode`-এ সার্চ করে |
| `nameEn`     | string | ইংরেজি নামে exact match                   |
| `nameBn`     | string | বাংলা নামে exact match                    |
| `bbsCode`    | string | BBS কোডে exact match                      |
| `page`       | number | পেজ নম্বর (default: 1)                    |
| `limit`      | number | প্রতি পেজে রেকর্ড (default: 10)           |
| `sortBy`     | string | সর্ট ফিল্ড (default: `createdAt`)         |
| `sortOrder`  | string | `asc` বা `desc` (default: `desc`)         |

**উদাহরণ:**

```
GET /api/v1/divisions?searchTerm=dhaka
GET /api/v1/divisions?nameEn=Barishal
GET /api/v1/divisions?page=1&limit=5&sortBy=nameEn&sortOrder=asc
GET /api/v1/divisions/3/districts?page=1&limit=20
```

---

### 🗺 জেলা (Districts)

| Method | Endpoint                      | বিবরণ                             |
| ------ | ----------------------------- | --------------------------------- |
| `GET`  | `/districts`                  | সব জেলার তালিকা (division তথ্যসহ) |
| `GET`  | `/districts/:id`              | নির্দিষ্ট জেলার বিস্তারিত তথ্য    |
| `GET`  | `/districts/:id/upazilas`     | একটি জেলার সব উপজেলার তালিকা      |
| `GET`  | `/districts/:id/post-offices` | একটি জেলার সব পোস্ট অফিসের তালিকা |
| `GET`  | `/districts/:id/geojson`      | জেলার GeoJSON বাউন্ডারি           |

**Filter Parameters (`/districts`):**

| Parameter    | টাইপ   | বিবরণ                                 |
| ------------ | ------ | ------------------------------------- |
| `searchTerm` | string | `nameEn`, `nameBn`, `bbsCode`-এ সার্চ |
| `nameEn`     | string | ইংরেজি নামে exact match               |
| `nameBn`     | string | বাংলা নামে exact match                |
| `bbsCode`    | string | BBS কোডে exact match                  |
| `divisionId` | number | নির্দিষ্ট বিভাগের জেলা ফিল্টার করুন   |
| `page`       | number | পেজ নম্বর                             |
| `limit`      | number | প্রতি পেজে রেকর্ড                     |
| `sortBy`     | string | সর্ট ফিল্ড                            |
| `sortOrder`  | string | `asc` বা `desc`                       |

**উদাহরণ:**

```
GET /api/v1/districts?divisionId=3
GET /api/v1/districts?searchTerm=cumilla
GET /api/v1/districts?nameEn=Chattogram
GET /api/v1/districts?divisionId=2&page=1&limit=10&sortBy=nameEn&sortOrder=asc
```

---

### 🏘 উপজেলা (Upazilas)

| Method | Endpoint                     | বিবরণ                                          |
| ------ | ---------------------------- | ---------------------------------------------- |
| `GET`  | `/upazilas`                  | সব উপজেলার তালিকা (district ও division তথ্যসহ) |
| `GET`  | `/upazilas/:id`              | নির্দিষ্ট উপজেলার বিস্তারিত তথ্য               |
| `GET`  | `/upazilas/:id/post-offices` | একটি উপজেলার সব পোস্ট অফিসের তালিকা            |
| `GET`  | `/upazilas/:id/geojson`      | উপজেলার GeoJSON বাউন্ডারি                      |

**Filter Parameters (`/upazilas`):**

| Parameter    | টাইপ   | বিবরণ                                 |
| ------------ | ------ | ------------------------------------- |
| `searchTerm` | string | `nameEn`, `nameBn`, `bbsCode`-এ সার্চ |
| `nameEn`     | string | ইংরেজি নামে exact match               |
| `nameBn`     | string | বাংলা নামে exact match                |
| `bbsCode`    | string | BBS কোডে exact match                  |
| `districtId` | number | নির্দিষ্ট জেলার উপজেলা ফিল্টার করুন   |
| `divisionId` | number | নির্দিষ্ট বিভাগের উপজেলা ফিল্টার করুন |
| `page`       | number | পেজ নম্বর                             |
| `limit`      | number | প্রতি পেজে রেকর্ড                     |
| `sortBy`     | string | সর্ট ফিল্ড                            |
| `sortOrder`  | string | `asc` বা `desc`                       |

**উদাহরণ:**

```
GET /api/v1/upazilas?districtId=1
GET /api/v1/upazilas?divisionId=3
GET /api/v1/upazilas?searchTerm=sadar
GET /api/v1/upazilas?districtId=1&divisionId=3&page=1&limit=10
```

---

### 📮 পোস্ট অফিস (Post Offices)

| Method | Endpoint            | বিবরণ                                           |
| ------ | ------------------- | ----------------------------------------------- |
| `GET`  | `/post-offices`     | সব পোস্ট অফিসের তালিকা (সম্পূর্ণ হায়ারার্কিসহ) |
| `GET`  | `/post-offices/:id` | নির্দিষ্ট পোস্ট অফিসের বিস্তারিত তথ্য           |

**Filter Parameters (`/post-offices`):**

| Parameter     | টাইপ   | বিবরণ                                       |
| ------------- | ------ | ------------------------------------------- |
| `searchTerm`  | string | `nameEn`, `postCode`, `upazilaName`-এ সার্চ |
| `nameEn`      | string | পোস্ট অফিসের নামে exact match               |
| `postCode`    | string | ৪ ডিজিটের পোস্ট কোডে exact match            |
| `upazilaName` | string | উপজেলার নামে exact match                    |
| `divisionId`  | number | বিভাগ দিয়ে ফিল্টার                         |
| `districtId`  | number | জেলা দিয়ে ফিল্টার                          |
| `upazilaId`   | number | উপজেলা দিয়ে ফিল্টার                        |
| `page`        | number | পেজ নম্বর                                   |
| `limit`       | number | প্রতি পেজে রেকর্ড                           |
| `sortBy`      | string | সর্ট ফিল্ড                                  |
| `sortOrder`   | string | `asc` বা `desc`                             |

**উদাহরণ:**

```
GET /api/v1/post-offices?divisionId=3&districtId=1
GET /api/v1/post-offices?searchTerm=GPO
GET /api/v1/post-offices?postCode=1000
GET /api/v1/post-offices?upazilaName=Motijheel
GET /api/v1/post-offices?districtId=1&page=1&limit=20&sortBy=postCode&sortOrder=asc
```

---

### ✉️ পোস্ট কোড (Post Codes)

| Method | Endpoint                     | বিবরণ                                                  |
| ------ | ---------------------------- | ------------------------------------------------------ |
| `GET`  | `/post-codes`                | সব unique পোস্ট কোডের তালিকা (sorted array)            |
| `GET`  | `/post-codes/:code`          | নির্দিষ্ট পোস্ট কোডের সব পোস্ট অফিস                    |
| `GET`  | `/post-codes/:code/location` | পোস্ট কোডের সম্পূর্ণ বিভাগ → জেলা → উপজেলা হায়ারার্কি |

**উদাহরণ:**

```
GET /api/v1/post-codes
GET /api/v1/post-codes/1000
GET /api/v1/post-codes/1000?page=1&limit=10
GET /api/v1/post-codes/1000/location
GET /api/v1/post-codes/8000/location
```

**`/post-codes/1000/location` Response:**

```json
{
  "success": true,
  "message": "Post code location retrieved successfully!",
  "data": {
    "id": 1,
    "nameEn": "GPO",
    "postCode": "1000",
    "upazila": { "id": 1, "nameEn": "Motijheel", "nameBn": "মতিঝিল" },
    "district": { "id": 1, "nameEn": "Dhaka", "nameBn": "ঢাকা" },
    "division": { "id": 3, "nameEn": "Dhaka", "nameBn": "ঢাকা" }
  }
}
```

---

### 🌍 Geo ইউটিলিটি

| Method | Endpoint      | বিবরণ                                                   |
| ------ | ------------- | ------------------------------------------------------- |
| `GET`  | `/geo/locate` | GPS কোঅর্ডিনেট দিলে নিকটতম বিভাগ/জেলা/উপজেলা খুঁজে দেয় |
| `GET`  | `/geo/search` | সব entity-তে একসাথে global সার্চ                        |

#### `/geo/locate` — Reverse Geocoding

GPS latitude ও longitude দিলে নিকটতম বিভাগ, জেলা ও উপজেলা খুঁজে দেয়।

| Parameter | টাইপ   | Required | বিবরণ                  |
| --------- | ------ | -------- | ---------------------- |
| `lat`     | number | ✅ হ্যাঁ | Latitude (অক্ষাংশ)     |
| `lng`     | number | ✅ হ্যাঁ | Longitude (দ্রাঘিমাংশ) |

**উদাহরণ:**

```
GET /api/v1/geo/locate?lat=23.8103&lng=90.4125   → ঢাকা
GET /api/v1/geo/locate?lat=22.3569&lng=91.7832   → চট্টগ্রাম
GET /api/v1/geo/locate?lat=24.8949&lng=91.8687   → সিলেট
GET /api/v1/geo/locate?lat=22.8456&lng=89.5403   → খুলনা
```

**Response:**

```json
{
  "success": true,
  "message": "Location retrieved successfully!",
  "data": {
    "coordinates": { "lat": 23.8103, "lng": 90.4125 },
    "division": { "id": 3, "nameEn": "Dhaka", "nameBn": "ঢাকা" },
    "district": { "id": 1, "nameEn": "Dhaka", "nameBn": "ঢাকা" },
    "upazila": { "id": 10, "nameEn": "Motijheel", "nameBn": "মতিঝিল" }
  }
}
```

#### `/geo/search` — Global Search

| Parameter | টাইপ   | Required | বিবরণ                                            |
| --------- | ------ | -------- | ------------------------------------------------ |
| `q`       | string | ✅ হ্যাঁ | সার্চ টার্ম (বাংলা বা ইংরেজি)                    |
| `type`    | string | ❌ না    | `division`, `district`, `upazila`, `post-office` |

**উদাহরণ:**

```
GET /api/v1/geo/search?q=Dhaka               → সব ধরনে সার্চ
GET /api/v1/geo/search?q=Sylhet&type=division  → শুধু বিভাগে সার্চ
GET /api/v1/geo/search?q=Sadar&type=upazila    → শুধু উপজেলায় সার্চ
GET /api/v1/geo/search?q=ঢাকা                 → বাংলায় সার্চ
GET /api/v1/geo/search?q=GPO&type=post-office  → পোস্ট অফিসে সার্চ
```

---

## 📐 Query Parameter গাইড

### Pagination Parameters

সব লিস্ট এন্ডপয়েন্টে কাজ করে:

| Parameter   | Default     | বিবরণ                                         |
| ----------- | ----------- | --------------------------------------------- |
| `page`      | `1`         | কোন পেজের ডেটা দেখাবে                         |
| `limit`     | `10`        | প্রতি পেজে কতটি রেকর্ড                        |
| `sortBy`    | `createdAt` | কোন ফিল্ড দিয়ে সর্ট হবে                      |
| `sortOrder` | `desc`      | `asc` (ছোট থেকে বড়) বা `desc` (বড় থেকে ছোট) |

### Search vs Filter পার্থক্য

|              | `searchTerm`                         | Filter (যেমন `nameEn`)                |
| ------------ | ------------------------------------ | ------------------------------------- |
| ম্যাচিং      | Partial match (আংশিক)                | Exact match (হুবহু)                   |
| Case         | Case-insensitive                     | Case-sensitive                        |
| একাধিক ফিল্ড | একসাথে অনেক ফিল্ডে খোঁজে             | শুধু নির্দিষ্ট ফিল্ডে                 |
| উদাহরণ       | `?searchTerm=dha` → Dhaka খুঁজে পাবে | `?nameEn=Dhaka` → হুবহু "Dhaka" লাগবে |

---

## 📦 Response ফরম্যাট

### List Response (তালিকা)

```json
{
  "success": true,
  "message": "Divisions retrieved successfully!",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 8
  },
  "data": [
    {
      "id": 3,
      "bbsCode": "3",
      "nameEn": "Dhaka",
      "nameBn": "ঢাকা",
      "latitude": "23.810332",
      "longitude": "90.412518",
      "_count": {
        "districts": 17,
        "upazilas": 124,
        "postOffices": 389
      }
    }
  ]
}
```

### Single Item Response (একটি রেকর্ড)

```json
{
  "success": true,
  "message": "District retrieved successfully!",
  "data": {
    "id": 1,
    "bbsCode": "1",
    "nameEn": "Dhaka",
    "nameBn": "ঢাকা",
    "latitude": "23.7115253",
    "longitude": "90.4111451",
    "division": {
      "id": 3,
      "nameEn": "Dhaka",
      "nameBn": "ঢাকা"
    },
    "_count": {
      "upazilas": 13,
      "postOffices": 47
    }
  }
}
```

---

## ❌ Error Response

```json
{
  "success": false,
  "message": "No Division found with id: 9999",
  "errorDetails": "..."
}
```

### সাধারণ Error কোড

| HTTP Code | কারণ                                                      |
| --------- | --------------------------------------------------------- |
| `404`     | রেকর্ড পাওয়া যায়নি (যেমন ভুল ID দিলে)                   |
| `404`     | GeoJSON geometry লোড হয়নি (Rangpur ও Mymensingh-এর জন্য) |
| `400`     | ভুল বা missing required parameter                         |
| `500`     | সার্ভার সমস্যা                                            |

---

## 📬 Postman Collection

প্রজেক্টের সাথে একটি সম্পূর্ণ Postman Collection দেওয়া আছে যাতে **৪৯টি request** রয়েছে।

### Import করার নিয়ম:

1. Postman খুলুন
2. **Import** বাটনে ক্লিক করুন
3. `Bangladesh-Geo-API.postman_collection.json` ফাইলটি সিলেক্ট করুন
4. Import করুন

### Collection Variable:

| Variable     | Default Value                  | পরিবর্তন করুন যদি         |
| ------------ | ------------------------------ | ------------------------- |
| `baseUrl`    | `http://localhost:3000/api/v1` | Port ভিন্ন হলে            |
| `divisionId` | `3` (ঢাকা)                     | অন্য division টেস্ট করতে  |
| `districtId` | `1` (ঢাকা জেলা)                | অন্য district টেস্ট করতে  |
| `upazilaId`  | `1`                            | অন্য upazila টেস্ট করতে   |
| `postCode`   | `1000` (ঢাকা GPO)              | অন্য post code টেস্ট করতে |

---

## 🔧 npm Scripts

| Command         | কাজ                                             |
| --------------- | ----------------------------------------------- |
| `npm run dev`   | Development mode-এ সার্ভার চালু (hot reload সহ) |
| `npm run build` | TypeScript compile করে `dist/` ফোল্ডারে         |
| `npm start`     | Production mode-এ সার্ভার চালু                  |
| `npm run seed`  | ডেটাবেজে সব ডেটা সিড করুন                       |

---

## 🗺 ডেটা সোর্স

এই প্রজেক্টের সমস্ত ভৌগোলিক ডেটা নিচের open-source রিপোজিটরি থেকে নেওয়া হয়েছে:

**[github.com/ifahimreza/bangladesh-geojson](https://github.com/ifahimreza/bangladesh-geojson)**

| ফাইল                 | বিষয়বস্তু                              |
| -------------------- | --------------------------------------- |
| `bd-divisions.json`  | ৮টি বিভাগের নাম ও কোঅর্ডিনেট            |
| `bd-districts.json`  | ৬৪টি জেলার নাম ও কোঅর্ডিনেট             |
| `bd-upazilas.json`   | ৪৯৪টি উপজেলার নাম                       |
| `bd-postcodes.json`  | ১৩৪৯টি পোস্ট অফিসের তথ্য ও কোড          |
| `bangladesh.geojson` | বিভাগ, জেলা ও উপজেলার GeoJSON বাউন্ডারি |

> **⚠️ জানা সীমাবদ্ধতা:**
>
> - উপজেলার কোঅর্ডিনেট সোর্স ডেটায় নেই — `0, 0` হিসেবে সংরক্ষিত
> - GeoJSON ফাইলটি ২০১৫-পূর্বের (৬টি বিভাগ) — তাই **রংপুর** ও **ময়মনসিংহ** বিভাগের `geometry` পাওয়া যাবে না
> - ১২টি পোস্ট অফিস রেকর্ডে `district_id` নেই — `district` নাম দিয়ে resolve করা হয়েছে

---

## 📄 লাইসেন্স

This project is licensed under the **ISC License**.

---

<div align="center">
  <p>Made with ❤️ for Code2Launch</p>
</div>
