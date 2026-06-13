import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { validationResult } from 'express-validator';
import { logger } from '../config/logger.js';

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: any) {
      const errors = error.errors?.map((e: any) => ({
        field: e.path.join('.'),
        message: e.message,
      }));
      res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Invalid input data', details: errors || error.message },
      });
    }
  };
};

export const requestValidator = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: errors.array(),
      },
    });
    return;
  }
  next();
};

// Sanitization middleware
export const sanitize = (req: Request, _res: Response, next: NextFunction): void => {
  if (req.body) {
    Object.keys(req.body).forEach((key) => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].trim();
      }
    });
  }
  next();
};
