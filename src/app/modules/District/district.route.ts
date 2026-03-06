import { Router } from "express";
import { DistrictController } from "./district.controller";

const router = Router();

// GET /api/v1/districts
router.get("/", DistrictController.getAllDistricts);

// GET /api/v1/districts/:id
router.get("/:id", DistrictController.getDistrictById);

// GET /api/v1/districts/:id/upazilas
router.get("/:id/upazilas", DistrictController.getUpazilasByDistrict);

// GET /api/v1/districts/:id/post-offices
router.get("/:id/post-offices", DistrictController.getPostOfficesByDistrict);

// GET /api/v1/districts/:id/geojson
router.get("/:id/geojson", DistrictController.getDistrictGeoJSON);

export const DistrictRoutes = router;
