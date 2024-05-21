import type { NextFunction, Request, Response } from "express";

export function GlobalErrorHandler(
  err: Error,
  req: Request,
  resp: Response,
  next: NextFunction
) {
  console.error(err.stack);
  resp.status(500).json({
    success: false,
    message: "server is unavailable",
  });
}
