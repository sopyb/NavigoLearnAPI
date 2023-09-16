import Database, {DatabaseConfig} from '@src/util/Database/DatabaseDriver';
import EnvVars from '@src/constants/EnvVars';
import {
  SearchParameters,
} from '@src/middleware/validators/validateSearchParameters';
import {ResRoadmap} from '@src/types/response/ResRoadmap';
import {RoadmapTopic} from '@src/types/models/Roadmap';

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

  private static getIsLikedQuery(userid?: bigint): string {
    return !!userid
      ? `SELECT COALESCE((SELECT value
                          FROM roadmapLikes
                          WHERE roadmapId = r.id
                            AND userId = ?
                          LIMIT 1), 0)`
      : '0';
  }

  private static getTopicQuery(topic: string | string[]): string {
    if (Array.isArray(topic)) {
      return topic.map(() => '?').join(', ');
    }
    return '?';
  }

  private static getOrderByQuery(order: {
    by: string;
    direction: string;
  }): string {
    let query = '';
    if (order.by === 't.likeCount') {
      query = `CASE
                 WHEN t.likeCount < 0 THEN 1
                 WHEN t.likeCount = 0 THEN 2
                 ELSE 3
               END ${order.direction}, `;
    }

    return `${query}${order.by} ${order.direction}`;
  }

  private static buildQueryParams(
    userid: bigint | undefined,
    search: string,
    topic: RoadmapTopic | RoadmapTopic[],
    page: number,
    limit: number,
    isCountQuery = false,
  ): unknown[] {
    const params = [];

    if (!isCountQuery && userid) {
      params.push(userid);
    }

    params.push(`%${search}%`, `%${search}%`);

    if (Array.isArray(topic)) {
      params.push(...topic);
    } else {
      params.push(topic);
    }

    if (!isCountQuery) {
      params.push((page - 1) * limit, limit);
    }

    return params;
  }

  public async getRoadmaps(
    { search, page, limit, topic, order }: SearchParameters,
    userid?: bigint,
  ): Promise<ResRoadmapExplore> {
    if (typeof search != 'string' || !page || !limit || !topic || !order)
      return { result: [], totalRoadmaps: 0n };

    const isLikeQuery = ExploreDB.getIsLikedQuery(userid);
    const topicQuery = ExploreDB.getTopicQuery(topic);
    const orderQuery = ExploreDB.getOrderByQuery(order);

    const query = `
      SELECT *
      FROM (SELECT r.id                                          as id,
                   r.name                                        AS name,
                   r.description                                 AS description,
                   r.topic                                       AS topic,
                   r.isFeatured                                  AS isFeatured,
                   r.isPublic                                    AS isPublic,
                   r.isDraft                                     AS isDraft,
                   r.createdAt                                   AS createdAt,
                   r.updatedAt                                   AS updatedAt,
                   u.id                                          AS userId,
                   u.avatar                                      AS userAvatar,
                   u.name                                        AS userName,
                   (SELECT COALESCE(
                                   (SELECT SUM(rl.value)
                                    FROM roadmapLikes rl
                                    WHERE roadmapId = r.id), 0)) AS likeCount,
                   (SELECT COUNT(*)
                    FROM roadmapViews
                    WHERE roadmapId = r.id
                      AND full     = 1)                         AS viewCount,
                   ( ${isLikeQuery} )                            AS isLiked
            FROM roadmaps r
                     INNER JOIN users u ON r.userId = u.id
            WHERE ( r.name LIKE ?
                OR r.description LIKE ? )
              AND r.topic IN ( ${topicQuery} )
              AND r.isPublic = 1
              AND r.isDraft = 0) as t
      ORDER BY ${orderQuery}
      LIMIT ?, ?;
    `;
    const countQuery = `
      SELECT count(*) AS result
      FROM roadmaps r
               INNER JOIN users u ON r.userId = u.id
      WHERE ( r.name LIKE ? OR r.description LIKE ? )
        AND r.topic IN ( ${topicQuery} )
        AND r.isPublic = 1
        AND r.isDraft = 0;
    `;

    const params = ExploreDB.buildQueryParams(
      userid,
      search,
      topic,
      page,
      limit,
    );

    const countParams = ExploreDB.buildQueryParams(
      userid,
      search,
      topic,
      page,
      limit,
      true,
    );

    const result = await this.getQuery(query, params);
    const count = await this.countQuery(countQuery, countParams);

    if (result === null) return { result: [], totalRoadmaps: 0n };
    return {
      result: result as unknown as ResRoadmap[],
      totalRoadmaps: count,
    };
  }

  public async getRandomRoadmapId(): Promise<bigint | null> {
    const query = `
        SELECT id
        FROM roadmaps
        WHERE isPublic = 1
          AND isDraft = 0
        ORDER BY RAND()
        LIMIT 1
    `;

    const result = await this.getQuery(query);

    if (result === null) return null;
    if (result.length === 0) return null;
    if (result[0].id === null) return null;

    return result[0].id as bigint;
  }
}

export { ExploreDB };
