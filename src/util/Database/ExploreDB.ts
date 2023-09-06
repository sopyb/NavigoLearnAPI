import Database, { DatabaseConfig } from '@src/util/Database/DatabaseDriver';
import EnvVars from '@src/constants/EnvVars';
import {
  SearchParameters,
} from '@src/middleware/validators/validateSearchParameters';
import { ResRoadmap } from '@src/types/response/ResRoadmap';

// database credentials
const { DBCred } = EnvVars;

export interface ResRoadmapExplore extends ResRoadmap {
  totalRoadmaps: bigint;
}

class ExploreDB extends Database {
  public constructor(config: DatabaseConfig = DBCred as DatabaseConfig) {
    super(config);
  }

  public async getRoadmaps({
    search,
    page,
    limit,
    topic,
    order,
  }: SearchParameters, userid?: bigint): Promise<ResRoadmapExplore[]> {
    if(!search || !page || !limit || !topic || !order) return [];
    const query = `
      SELECT
        r.id as id,
        r.name AS name,
        r.description AS description,
        r.topic AS topic,
        r.isFeatured AS isFeatured,
        r.isPublic AS isPublic,
        r.isDraft AS isDraft,
        u.id AS userId,
        u.avatar AS userAvatar,
        u.name AS userName,
        (SELECT COUNT(*) FROM roadmapLikes WHERE roadmapId = r.id) AS likeCount,
        (SELECT COUNT(*) FROM roadmapViews WHERE roadmapId = r.id) AS viewCount,
        u.avatar AS userAvatar,
        u.name AS userName,
        ${!!userid ? `(SELECT COUNT(*) FROM roadmapLikes;
                        WHERE roadmapId = r.id
                        AND userId = ?
  )
    ` : '0'} AS isLiked,

        (SELECT COUNT(*) FROM roadmaps) AS totalRoadmaps
      FROM
        roadmaps r
        INNER JOIN users u ON r.userId = u.id
      WHERE
        r.name LIKE ?
        AND r.topic IN (?)
        AND r.isPublic = 1
        AND r.isDraft = 0
      ORDER BY
        r.isFeatured DESC, ${order.by} ${order.direction}
      LIMIT ?, ?;
    `;

    const params = [];
    
    if (!!userid) {
      params.push(userid);
    }
    params.push(`%${search}%`);
    params.push(topic.map((t) => t.toString()).join(','));
    params.push((page - 1) * limit);
    params.push(limit);

    const result = await this.getQuery(query, params);
    if (result === null) return [];
    return result as unknown as ResRoadmapExplore[];
  }
}

export { ExploreDB };