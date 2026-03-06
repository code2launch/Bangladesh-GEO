import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { DivisionService } from "./division.service";
import catchAsync from "../../shared/catchAsync";
import pick from "../../shared/pick";
import { divisionFilterableFields } from "./division.constant";
import sendResponse from "../../shared/sendResponse";
import { paginationOptions } from "../../constants";

// ─── Get All Divisions ────────────────────────────────────────────────────────
const getAllDivisions = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const filters = pick(req.query, divisionFilterableFields);
    const options = pick(req.query, paginationOptions);
    const result = await DivisionService.getAllDivisions(filters, options);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Divisions retrieved successfully!",
      meta: result.meta,
      data: result.data,
    });
  },
);

// ─── Get Division By ID ───────────────────────────────────────────────────────
const getDivisionById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await DivisionService.getDivisionById(Number(id));
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Division retrieved successfully!",
      data: result,
    });
  },
);

// ─── Get Districts By Division ────────────────────────────────────────────────
const getDistrictsByDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const options = pick(req.query, paginationOptions);
    const result = await DivisionService.getDistrictsByDivision(
      Number(id),
      options,
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Districts retrieved successfully!",
      meta: result.meta,
      data: result.data,
    });
  },
);

// ─── Get Upazilas By Division ─────────────────────────────────────────────────
const getUpazilasByDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const options = pick(req.query, paginationOptions);
    const result = await DivisionService.getUpazilasByDivision(
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

// ─── Get Post Offices By Division ─────────────────────────────────────────────
const getPostOfficesByDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const options = pick(req.query, paginationOptions);
    const result = await DivisionService.getPostOfficesByDivision(
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

// ─── Get GeoJSON By Division ──────────────────────────────────────────────────
const getDivisionGeoJSON = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await DivisionService.getDivisionGeoJSON(Number(id));
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Division GeoJSON retrieved successfully!",
      data: result,
    });
  },
);

export const DivisionController = {
  getAllDivisions,
  getDivisionById,
  getDistrictsByDivision,
  getUpazilasByDivision,
  getPostOfficesByDivision,
  getDivisionGeoJSON,
};
