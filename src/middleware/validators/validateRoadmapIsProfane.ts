import { RequestWithBody } from '@src/middleware/validators/validateBody';
import { NextFunction, Response } from 'express';
import { Base64Decode } from '@src/util/misc';
import { responseInvalidBody } from '@src/helpers/responses/generalResponses';
import {
  checkObjectProfanity, checkStringProfanity,
} from '@src/util/ProfanityFilter/ProfanityFilterUtil';

export function validateRoadmapTitle(
  req: RequestWithBody,
  res: Response,
  next: NextFunction,
): void {
  if (req.body.isProfane) return next();

  let { name } = req.body;

  if (!name) return responseInvalidBody(res, 'title is not defined');

  if (typeof name !== 'string')
    return responseInvalidBody(res, 'title is not a string');

  name = name.trim();

  if (name.length === 0)
    return responseInvalidBody(res, 'title is empty');

  // check if title is profane
  checkStringProfanity(name)
    ? req.body.isProfane = true
    : req.body.isProfane = false;

  next();
}

export function validateRoadmapDescription(
  req: RequestWithBody,
  res: Response,
  next: NextFunction,
): void {
  if (req.body.isProfane) return next();

  let { description } = req.body;

  if (!description)
    return responseInvalidBody(res, 'description is not defined');

  if (typeof description !== 'string')
    return responseInvalidBody(res, 'description is not a string');

  description = description.trim();

  // check if description is profane
  checkStringProfanity(description)
    ? req.body.isProfane = true
    : req.body.isProfane = false;

  next();
}

export function validateRoadmapIsProfane(
  req: RequestWithBody,
  res: Response,
  next: NextFunction,
): void {
  if (req.body.isProfane) return next();

  let { data } = req.body;

  if (typeof data !== 'string')
    return responseInvalidBody(res, 'data is not a string');

  data = data.trim();

  if (data.length === 0)
    return responseInvalidBody(res, 'data is empty');

  // decode data and parse it
  try {
    data = JSON.parse(Base64Decode(data)) as Record<string, unknown>;
  } catch (err) {
    if (err instanceof SyntaxError)
      return responseInvalidBody(res, 'data is not a valid JSON string');
    else return responseInvalidBody(res, 'data is not a valid JSON string');
  }

  // check if data is an object
  if (typeof data !== 'object' || data === null)
    return responseInvalidBody(res, 'encoded data is not an object');

  // check if data is an array
  if (Array.isArray(data))
    return responseInvalidBody(res, 'encoded data is an array');

  // check if data is empty
  if (Object.keys(data).length === 0)
    return responseInvalidBody(res, 'encoded data is an empty object');

  // check if data matches frontend schema
  if (
    !('rootNodesIds' in data) ||
    !('nodes' in data) ||
    !('connections' in data) ||
    !('chunks' in data) ||
    !('templates' in data)
  )
    return responseInvalidBody(res, 'encoded data does not match data schema');

  // check if data is profane
  checkObjectProfanity(data)
    ? req.body.isProfane = false
    : req.body.isProfane = false;

  next();
}