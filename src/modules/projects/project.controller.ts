import { Request, Response } from "express";
import { asyncHandler } from "../../lib/asyncHandler";
import { sendCreated, sendOk } from "../../lib/http";
import { projectService } from "./project.service";

export const projectController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const projects = projectService.list(req.query);
    sendOk(res, projects, { count: projects.length });
  }),

  get: asyncHandler(async (req: Request, res: Response) => {
    sendOk(res, projectService.get(req.params.id));
  }),

  tasks: asyncHandler(async (req: Request, res: Response) => {
    const tasks = projectService.tasksOf(req.params.id);
    sendOk(res, tasks, { count: tasks.length });
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    sendCreated(res, projectService.create(req.body));
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    sendOk(res, projectService.update(req.params.id, req.body));
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    projectService.remove(req.params.id);
    res.status(204).send();
  }),
};
