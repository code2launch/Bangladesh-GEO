import { Prisma } from "@prisma/client";
import { IPostOfficeFilterRequest } from "./postoffice.interface";
import { IOptions, paginationHelper } from "../../helper/paginationHelper";
import {
  postOfficeIncludes,
  postOfficeSearchableFields,
} from "./postoffice.constant";
import { prisma } from "../../shared/prisma";

// numeric FK fields that need Number() coercion
const numericFields = ["divisionId", "districtId", "upazilaId"];

// ─── Get All Post Offices ─────────────────────────────────────────────────────
const getAllPostOffices = async (
  params: IPostOfficeFilterRequest,
  options: IOptions,
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;
  const andConditions: Prisma.PostOfficeWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: postOfficeSearchableFields.map((field) => ({
        [field]: { contains: searchTerm, mode: "insensitive" },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: numericFields.includes(key)
            ? Number((filterData as any)[key])
            : (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.PostOfficeWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.postOffice.findMany({
    skip,
    take: limit,
    where: whereConditions,
    include: postOfficeIncludes,
    orderBy: { [sortBy]: sortOrder },
  });

  const total = await prisma.postOffice.count({ where: whereConditions });

  return {
    meta: { page, limit, total },
    data: result,
  };
};

// ─── Get Post Office By ID ────────────────────────────────────────────────────
const getPostOfficeById = async (id: number) => {
  const result = await prisma.postOffice.findUniqueOrThrow({
    where: { id },
    include: postOfficeIncludes,
  });
  return result;
};

// ─── Get All Unique Post Codes ────────────────────────────────────────────────
const getAllPostCodes = async () => {
  const result = await prisma.postOffice.findMany({
    distinct: ["postCode"],
    select: { postCode: true },
    orderBy: { postCode: "asc" },
  });
  return result.map((p) => p.postCode);
};

// ─── Get By Post Code ─────────────────────────────────────────────────────────
const getByPostCode = async (postCode: string, options: IOptions) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const normalizedCode = postCode.padStart(4, "0");

  const result = await prisma.postOffice.findMany({
    skip,
    take: limit,
    where: { postCode: normalizedCode },
    include: postOfficeIncludes,
    orderBy: { [sortBy]: sortOrder },
  });

  const total = await prisma.postOffice.count({
    where: { postCode: normalizedCode },
  });

  return {
    meta: { page, limit, total },
    data: result,
  };
};

// ─── Get Post Code Location (full hierarchy) ──────────────────────────────────
const getPostCodeLocation = async (postCode: string) => {
  const normalizedCode = postCode.padStart(4, "0");

  const result = await prisma.postOffice.findFirstOrThrow({
    where: { postCode: normalizedCode },
    select: {
      id: true,
      nameEn: true,
      postCode: true,
      upazila: { select: { id: true, nameEn: true, nameBn: true } },
      district: { select: { id: true, nameEn: true, nameBn: true } },
      division: { select: { id: true, nameEn: true, nameBn: true } },
    },
  });

  return result;
};

// ─── Search / Locate by Coordinates ──────────────────────────────────────────
const locateByCoordinates = async (lat: number, lng: number) => {
  const delta = 0.5;
  const bbox = {
    latitude: { gte: lat - delta, lte: lat + delta },
    longitude: { gte: lng - delta, lte: lng + delta },
  };

  const haversine = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
  ): number => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const nearest = <T extends { latitude: any; longitude: any }>(
    items: T[],
  ): T | null =>
    items.sort(
      (a, b) =>
        haversine(lat, lng, Number(a.latitude), Number(a.longitude)) -
        haversine(lat, lng, Number(b.latitude), Number(b.longitude)),
    )[0] ?? null;

  const [divisionCandidates, districtCandidates, upazilaCandidates] =
    await Promise.all([
      prisma.division.findMany({
        where: bbox,
        select: {
          id: true,
          nameEn: true,
          nameBn: true,
          latitude: true,
          longitude: true,
        },
      }),
      prisma.district.findMany({
        where: bbox,
        select: {
          id: true,
          nameEn: true,
          nameBn: true,
          latitude: true,
          longitude: true,
          divisionId: true,
        },
      }),
      prisma.upazila.findMany({
        where: bbox,
        select: {
          id: true,
          nameEn: true,
          nameBn: true,
          latitude: true,
          longitude: true,
          districtId: true,
        },
      }),
    ]);

  return {
    coordinates: { lat, lng },
    division: nearest(divisionCandidates),
    district: nearest(districtCandidates),
    upazila: nearest(upazilaCandidates),
  };
};

// ─── Global Search ────────────────────────────────────────────────────────────
const globalSearch = async (q: string, type?: string) => {
  const searchFilter = { contains: q, mode: "insensitive" as const };

  const [divisions, districts, upazilas, postOffices] = await Promise.all([
    !type || type === "division"
      ? prisma.division.findMany({
          where: { OR: [{ nameEn: searchFilter }, { nameBn: searchFilter }] },
          select: { id: true, nameEn: true, nameBn: true },
          take: 5,
        })
      : [],

    !type || type === "district"
      ? prisma.district.findMany({
          where: { OR: [{ nameEn: searchFilter }, { nameBn: searchFilter }] },
          select: {
            id: true,
            nameEn: true,
            nameBn: true,
            division: { select: { id: true, nameEn: true } },
          },
          take: 10,
        })
      : [],

    !type || type === "upazila"
      ? prisma.upazila.findMany({
          where: { OR: [{ nameEn: searchFilter }, { nameBn: searchFilter }] },
          select: {
            id: true,
            nameEn: true,
            nameBn: true,
            district: { select: { id: true, nameEn: true } },
            division: { select: { id: true, nameEn: true } },
          },
          take: 15,
        })
      : [],

    !type || type === "post-office"
      ? prisma.postOffice.findMany({
          where: {
            OR: [
              { nameEn: searchFilter },
              { postCode: { contains: q } },
              { upazilaName: searchFilter },
            ],
          },
          select: {
            id: true,
            nameEn: true,
            postCode: true,
            district: { select: { id: true, nameEn: true } },
          },
          take: 10,
        })
      : [],
  ]);

  return {
    query: q,
    results: {
      ...(divisions.length && { divisions }),
      ...(districts.length && { districts }),
      ...(upazilas.length && { upazilas }),
      ...(postOffices.length && { postOffices }),
    },
  };
};

export const PostOfficeService = {
  getAllPostOffices,
  getPostOfficeById,
  getAllPostCodes,
  getByPostCode,
  getPostCodeLocation,
  locateByCoordinates,
  globalSearch,
};
