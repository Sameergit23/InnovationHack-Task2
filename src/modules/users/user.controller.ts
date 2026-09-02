import { Request, Response } from "express";
import { asyncHandler } from "../../lib/asyncHandler";
import { sendCreated, sendOk } from "../../lib/http";
import { userService } from "./user.service";

export const userController = {
  list: asyncHandler(async (_req: Request, res: Response) => {
    const users = userService.list();
    sendOk(res, users, { count: users.length });
  }),

  get: asyncHandler(async (req: Request, res: Response) => {
    sendOk(res, userService.get(req.params.id));
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    sendCreated(res, userService.create(req.body));
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    sendOk(res, userService.update(req.params.id, req.body));
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    userService.remove(req.params.id);
    res.status(204).send();
  }),
};
