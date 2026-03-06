import { Router } from "express";
import { UpazilaController } from "./upazila.controller";

const router = Router();

// GET /api/v1/upazilas
router.get("/", UpazilaController.getAllUpazilas);

// GET /api/v1/upazilas/:id
router.get("/:id", UpazilaController.getUpazilaById);

// GET /api/v1/upazilas/:id/post-offices
router.get("/:id/post-offices", UpazilaController.getPostOfficesByUpazila);

// GET /api/v1/upazilas/:id/geojson
router.get("/:id/geojson", UpazilaController.getUpazilaGeoJSON);

export const UpazilaRoutes = router;
