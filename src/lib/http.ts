import { Response } from "express";

// Small helpers so every endpoint returns a consistent response envelope.
export function sendData(res: Response, statusCode: number, data: unknown, meta?: unknown) {
  return res.status(statusCode).json({ success: true, data, ...(meta ? { meta } : {}) });
}

export function sendCreated(res: Response, data: unknown) {
  return sendData(res, 201, data);
}

export function sendOk(res: Response, data: unknown, meta?: unknown) {
  return sendData(res, 200, data, meta);
}
