import DatabaseDriver, {
  ResultSetHeader,
} from '@src/util/Database/DatabaseDriver';
import { RoadmapView } from '@src/types/models/RoadmapView';

export async function addRoadmapView(
  db: DatabaseDriver,
  roadmapId: bigint,
  userId?: bigint,
): Promise<boolean> {
  if (!userId) userId = -1n;
  return (
    (await db.insert(
      'roadmapViews',
      new RoadmapView({
        userId,
        roadmapId,
        full: true,
      }),
    )) >= 0
  );
}

export async function addRoadmapImpression(
  db: DatabaseDriver,
  roadmapId: bigint[],
  userId?: bigint,
): Promise<boolean> {
  if (!userId) userId = -1n;
  const values = roadmapId.map((id) => `(${id}, ${userId}, 0)`).join(', ');
  return (
    (
      (await db._query(`
      INSERT INTO roadmapViews (roadmapId, userId, full)
      VALUES ${values}
  `)) as ResultSetHeader
    ).affectedRows >= 0
  );
}
