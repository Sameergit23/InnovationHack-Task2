import { Router } from "express";
import { validate } from "../../middleware/validate";
import { userController } from "./user.controller";
import { createUserSchema, updateUserSchema, userIdSchema } from "./user.schema";

const router = Router();

router.get("/", userController.list);
router.post("/", validate(createUserSchema), userController.create);
router.get("/:id", validate(userIdSchema), userController.get);
router.put("/:id", validate(updateUserSchema), userController.update);
router.delete("/:id", validate(userIdSchema), userController.remove);

export default router;
