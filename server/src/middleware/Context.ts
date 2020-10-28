/**
 * Types for the context and payload object provided to inner server functions.
 */

import { Request, Response } from "express";

// context payload provided to internal functions.
export interface Payload {
  uid: string;
}

// context provided to internal functions, resolvers, etc.
export interface Context {
  req: Request;
  res: Response;
  connection: any;
  payload?: Payload;
}
