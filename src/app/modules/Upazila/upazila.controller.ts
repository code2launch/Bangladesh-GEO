import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { UpazilaService } from "./upazila.service";
import catchAsync from "../../shared/catchAsync";
import { upazilaFilterableFields } from "./upazila.constant";
import { paginationOptions } from "../../constants";
import pick from "../../shared/pick";
import sendResponse from "../../shared/sendResponse";

// ─── Get All Upazilas ─────────────────────────────────────────────────────────
const getAllUpazilas = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const filters = pick(req.query, upazilaFilterableFields);
    const options = pick(req.query, paginationOptions);
    const result = await UpazilaService.getAllUpazilas(filters, options);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Upazilas retrieved successfully!",
      meta: result.meta,
      data: result.data,
    });
  },
);

// ─── Get Upazila By ID ────────────────────────────────────────────────────────
const getUpazilaById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await UpazilaService.getUpazilaById(Number(id));
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Upazila retrieved successfully!",
      data: result,
    });
  },
);

// ─── Get Post Offices By Upazila ──────────────────────────────────────────────
const getPostOfficesByUpazila = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const options = pick(req.query, paginationOptions);
    const result = await UpazilaService.getPostOfficesByUpazila(
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

// ─── Get GeoJSON By Upazila ───────────────────────────────────────────────────
const getUpazilaGeoJSON = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await UpazilaService.getUpazilaGeoJSON(Number(id));
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Upazila GeoJSON retrieved successfully!",
      data: result,
    });
  },
);

export const UpazilaController = {
  getAllUpazilas,
  getUpazilaById,
  getPostOfficesByUpazila,
  getUpazilaGeoJSON,
};
