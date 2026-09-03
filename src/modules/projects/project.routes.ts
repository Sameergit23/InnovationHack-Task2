import { Router } from "express";
import { validate } from "../../middleware/validate";
import { projectController } from "./project.controller";
import {
  createProjectSchema,
  listProjectsSchema,
  projectIdSchema,
  updateProjectSchema,
} from "./project.schema";

const router = Router();

router.get("/", validate(listProjectsSchema), projectController.list);
router.post("/", validate(createProjectSchema), projectController.create);
router.get("/:id", validate(projectIdSchema), projectController.get);
router.get("/:id/tasks", validate(projectIdSchema), projectController.tasks);
router.put("/:id", validate(updateProjectSchema), projectController.update);
router.delete("/:id", validate(projectIdSchema), projectController.remove);

export default router;
