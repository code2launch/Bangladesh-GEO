import { Router } from "express";
import { PostOfficeController } from "./postoffice.controller";

const router = Router();

// ── Post Office routes ────────────────────────────────────────────────────────

// GET /api/v1/post-offices
router.get("/", PostOfficeController.getAllPostOffices);

// GET /api/v1/post-offices/:id
router.get("/:id", PostOfficeController.getPostOfficeById);

export const PostOfficeRoutes = router;

// ── Post Code routes (export separately — mount at /post-codes) ───────────────

const postCodeRouter = Router();

// GET /api/v1/post-codes
postCodeRouter.get("/", PostOfficeController.getAllPostCodes);

// GET /api/v1/post-codes/:code
postCodeRouter.get("/:code", PostOfficeController.getByPostCode);

// GET /api/v1/post-codes/:code/location
postCodeRouter.get("/:code/location", PostOfficeController.getPostCodeLocation);

export const PostCodeRoutes = postCodeRouter;

// ── Geo/Utility routes (export separately — mount at /geo) ────────────────────

const geoRouter = Router();

// GET /api/v1/geo/locate?lat=23.81&lng=90.41
geoRouter.get("/locate", PostOfficeController.locateByCoordinates);

// GET /api/v1/geo/search?q=Dhaka&type=district
geoRouter.get("/search", PostOfficeController.globalSearch);

export const GeoRoutes = geoRouter;
