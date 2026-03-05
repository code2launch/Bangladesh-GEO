import { Router } from "express";
import { DivisionRoute } from "../modules/Division/division.route";

const router = Router();
const moduleRouters = [
  {
    path: "/division",
    route: DivisionRoute,
  },
];

moduleRouters.forEach((route) => router.use(route.path, route.route));
export default router;
