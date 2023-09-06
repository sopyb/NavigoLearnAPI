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
  const { searchParam, pageParam, limitParam, topicParam, orderParam } =
    req.query;
  const search = (searchParam as string) || '';
  const page = parseInt((pageParam as string) || '1');
  const limit = parseInt((limitParam as string) || '12');
  let topic =
    (topicParam as RoadmapTopic[]) ||
    ([
      RoadmapTopic.PROGRAMMING,
      RoadmapTopic.MATH,
      RoadmapTopic.DESIGN,
      RoadmapTopic.OTHER,
    ] as RoadmapTopic[]);
  let order: Order;

  const [by, direction] = (orderParam as string).split(':');
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

  topic = topic.filter((t) => {
    return (
      t === RoadmapTopic.PROGRAMMING ||
      t === RoadmapTopic.MATH ||
      t === RoadmapTopic.DESIGN ||
      t === RoadmapTopic.OTHER
    );
  });

  req.search = search;
  req.page = page;
  req.limit = limit;
  req.topic = topic;
  req.order = order;

  next();
}
