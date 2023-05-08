import Database from '@src/util/DatabaseDriver';
import * as console from "console";

class ExploreDB {
  public static async searchRoadmapsByLiked<T>(
    query: string,
    count = 9,
    page = 0,
    userId: number,
  ) {
    // add % to query
    query = `%${query}%`;
    const sql = `
        SELECT r.id           as id,
               r.name         as name,
               r.description  as description,
               COUNT(l.id)    as likes,
               u.name         as ownerName,
               r.ownerId      as ownerId,
               CASE
                   WHEN EXISTS
                     (SELECT *
                      FROM roadmapLikes
                      WHERE roadmapId = r.id AND userId = ${userId})
                   THEN 1
                   ELSE 0 END AS isLiked
        FROM roadmaps r
                 LEFT JOIN roadmapLikes l ON r.id = l.roadmapId
                 LEFT JOIN users u ON r.ownerId = u.id
        WHERE r.name LIKE ?
           OR r.description LIKE ?
        GROUP BY r.id
        ORDER BY likes DESC, r.id DESC
        LIMIT ? OFFSET ?`;

    const db = new Database();

    return await db._query(sql, [ query, query, count, page * count ]) as T[];
  }
}

export { ExploreDB };