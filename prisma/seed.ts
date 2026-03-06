import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import * as fs from "fs";
import * as path from "path";

import * as dotenv from "dotenv";
dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
// ─── Types matching the exact JSON shapes ─────────────────────────────────────

interface RawDivision {
  id: string;
  name: string;
  bn_name: string;
  lat: string;
  long: string;
}

interface RawDistrict {
  id: string;
  division_id: string;
  name: string;
  bn_name: string;
  lat: string;
  long: string;
}

interface RawUpazila {
  id: string;
  district_id: string;
  name: string;
  bn_name: string;
  // NOTE: upazilas have no lat/long in the source file
}

interface RawPostcode {
  division_id: string;
  district_id?: string; // 12 records use 'district' name instead
  district?: string; // fallback field for those 12 records
  upazila: string;
  postOffice: string;
  postCode: string;
}

interface GeoFeature {
  type: "Feature";
  properties: {
    ID_1: number;
    NAME_1: string; // Division (old spelling)
    ID_2: number;
    NAME_2: string; // Broad grouping (unused)
    ID_3: number;
    NAME_3: string; // District (actual)
    ID_4: number;
    NAME_4: string; // Upazila
  };
  geometry: object;
}

// ─── GeoJSON division name mapping ───────────────────────────────────────────
// The geojson file uses old spellings (6 divisions, pre-2015 split).
// Map them to the canonical names in bd-divisions.json.
const GEO_DIVISION_NAME_MAP: Record<string, string> = {
  barisal: "Barishal",
  chittagong: "Chattogram",
  dhaka: "Dhaka",
  khulna: "Khulna",
  rajshahi: "Rajshahi",
  sylhet: "Sylhet",
  // Rangpur and Mymensingh don't exist in the geojson (split after 2015)
};

// ─── GeoJSON district name mapping ───────────────────────────────────────────
// Geojson NAME_3 spellings that differ from bd-districts.json 'name' field.
const GEO_DISTRICT_NAME_MAP: Record<string, string> = {
  bandarbon: "Bandarban",
  barisal: "Barishal",
  bogra: "Bogura",
  borgona: "Barguna",
  chittagong: "Chattogram",
  "choua danga": "Chuadanga",
  comilla: "Cumilla",
  gaibanda: "Gaibandha",
  gopalgonj: "Gopalganj",
  hobiganj: "Habiganj",
  jaipurhat: "Joypurhat",
  jessore: "Jashore",
  jhalakati: "Jhalokati",
  kustia: "Kushtia",
  manikgonj: "Manikganj",
  moulvibazar: "Maulvibazar",
  munshigonj: "Munshiganj",
  "naray angonj": "Narayanganj",
  narshingdi: "Narsingdi",
  nasirabad: "Mymensingh", // Mymensingh was formerly Nasirabad
  netrakona: "Netrokona",
  "parbattya chattagram": "Rangamati", // CHT region → Rangamati representative
  rongpur: "Rangpur",
  shatkhira: "Satkhira",
  "sun amgonj": "Sunamganj",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const dataDir = path.join(__dirname, "../data");

function readJson<T>(filename: string): T {
  const filePath = path.join(dataDir, filename);
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

function normalizeKey(name: string): string {
  return name.trim().toLowerCase();
}

// Resolve a geojson district name to the canonical bd-districts name
function resolveGeoDistrictName(geoName: string): string {
  const key = normalizeKey(geoName);
  return GEO_DISTRICT_NAME_MAP[key] ?? geoName;
}

// Resolve a geojson division name to the canonical bd-divisions name
function resolveGeoDivisionName(geoName: string): string {
  const key = normalizeKey(geoName);
  return GEO_DIVISION_NAME_MAP[key] ?? geoName;
}

// ─── STEP 1: Seed Divisions ───────────────────────────────────────────────────

async function seedDivisions(): Promise<Map<string, number>> {
  console.log("\n📍 Seeding divisions...");

  const { divisions } = readJson<{ divisions: RawDivision[] }>(
    "bd-divisions.json",
  );

  await prisma.division.createMany({
    data: divisions.map((d) => ({
      bbsCode: d.id,
      nameEn: d.name,
      nameBn: d.bn_name,
      latitude: parseFloat(d.lat),
      longitude: parseFloat(d.long),
    })),
    skipDuplicates: true,
  });

  // Build lookup: bbsCode (source id string) → DB id
  const inserted = await prisma.division.findMany({
    select: { id: true, bbsCode: true, nameEn: true },
  });

  // Map 1: bbsCode string → DB id  (used by districts)
  const byBbsCode = new Map<string, number>(
    inserted.map((d) => [d.bbsCode, d.id]),
  );

  // Map 2: nameEn lowercase → DB id  (used by geojson matching)
  const byName = new Map<string, number>(
    inserted.map((d) => [normalizeKey(d.nameEn), d.id]),
  );

  console.log(`   ✓ ${inserted.length} divisions seeded`);
  return byBbsCode;
}

// ─── STEP 2: Seed Districts ───────────────────────────────────────────────────

async function seedDistricts(
  divisionBbsToDbId: Map<string, number>,
): Promise<Map<string, number>> {
  console.log("\n🗺  Seeding districts...");

  const { districts } = readJson<{ districts: RawDistrict[] }>(
    "bd-districts.json",
  );

  const data = districts.map((d) => {
    const divisionId = divisionBbsToDbId.get(d.division_id);
    if (!divisionId) {
      throw new Error(
        `Division not found for district "${d.name}" (division_id="${d.division_id}")`,
      );
    }
    return {
      bbsCode: d.id,
      divisionId,
      nameEn: d.name,
      nameBn: d.bn_name,
      latitude: parseFloat(d.lat),
      longitude: parseFloat(d.long),
    };
  });

  await prisma.district.createMany({ data, skipDuplicates: true });

  const inserted = await prisma.district.findMany({
    select: { id: true, bbsCode: true, nameEn: true },
  });

  // Map: bbsCode string → DB id  (used by upazilas + postcodes)
  const byBbsCode = new Map<string, number>(
    inserted.map((d) => [d.bbsCode, d.id]),
  );

  console.log(`   ✓ ${inserted.length} districts seeded`);
  return byBbsCode;
}

// ─── STEP 3: Seed Upazilas ────────────────────────────────────────────────────

async function seedUpazilas(
  districtBbsToDbId: Map<string, number>,
  divisionBbsToDbId: Map<string, number>,
): Promise<Map<string, number>> {
  console.log("\n🏘  Seeding upazilas...");

  const { upazilas } = readJson<{ upazilas: RawUpazila[] }>("bd-upazilas.json");

  // Fetch district → division mapping from already-seeded data
  const dbDistricts = await prisma.district.findMany({
    select: { id: true, bbsCode: true, divisionId: true },
  });
  const districtDbIdToDivisionId = new Map<number, number>(
    dbDistricts.map((d) => [d.id, d.divisionId]),
  );

  const CHUNK = 100;
  let total = 0;

  for (let i = 0; i < upazilas.length; i += CHUNK) {
    const chunk = upazilas.slice(i, i + CHUNK);
    const data = chunk.map((u) => {
      const districtId = districtBbsToDbId.get(u.district_id);
      if (!districtId) {
        throw new Error(
          `District not found for upazila "${u.name}" (district_id="${u.district_id}")`,
        );
      }
      const divisionId = districtDbIdToDivisionId.get(districtId)!;
      return {
        bbsCode: u.id,
        districtId,
        divisionId,
        nameEn: u.name,
        nameBn: u.bn_name,
        // Source data has no lat/long for upazilas — use district centre as fallback
        latitude: 0,
        longitude: 0,
      };
    });

    await prisma.upazila.createMany({ data, skipDuplicates: true });
    total += chunk.length;
  }

  const inserted = await prisma.upazila.findMany({
    select: { id: true, bbsCode: true, nameEn: true, districtId: true },
  });

  // Map: nameEn lowercase → DB id  (used by postcodes name-matching)
  const byName = new Map<string, number>(
    inserted.map((u) => [normalizeKey(u.nameEn), u.id]),
  );

  console.log(`   ✓ ${inserted.length} upazilas seeded`);
  console.log(
    "   ℹ  Note: upazilas have no lat/long in source data — stored as 0,0",
  );
  return byName;
}

// ─── STEP 4: Seed Post Offices ────────────────────────────────────────────────

async function seedPostOffices(
  districtBbsToDbId: Map<string, number>,
  divisionBbsToDbId: Map<string, number>,
  upazilaNameToDbId: Map<string, number>,
): Promise<void> {
  console.log("\n📮 Seeding post offices...");

  const { postcodes } = readJson<{ postcodes: RawPostcode[] }>(
    "bd-postcodes.json",
  );

  // Pre-fetch district name → DB id for the 12 records that lack district_id
  const dbDistricts = await prisma.district.findMany({
    select: { id: true, nameEn: true, divisionId: true },
  });
  const districtNameToDbId = new Map<string, number>(
    dbDistricts.map((d) => [normalizeKey(d.nameEn), d.id]),
  );
  const districtDbIdToDivisionId = new Map<number, number>(
    dbDistricts.map((d) => [d.id, d.divisionId]),
  );

  let resolved = 0;
  let unresolved = 0;
  let skipped = 0;

  const CHUNK = 100;
  let total = 0;

  for (let i = 0; i < postcodes.length; i += CHUNK) {
    const chunk = postcodes.slice(i, i + CHUNK);
    const data: any[] = [];

    for (const p of chunk) {
      // ── Resolve district ID ──────────────────────────────────────────────
      let districtId: number | null = null;

      if (p.district_id) {
        districtId = districtBbsToDbId.get(p.district_id) ?? null;
      } else if (p.district) {
        // 12 records use 'district' name instead of district_id
        districtId = districtNameToDbId.get(normalizeKey(p.district)) ?? null;
      }

      if (!districtId) {
        console.warn(
          `   ⚠  Skipping "${p.postOffice}" (${p.postCode}) — district not resolved`,
        );
        skipped++;
        continue;
      }

      // ── Resolve division ID ──────────────────────────────────────────────
      const divisionId =
        divisionBbsToDbId.get(p.division_id) ??
        districtDbIdToDivisionId.get(districtId) ??
        null;

      if (!divisionId) {
        console.warn(
          `   ⚠  Skipping "${p.postOffice}" — division not resolved`,
        );
        skipped++;
        continue;
      }

      // ── Resolve upazila ID by name matching ──────────────────────────────
      const rawUpazilaName = p.upazila.trim();
      const upazilaKey = normalizeKey(rawUpazilaName);

      let upazilaId: number | null = upazilaNameToDbId.get(upazilaKey) ?? null;

      if (!upazilaId) {
        // Try stripping common suffixes
        const stripped = upazilaKey
          .replace(/\s+sadar$/, "")
          .replace(/sadar$/, "")
          .trim();
        upazilaId = upazilaNameToDbId.get(stripped) ?? null;
      }

      if (upazilaId) {
        resolved++;
      } else {
        unresolved++;
      }

      data.push({
        divisionId,
        districtId,
        upazilaId, // null if unresolved — stored as fallback
        upazilaName: rawUpazilaName, // always store raw name
        nameEn: p.postOffice,
        postCode: p.postCode,
      });
    }

    if (data.length > 0) {
      await prisma.postOffice.createMany({ data, skipDuplicates: true });
      total += data.length;
    }
  }

  console.log(`   ✓ ${total} post offices seeded`);
  console.log(`   ✓ ${resolved} with resolved upazilaId FK`);
  console.log(
    `   ℹ  ${unresolved} with upazilaId=null (upazilaName stored for reference)`,
  );
  if (skipped > 0) {
    console.log(`   ⚠  ${skipped} records skipped (district unresolvable)`);
  }
}

// ─── STEP 5: Load GeoJSON Geometries ─────────────────────────────────────────

async function seedGeometry(): Promise<void> {
  console.log("\n🗾  Loading GeoJSON geometries...");

  const geoPath = path.join(dataDir, "bangladesh.geojson");
  if (!fs.existsSync(geoPath)) {
    console.log("   ⚠  bangladesh.geojson not found — skipping geometry load");
    return;
  }

  const raw = fs.readFileSync(geoPath, "utf-8");
  const geojson = JSON.parse(raw) as { features: GeoFeature[] };
  const features = geojson.features;

  // Fetch all divisions and districts from DB keyed by nameEn lowercase
  const dbDivisions = await prisma.division.findMany({
    select: { id: true, nameEn: true },
  });
  const dbDistricts = await prisma.district.findMany({
    select: { id: true, nameEn: true },
  });
  const dbUpazilas = await prisma.upazila.findMany({
    select: { id: true, nameEn: true },
  });

  const divisionNameToId = new Map<string, number>(
    dbDivisions.map((d) => [normalizeKey(d.nameEn), d.id]),
  );
  const districtNameToId = new Map<string, number>(
    dbDistricts.map((d) => [normalizeKey(d.nameEn), d.id]),
  );
  const upazilaNameToId = new Map<string, number>(
    dbUpazilas.map((u) => [normalizeKey(u.nameEn), u.id]),
  );

  // Track which upazila geometries have been matched (one feature per upazila)
  let upazilaUpdated = 0;
  let upazilaSkipped = 0;

  // Each geojson feature = one upazila polygon
  // We store the full Feature (with geometry) on the upazila record
  for (const feature of features) {
    const props = feature.properties;
    const upazilaGeoName = props.NAME_4;
    const key = normalizeKey(upazilaGeoName);

    const upazilaId = upazilaNameToId.get(key) ?? null;

    if (upazilaId) {
      await prisma.upazila.update({
        where: { id: upazilaId },
        data: { geometry: feature as any },
      });
      upazilaUpdated++;
    } else {
      upazilaSkipped++;
    }
  }

  console.log(`   ✓ ${upazilaUpdated} upazila geometries loaded`);
  console.log(
    `   ℹ  ${upazilaSkipped} features unmatched (name spelling differences)`,
  );

  // Also aggregate district geometries from upazila geometries
  // (Store a representative feature per district using first matched upazila)
  console.log("\n   Building district geometries from GeoJSON...");
  const districtFeatureMap = new Map<string, GeoFeature>();

  for (const feature of features) {
    const geoDistName = resolveGeoDistrictName(feature.properties.NAME_3);
    const key = normalizeKey(geoDistName);
    if (!districtFeatureMap.has(key)) {
      districtFeatureMap.set(key, feature);
    }
  }

  let districtUpdated = 0;
  for (const [nameKey, feature] of districtFeatureMap) {
    const districtId = districtNameToId.get(nameKey) ?? null;
    if (districtId) {
      await prisma.district.update({
        where: { id: districtId },
        data: { geometry: feature as any },
      });
      districtUpdated++;
    }
  }
  console.log(`   ✓ ${districtUpdated} district geometries loaded`);

  // Division geometries — use first matched feature per division
  console.log("\n   Building division geometries from GeoJSON...");
  const divisionFeatureMap = new Map<string, GeoFeature>();

  for (const feature of features) {
    const geoDivName = resolveGeoDivisionName(feature.properties.NAME_1);
    const key = normalizeKey(geoDivName);
    if (!divisionFeatureMap.has(key)) {
      divisionFeatureMap.set(key, feature);
    }
  }

  let divisionUpdated = 0;
  for (const [nameKey, feature] of divisionFeatureMap) {
    const divisionId = divisionNameToId.get(nameKey) ?? null;
    if (divisionId) {
      await prisma.division.update({
        where: { id: divisionId },
        data: { geometry: feature as any },
      });
      divisionUpdated++;
    }
  }
  console.log(`   ✓ ${divisionUpdated} division geometries loaded`);
  console.log(
    "   ℹ  Rangpur & Mymensingh have no geometry (not in geojson source)",
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Bangladesh Geo API — Database Seeder");
  console.log("=========================================");

  // Step 1
  const divisionBbsToDbId = await seedDivisions();

  // Step 2
  const districtBbsToDbId = await seedDistricts(divisionBbsToDbId);

  // Step 3
  const upazilaNameToDbId = await seedUpazilas(
    districtBbsToDbId,
    divisionBbsToDbId,
  );

  // Step 4
  await seedPostOffices(
    districtBbsToDbId,
    divisionBbsToDbId,
    upazilaNameToDbId,
  );

  // Step 5 (optional — geometry)
  await seedGeometry();

  console.log("\n=========================================");
  console.log("✅ Seeding complete!");
}

main()
  .catch((e) => {
    console.error("\n❌ Seeder failed:", e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
