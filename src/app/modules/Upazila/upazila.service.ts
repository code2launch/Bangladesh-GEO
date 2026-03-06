import { Prisma } from "@prisma/client";
import { IUpazilaFilterRequest } from "./upazila.interface";
import { IOptions, paginationHelper } from "../../helper/paginationHelper";
import { upazilaIncludes, upazilaSearchableFields } from "./upazila.constant";
import { prisma } from "../../shared/prisma";

// ─── Get All Upazilas ─────────────────────────────────────────────────────────
const getAllUpazilas = async (
  params: IUpazilaFilterRequest,
  options: IOptions,
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;
  const andConditions: Prisma.UpazilaWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: upazilaSearchableFields.map((field) => ({
        [field]: { contains: searchTerm, mode: "insensitive" },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]:
          key === "districtId" || key === "divisionId"
            ? { equals: Number((filterData as any)[key]) }
            : { equals: (filterData as any)[key] },
      })),
    });
  }

  const whereConditions: Prisma.UpazilaWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.upazila.findMany({
    skip,
    take: limit,
    where: whereConditions,
    include: upazilaIncludes,
    orderBy: { [sortBy]: sortOrder },
  });

  const total = await prisma.upazila.count({ where: whereConditions });

  return {
    meta: { page, limit, total },
    data: result,
  };
};

// ─── Get Upazila By ID ────────────────────────────────────────────────────────
const getUpazilaById = async (id: number) => {
  const result = await prisma.upazila.findUniqueOrThrow({
    where: { id },
    include: upazilaIncludes,
  });
  return result;
};

// ─── Get Post Offices By Upazila ──────────────────────────────────────────────
const getPostOfficesByUpazila = async (id: number, options: IOptions) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const result = await prisma.postOffice.findMany({
    skip,
    take: limit,
    where: { upazilaId: id },
    select: {
      id: true,
      nameEn: true,
      postCode: true,
      latitude: true,
      longitude: true,
    },
    orderBy: { [sortBy]: sortOrder },
  });

  const total = await prisma.postOffice.count({ where: { upazilaId: id } });

  return {
    meta: { page, limit, total },
    data: result,
  };
};

// ─── Get GeoJSON By Upazila ───────────────────────────────────────────────────
const getUpazilaGeoJSON = async (id: number) => {
  const result = await prisma.upazila.findUniqueOrThrow({
    where: { id },
    select: { id: true, nameEn: true, nameBn: true, geometry: true },
  });

  if (!result.geometry) {
    throw new Error("GeoJSON geometry is not available for this upazila");
  }

  return result.geometry;
};

export const UpazilaService = {
  getAllUpazilas,
  getUpazilaById,
  getPostOfficesByUpazila,
  getUpazilaGeoJSON,
};
