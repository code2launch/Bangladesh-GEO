import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";
import { postOfficeFilterableFields } from "./postoffice.constant";
import pick from "../../shared/pick";
import { paginationOptions } from "../../constants";
import { PostOfficeService } from "./postoffice.service";
import sendResponse from "../../shared/sendResponse";

// ─── Get All Post Offices ─────────────────────────────────────────────────────
const getAllPostOffices = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const filters = pick(req.query, postOfficeFilterableFields);
    const options = pick(req.query, paginationOptions);
    const result = await PostOfficeService.getAllPostOffices(filters, options);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Post offices retrieved successfully!",
      meta: result.meta,
      data: result.data,
    });
  },
);

// ─── Get Post Office By ID ────────────────────────────────────────────────────
const getPostOfficeById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await PostOfficeService.getPostOfficeById(Number(id));
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Post office retrieved successfully!",
      data: result,
    });
  },
);

// ─── Get All Post Codes ───────────────────────────────────────────────────────
const getAllPostCodes = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await PostOfficeService.getAllPostCodes();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Post codes retrieved successfully!",
      data: result,
    });
  },
);

// ─── Get By Post Code ─────────────────────────────────────────────────────────
const getByPostCode = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { code } = req.params;
    const options = pick(req.query, paginationOptions);
    const result = await PostOfficeService.getByPostCode(code, options);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Post offices retrieved successfully!",
      meta: result.meta,
      data: result.data,
    });
  },
);

// ─── Get Post Code Location ───────────────────────────────────────────────────
const getPostCodeLocation = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { code } = req.params;
    const result = await PostOfficeService.getPostCodeLocation(code);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Post code location retrieved successfully!",
      data: result,
    });
  },
);

// ─── Locate By Coordinates ────────────────────────────────────────────────────
const locateByCoordinates = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const lat = parseFloat(req.query.lat as string);
    const lng = parseFloat(req.query.lng as string);
    const result = await PostOfficeService.locateByCoordinates(lat, lng);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Location retrieved successfully!",
      data: result,
    });
  },
);

// ─── Global Search ────────────────────────────────────────────────────────────
const globalSearch = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const q = req.query.q as string;
    const type = req.query.type as string | undefined;
    const result = await PostOfficeService.globalSearch(q, type);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Search results retrieved successfully!",
      data: result,
    });
  },
);

export const PostOfficeController = {
  getAllPostOffices,
  getPostOfficeById,
  getAllPostCodes,
  getByPostCode,
  getPostCodeLocation,
  locateByCoordinates,
  globalSearch,
};
