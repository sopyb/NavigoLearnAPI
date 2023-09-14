import Database, { DatabaseConfig } from '@src/util/Database/DatabaseDriver';
import EnvVars from '@src/constants/EnvVars';
import {
  SearchParameters,
} from '@src/middleware/validators/validateSearchParameters';
import { ResRoadmap } from '@src/types/response/ResRoadmap';

// database credentials
const { DBCred } = EnvVars;

export interface ResRoadmapExplore {
  result: ResRoadmap[];
  totalRoadmaps: bigint;
}

class ExploreDB extends Database {
  public constructor(config: DatabaseConfig = DBCred as DatabaseConfig) {
    super(config);
  }

  public async getRoadmaps(
    { search, page, limit, topic, order }: SearchParameters,
    userid?: bigint,
  ): Promise<ResRoadmapExplore> {
    if (typeof search != 'string' || !page || !limit || !topic || !order)
      return { result: [], totalRoadmaps: 0n };
    const query = `
        SELECT *
        FROM (SELECT r.id                     as id,
                     r.name                   AS name,
                     r.description            AS description,
                     r.topic                  AS topic,
                     r.isFeatured             AS isFeatured,
                     r.isPublic               AS isPublic,
                     r.isDraft                AS isDraft,
                     r.createdAt              AS createdAt,
                     r.updatedAt              AS updatedAt,
                     u.id                     AS userId,
                     u.avatar                 AS userAvatar,
                     u.name                   AS userName,
                     (SELECT COALESCE((
                        (SELECT SUM(rl.value)
                            FROM roadmapLikes rl
                        WHERE roadmapId = r.id
                     ), 0)) AS likeCount,
                     (SELECT COUNT(*)
                      FROM roadmapViews
                      WHERE roadmapId = r.id) AS viewCount,
                     ${
  !!userid
    ? `(SELECT COALESCE((SELECT value FROM roadmapLikes
                        WHERE roadmapId = r.id
                        AND userId = ?
  ), 0))
    `
    : '0'
}                        AS isLiked
              FROM roadmaps r
                       INNER JOIN users u ON r.userId = u.id
              WHERE (r.name LIKE ? OR r.description LIKE ?)
                AND r.topic IN (${
  Array.isArray(topic) ? topic.map(() => '?').join(', ') : '?'
})
                AND r.isPublic = 1
                AND r.isDraft = 0) as t
        ORDER BY t.isFeatured DESC, ${
  order.by === 't.likeCount'
    ? `CASE
    WHEN t.likeCount < 0 THEN 3
    WHEN t.likeCount = 0 THEN 2
    ELSE 1
  END,`
    : ''
} ${order.by} ${order.direction}
        LIMIT ?, ?;
    `;
    const query2 = `
        SELECT count(*) AS result,
               ${
  !!userid
    ? `(SELECT value FROM roadmapLikes
                        WHERE roadmapId = r.id
                        AND userId = ?
                        LIMIT 1
  )`
    : '0'
}        AS isLiked
        FROM roadmaps r
                 INNER JOIN users u ON r.userId = u.id
        WHERE (r.name LIKE ? OR r.description LIKE ?)
          AND r.topic IN (${
  Array.isArray(topic) ? topic.map(() => '?').join(', ') : '?'
})
          AND r.isPublic = 1
          AND r.isDraft = 0;
    `;
    const params = [];

    if (!!userid) {
      params.push(userid);
    }
    params.push(`%${search}%`);
    params.push(`%${search}%`);
    if (Array.isArray(topic)) topic.forEach((t) => params.push(t.toString()));
    else params.push(topic);
    params.push((page - 1) * limit);
    params.push(limit);

    const result = await this.getQuery(query, params);
    const result2 = await this.countQuery(query2, params.slice(0, -2));

    if (result === null) return { result: [], totalRoadmaps: 0n };
    return {
      result: result as unknown as ResRoadmap[],
      totalRoadmaps: result2,
    };
  }
}

export { ExploreDB };
