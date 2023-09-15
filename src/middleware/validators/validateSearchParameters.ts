import { RequestWithSession } from '@src/middleware/session';
import { NextFunction, Response } from 'express';
import { RoadmapTopic } from '@src/types/models/Roadmap';

interface Order {
  by: string;
  direction: 'ASC' | 'DESC';
}

export interface SearchParameters {
  search?: string;
  page?: number;
  limit?: number;
  topic?: RoadmapTopic[];
  order?: Order;
}

export interface RequestWithSearchParameters
  extends RequestWithSession,
    SearchParameters {}

function isValidTopic(topic: string): boolean {
  return [
    RoadmapTopic.PROGRAMMING,
    RoadmapTopic.MATH,
    RoadmapTopic.PHYSICS,
    RoadmapTopic.BIOLOGY,
  ].includes(topic as RoadmapTopic);
}

function getDefaultTopics(): RoadmapTopic[] {
  return [
    RoadmapTopic.PROGRAMMING,
    RoadmapTopic.MATH,
    RoadmapTopic.PHYSICS,
    RoadmapTopic.BIOLOGY,
  ];
}

function parseTopics(topicParam: string | string[]): RoadmapTopic[] {
  if (Array.isArray(topicParam)) {
    const result = topicParam.filter(isValidTopic);

    if (result.length === 0)
      return getDefaultTopics();
    else return result as RoadmapTopic[];
  } else {
    const topic = topicParam as RoadmapTopic;
    if (isValidTopic(topic)) {
      return [topic];
    } else {
      return getDefaultTopics();
    }
  }
}

function getOrder(orderParam: string): Order {
  const [by, direction] = orderParam?.split(':') || ['new', 'DESC'];
  let order: Order;
  switch (by?.toLowerCase()) {
    case 'views':
      order = { by: 't.viewCount', direction: 'DESC' };
      break;
    case 'likes':
      order = { by: 't.likeCount', direction: 'DESC' };
      break;
    case 'new':
    default:
      order = { by: 't.createdAt', direction: 'DESC' };
  }

  if (direction?.toLowerCase() === 'asc') {
    order.direction = 'ASC';
  }
  return order;
}
export default function (
  req: RequestWithSearchParameters,
  _: Response,
  next: NextFunction,
) {
  // get parameters from request
  const {
    query: search = '',
    page: pageParam = '1',
    limit: limitParam = '12',
    sortBy: orderParam,
    topic: topicParam = getDefaultTopics(),
  } = req.query;

  // parse parameters
  const page = parseInt(pageParam as string, 10) || 1;
  const limit = parseInt(limitParam as string, 10) || 12;
  const topic = parseTopics(topicParam as string | string[]);
  const order = getOrder(orderParam as string);

  // add parameters to request
  req.search = search as string;
  req.page = page;
  req.limit = limit;
  req.topic = topic;
  req.order = order;

  next();
}
