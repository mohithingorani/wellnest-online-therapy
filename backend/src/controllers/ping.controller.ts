import type { Request, Response } from "express";

export async function ping(req:Request,res:Response) {
    return res.json({
        message:"Working"
    }).status(200);
}