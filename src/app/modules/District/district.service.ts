import { Prisma } from "@prisma/client";
import { IDistrictFilterRequest } from "./district.interface";
import { IOptions, paginationHelper } from "../../helper/paginationHelper";
import {
  districtIncludes,
  districtSearchableFields,
} from "./district.constant";
import { prisma } from "../../shared/prisma";

// ─── Get All Districts ────────────────────────────────────────────────────────
const getAllDistricts = async (
  params: IDistrictFilterRequest,
  options: IOptions,
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;
  const andConditions: Prisma.DistrictWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: districtSearchableFields.map((field) => ({
        [field]: { contains: searchTerm, mode: "insensitive" },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]:
          key === "divisionId"
            ? { equals: Number((filterData as any)[key]) }
            : { equals: (filterData as any)[key] },
      })),
    });
  }

  const whereConditions: Prisma.DistrictWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.district.findMany({
    skip,
    take: limit,
    where: whereConditions,
    include: districtIncludes,
    orderBy: { [sortBy]: sortOrder },
  });

  const total = await prisma.district.count({ where: whereConditions });

  return {
    meta: { page, limit, total },
    data: result,
  };
};

// ─── Get District By ID ───────────────────────────────────────────────────────
const getDistrictById = async (id: number) => {
  const result = await prisma.district.findUniqueOrThrow({
    where: { id },
    include: districtIncludes,
  });
  return result;
};

// ─── Get Upazilas By District ─────────────────────────────────────────────────
const getUpazilasByDistrict = async (id: number, options: IOptions) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const result = await prisma.upazila.findMany({
    skip,
    take: limit,
    where: { districtId: id },
    select: {
      id: true,
      bbsCode: true,
      nameEn: true,
      nameBn: true,
      latitude: true,
      longitude: true,
    },
    orderBy: { [sortBy]: sortOrder },
  });

  const total = await prisma.upazila.count({ where: { districtId: id } });

  return {
    meta: { page, limit, total },
    data: result,
  };
};

// ─── Get Post Offices By District ─────────────────────────────────────────────
const getPostOfficesByDistrict = async (id: number, options: IOptions) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const result = await prisma.postOffice.findMany({
    skip,
    take: limit,
    where: { districtId: id },
    select: {
      id: true,
      nameEn: true,
      postCode: true,
      upazilaName: true,
      upazila: { select: { id: true, nameEn: true, nameBn: true } },
    },
    orderBy: { [sortBy]: sortOrder },
  });

  const total = await prisma.postOffice.count({ where: { districtId: id } });

  return {
    meta: { page, limit, total },
    data: result,
  };
};

// ─── Get GeoJSON By District ──────────────────────────────────────────────────
const getDistrictGeoJSON = async (id: number) => {
  const result = await prisma.district.findUniqueOrThrow({
    where: { id },
    select: { id: true, nameEn: true, nameBn: true, geometry: true },
  });

  if (!result.geometry) {
    throw new Error("GeoJSON geometry is not available for this district");
  }

  return result.geometry;
};

export const DistrictService = {
  getAllDistricts,
  getDistrictById,
  getUpazilasByDistrict,
  getPostOfficesByDistrict,
  getDistrictGeoJSON,
};
