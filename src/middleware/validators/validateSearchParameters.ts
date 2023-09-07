import { RequestWithSession } from '@src/middleware/session';
import { NextFunction, Response } from 'express';
import { RoadmapTopic } from '@src/types/models/Roadmap';

interface Order {
  by: string;
  direction?: 'ASC' | 'DESC';
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

export default function (
  req: RequestWithSearchParameters,
  _: Response,
  next: NextFunction,
) {
  // get parameters from request
  const { query: searchParam, page: pageParam, limit: limitParam, topic: topicParam, order: orderParam } =
    req.query;
  const search = (searchParam as string) || '';
  const page = parseInt((pageParam as string) || '1');
  const limit = parseInt((limitParam as string) || '12');
  let topic =
    (topicParam as RoadmapTopic[]) ||
    ([
      RoadmapTopic.PROGRAMMING,
      RoadmapTopic.MATH,
      RoadmapTopic.PHYSICS,
      RoadmapTopic.BIOLOGY,
    ] as RoadmapTopic[]);
  let order: Order;

  const [by, direction] = (orderParam as string)?.split(':') || ['age', 'DESC'];
  switch (by) {
    case 'views':
      order = {
        by: 'views',
        direction: 'DESC',
      };
      break;

    case 'likes':
      order = {
        by: 'likes',
        direction: 'DESC',
      };
      break;

    case 'age':
    default:
      order = {
        by: 'r.createdAt',
        direction: 'DESC',
      };
      break;
  }

  if (direction.toLowerCase() === 'asc') {
    order.direction = 'ASC';
  }

  // make sure topic is valid
  if (Array.isArray(topic)) {
    topic = topic.filter((t) => {
      return (
        t === RoadmapTopic.PROGRAMMING ||
        t === RoadmapTopic.MATH ||
        t === RoadmapTopic.PHYSICS ||
        t === RoadmapTopic.BIOLOGY
      );
    });
  } else {
    if (
      topic !== RoadmapTopic.PROGRAMMING &&
      topic !== RoadmapTopic.MATH &&
      topic !== RoadmapTopic.PHYSICS &&
      topic !== RoadmapTopic.BIOLOGY
    ) topic = [
      RoadmapTopic.PROGRAMMING,
      RoadmapTopic.MATH,
      RoadmapTopic.PHYSICS,
      RoadmapTopic.BIOLOGY,
    ];
  }

  console.log("search parameters", search, page, limit, topic, order);

  req.search = search;
  req.page = page;
  req.limit = limit;
  req.topic = topic;
  req.order = order;

  next();
}
