import type { NextFunction, Request, Response } from "express";
import { TypedError } from "near-api-js/lib/providers";

function handleTypedError(err: TypedError, resp: Response) {
  if (err.type === "AccountDoesNotExist") {
    console.error(err);
    resp
      .status(400)
      .json({ success: false, message: "Account doesn't exist." });
    return;
  }
  resp.status(500).json({
    success: false,
    message: "server is unavailable",
  });
}

export function GlobalErrorHandler(
  err: Error,
  req: Request,
  resp: Response,
  next: NextFunction
) {
  if (err instanceof TypedError) {
    handleTypedError(err, resp);
    return;
  }

  console.error(err.stack);
  resp.status(500).json({
    success: false,
    message: "server is unavailable",
  });
}
