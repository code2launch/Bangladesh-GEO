import { Router } from "express";
import { DivisionController } from "./division.controller";

const router = Router();

// GET /api/v1/divisions
router.get("/", DivisionController.getAllDivisions);

// GET /api/v1/divisions/:id
router.get("/:id", DivisionController.getDivisionById);

// GET /api/v1/divisions/:id/districts
router.get("/:id/districts", DivisionController.getDistrictsByDivision);

// GET /api/v1/divisions/:id/upazilas
router.get("/:id/upazilas", DivisionController.getUpazilasByDivision);

// GET /api/v1/divisions/:id/post-offices
router.get("/:id/post-offices", DivisionController.getPostOfficesByDivision);

// GET /api/v1/divisions/:id/geojson
router.get("/:id/geojson", DivisionController.getDivisionGeoJSON);

export const DivisionRoutes = router;
