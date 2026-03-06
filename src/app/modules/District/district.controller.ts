import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { DistrictService } from "./district.service";
import catchAsync from "../../shared/catchAsync";
import pick from "../../shared/pick";
import { districtFilterableFields } from "./district.constant";
import { paginationOptions } from "../../constants";
import sendResponse from "../../shared/sendResponse";

// ─── Get All Districts ────────────────────────────────────────────────────────
const getAllDistricts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const filters = pick(req.query, districtFilterableFields);
    const options = pick(req.query, paginationOptions);
    const result = await DistrictService.getAllDistricts(filters, options);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Districts retrieved successfully!",
      meta: result.meta,
      data: result.data,
    });
  },
);

// ─── Get District By ID ───────────────────────────────────────────────────────
const getDistrictById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await DistrictService.getDistrictById(Number(id));
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "District retrieved successfully!",
      data: result,
    });
  },
);

// ─── Get Upazilas By District ─────────────────────────────────────────────────
const getUpazilasByDistrict = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const options = pick(req.query, paginationOptions);
    const result = await DistrictService.getUpazilasByDistrict(
      Number(id),
      options,
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Upazilas retrieved successfully!",
      meta: result.meta,
      data: result.data,
    });
  },
);

// ─── Get Post Offices By District ─────────────────────────────────────────────
const getPostOfficesByDistrict = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const options = pick(req.query, paginationOptions);
    const result = await DistrictService.getPostOfficesByDistrict(
      Number(id),
      options,
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Post offices retrieved successfully!",
      meta: result.meta,
      data: result.data,
    });
  },
);

// ─── Get GeoJSON By District ──────────────────────────────────────────────────
const getDistrictGeoJSON = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await DistrictService.getDistrictGeoJSON(Number(id));
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "District GeoJSON retrieved successfully!",
      data: result,
    });
  },
);

export const DistrictController = {
  getAllDistricts,
  getDistrictById,
  getUpazilasByDistrict,
  getPostOfficesByDistrict,
  getDistrictGeoJSON,
};
