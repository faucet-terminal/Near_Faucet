import type { Application, NextFunction, Request, Response } from "express";

export default function ErrorHandlers(app: Application){
    app.use((err: Error, req: Request, resp: Response, next: NextFunction)=>{
        console.error(err.stack);
        resp.status(500).json(
            {
                message: "server is unavailable",
                code: "500"
            }
        )
    })
}