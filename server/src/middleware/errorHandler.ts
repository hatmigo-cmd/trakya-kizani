import { Request, Response, NextFunction } from "express";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  console.error("[trakya-kizani-server] Hata:", err);
  const message = err instanceof Error ? err.message : "Beklenmeyen bir hata oluştu.";
  res.status(500).json({ error: message });
}
