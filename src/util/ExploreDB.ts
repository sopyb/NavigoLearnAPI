import Database, { DatabaseConfig } from '@src/util/DatabaseDriver';
import EnvVars from '@src/constants/EnvVars';
import {
  SearchParameters,
} from '@src/middleware/validators/validateSearchParameters';
import { RoadmapTopic } from '@src/types/models/Roadmap';

// database credentials
const { DBCred } = EnvVars;

export interface SearchRoadmap{
    id: bigint;
    name: string;
    description: string;
    topic: RoadmapTopic;
    isFeatured: boolean;
    isPublic: boolean;
    isDraft: boolean;
    userAvatar: string | null;
    userName: string;

    likeCount: number;
    viewCount: number;

    isLiked: number;
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
  }: SearchParameters, userid?: bigint): Promise<SearchRoadmap[]> {
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
    ` : '0'} AS isLiked
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
    return result as unknown as SearchRoadmap[];
  }
}

export { ExploreDB };