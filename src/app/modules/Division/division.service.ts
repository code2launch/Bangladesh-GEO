import { Prisma } from "@prisma/client";
import { IDivisionFilterRequest } from "./division.interface";
import { IOptions, paginationHelper } from "../../helper/paginationHelper";
import {
  divisionIncludes,
  divisionSearchableFields,
} from "./division.constant";
import { prisma } from "../../shared/prisma";

// ─── Get All Divisions ────────────────────────────────────────────────────────
const getAllDivisions = async (
  params: IDivisionFilterRequest,
  options: IOptions,
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;
  const andConditions: Prisma.DivisionWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: divisionSearchableFields.map((field) => ({
        [field]: { contains: searchTerm, mode: "insensitive" },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: { equals: (filterData as any)[key] },
      })),
    });
  }

  const whereConditions: Prisma.DivisionWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.division.findMany({
    skip,
    take: limit,
    where: whereConditions,
    include: divisionIncludes,
    orderBy: { [sortBy]: sortOrder },
  });

  const total = await prisma.division.count({ where: whereConditions });

  return {
    meta: { page, limit, total },
    data: result,
  };
};

// ─── Get Division By ID ───────────────────────────────────────────────────────
const getDivisionById = async (id: number) => {
  const result = await prisma.division.findUniqueOrThrow({
    where: { id },
    include: divisionIncludes,
  });
  return result;
};

// ─── Get Districts By Division ────────────────────────────────────────────────
const getDistrictsByDivision = async (id: number, options: IOptions) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const result = await prisma.district.findMany({
    skip,
    take: limit,
    where: { divisionId: id },
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

  const total = await prisma.district.count({ where: { divisionId: id } });

  return {
    meta: { page, limit, total },
    data: result,
  };
};

// ─── Get Upazilas By Division ─────────────────────────────────────────────────
const getUpazilasByDivision = async (id: number, options: IOptions) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const result = await prisma.upazila.findMany({
    skip,
    take: limit,
    where: { divisionId: id },
    select: {
      id: true,
      bbsCode: true,
      nameEn: true,
      nameBn: true,
      latitude: true,
      longitude: true,
      district: { select: { id: true, nameEn: true, nameBn: true } },
    },
    orderBy: { [sortBy]: sortOrder },
  });

  const total = await prisma.upazila.count({ where: { divisionId: id } });

  return {
    meta: { page, limit, total },
    data: result,
  };
};

// ─── Get Post Offices By Division ────────────────────────────────────────────
const getPostOfficesByDivision = async (id: number, options: IOptions) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const result = await prisma.postOffice.findMany({
    skip,
    take: limit,
    where: { divisionId: id },
    select: {
      id: true,
      nameEn: true,
      postCode: true,
      upazilaName: true,
      district: { select: { id: true, nameEn: true, nameBn: true } },
    },
    orderBy: { [sortBy]: sortOrder },
  });

  const total = await prisma.postOffice.count({ where: { divisionId: id } });

  return {
    meta: { page, limit, total },
    data: result,
  };
};

// ─── Get GeoJSON By Division ──────────────────────────────────────────────────
const getDivisionGeoJSON = async (id: number) => {
  const result = await prisma.division.findUniqueOrThrow({
    where: { id },
    select: { id: true, nameEn: true, nameBn: true, geometry: true },
  });

  if (!result.geometry) {
    throw new Error("GeoJSON geometry is not available for this division");
  }

  return result.geometry;
};

export const DivisionService = {
  getAllDivisions,
  getDivisionById,
  getDistrictsByDivision,
  getUpazilasByDivision,
  getPostOfficesByDivision,
  getDivisionGeoJSON,
};
