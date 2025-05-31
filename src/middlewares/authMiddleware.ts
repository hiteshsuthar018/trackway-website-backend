import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../config";
//extend the Request object of express
declare global {
  namespace Express {
    interface Request {
      userId: string
    }
  }
}
export function authenticate(req:Request , res:Response , next:NextFunction){
        const token = req.headers['authorization'] ?? "";
        const decoded = jwt.verify(token ,(JWT_SECRET as string));
        if(typeof(decoded) == "string") return;
        
        if(decoded){ 
            req.userId = decoded.id;
            next();
        }
        else{
            res.status(403).json({
                message:"unauthorized"
            })
        }
} 