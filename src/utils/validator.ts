import Joi from "joi";
import { Request, Response, NextFunction } from "express";

export enum ValidationSource {
  BODY = "body",
  HEADER = "headers",
  QUERY = "query",
  PARAM = "params",
}

export const validator =
  (
    schema: Joi.ObjectSchema,
    source: ValidationSource = ValidationSource.BODY
  ) =>
  (req: Request, _res: Response, next: NextFunction) => {
    try {
      const { error } = schema.validate(req[source]);

      if (!error) return next();

      const { details } = error;
      const message = details
        .map((i) => i.message.replace(/['"]+/g, ""))
        .join(",");
      console.error(`${req.method} ${req.baseUrl}${req.url} => ${message}`);

      next(new Error(message));
    } catch (error) {
      next(error);
    }
  };
