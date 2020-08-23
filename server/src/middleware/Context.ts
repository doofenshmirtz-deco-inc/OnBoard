import { Request, Response } from "express";

export interface Payload {
  uid: string;
}

export interface Context {
  req: Request;
  res: Response;
  payload?: Payload;
}
