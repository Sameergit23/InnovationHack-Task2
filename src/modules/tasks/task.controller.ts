import { Request, Response } from "express";
import { asyncHandler } from "../../lib/asyncHandler";
import { sendCreated, sendOk } from "../../lib/http";
import { taskService } from "./task.service";

export const taskController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const tasks = taskService.list(req.query);
    sendOk(res, tasks, { count: tasks.length });
  }),

  get: asyncHandler(async (req: Request, res: Response) => {
    sendOk(res, taskService.get(req.params.id));
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    sendCreated(res, taskService.create(req.body));
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    sendOk(res, taskService.update(req.params.id, req.body));
  }),

  updateStatus: asyncHandler(async (req: Request, res: Response) => {
    sendOk(res, taskService.updateStatus(req.params.id, req.body.status));
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    taskService.remove(req.params.id);
    res.status(204).send();
  }),
};
