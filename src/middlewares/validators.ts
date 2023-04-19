import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import Logger from '../core/Logger';
import { BadRequestError } from '../core/ApiError';
import mongoose from 'mongoose';

export const enum Header {
  API_KEY = 'x-api-key',
  AUTHORIZATION = 'authorization',
}

export enum ValidationSource {
  BODY = 'body',
  HEADER = 'headers',
  QUERY = 'query',
  PARAM = 'params',
}

export const JoiAuthBearer = () =>
  Joi.string().custom((value: string, helpers) => {
    if (!value.startsWith('Bearer ')) return helpers.error('any.invalid');
    if (!value.split(' ')[1]) return helpers.error('any.invalid');
    return value;
  }, 'Authorization Header Validation');

export const JoiObjectId = () =>
  Joi.string().custom((value: string, helpers) => {
    if (!mongoose.isValidObjectId(value)) return helpers.error('any.invalid');
    return value;
  }, 'Object Id Validation');

export default (
    schema: Joi.AnySchema,
    source: ValidationSource = ValidationSource.BODY,
  ) =>
  (req: Request, _: Response, next: NextFunction) => {
    try {
      const { error } = schema.validate(req[source]);

      if (!error) return next();

      const { details } = error;
      const message = details
        .map((i) => i.message.replace(/['"]+/g, ''))
        .join(',');
      Logger.error(message);

      next(new BadRequestError(message));
    } catch (error) {
      next(error);
    }
  };
