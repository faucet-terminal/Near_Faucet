import type { NextFunction, Request, Response } from "express";
import { TypedError } from "near-api-js/lib/providers";
import ErrorMessage from "./error-messages.json";

function handleTypedError(err: TypedError, resp: Response) {
  console.error(err.type, err.message);
  if (err.type in ErrorMessage) {
    // @ts-ignore: TS7053
    resp.status(400).json({ success: false, message: ErrorMessage[err.type] });
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
