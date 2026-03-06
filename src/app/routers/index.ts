import { Router } from "express";
import { DivisionRoutes } from "../modules/Division/division.route";
import { DistrictRoutes } from "../modules/District/district.route";
import { UpazilaRoutes } from "../modules/Upazila/upazila.route";
import {
  GeoRoutes,
  PostCodeRoutes,
  PostOfficeRoutes,
} from "../modules/Postoffice/postoffice.route";

const router = Router();
const moduleRouters = [
  {
    path: "/divisions",
    route: DivisionRoutes,
  },
  {
    path: "/districts",
    route: DistrictRoutes,
  },
  {
    path: "/upazilas",
    route: UpazilaRoutes,
  },
  {
    path: "/post-offices",
    route: PostOfficeRoutes,
  },
  {
    path: "/post-codes",
    route: PostCodeRoutes,
  },
  {
    path: "/geo",
    route: GeoRoutes,
  },
];

moduleRouters.forEach((route) => router.use(route.path, route.route));
export default router;
