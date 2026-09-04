import { Router } from "express";
import { validate } from "../../middleware/validate";
import { taskController } from "./task.controller";
import {
  createTaskSchema,
  listTasksSchema,
  taskIdSchema,
  updateTaskSchema,
  updateTaskStatusSchema,
} from "./task.schema";

const router = Router();

router.get("/", validate(listTasksSchema), taskController.list);
router.post("/", validate(createTaskSchema), taskController.create);
router.get("/:id", validate(taskIdSchema), taskController.get);
router.put("/:id", validate(updateTaskSchema), taskController.update);
// Dedicated status-management endpoint (todo / in-progress / done).
router.patch("/:id/status", validate(updateTaskStatusSchema), taskController.updateStatus);
router.delete("/:id", validate(taskIdSchema), taskController.remove);

export default router;
