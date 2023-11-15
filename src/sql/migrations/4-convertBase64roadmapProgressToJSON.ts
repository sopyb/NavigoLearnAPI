import DatabaseDriver from '@src/util/Database/DatabaseDriver';
import { IRoadmap } from '@src/types/models/Roadmap';
import { IRoadmapProgress } from '@src/types/models/RoadmapProgress';

export const up = async () => {
  const database = new DatabaseDriver();

  const progresses =
    await database.getAllUnsafe<IRoadmapProgress>('roadmapProgress');

  if (!progresses) {
    return;
  }

  for (const progress of progresses) {
    const { id } = progress;
    let { data } = progress;

    // convert data from base64 to JSON
    data = Buffer.from(data, 'base64').toString('utf-8');

    await database.updateUnsafe('roadmapProgress', id, { data });
  }
};
export const down = async () => {
  const database = new DatabaseDriver();

  const progresses = await database.getAllUnsafe<IRoadmap>('roadmapProgress');

  if (!progresses) {
    return;
  }

  for (const progress of progresses) {
    const { id } = progress;
    let { data } = progress;

    // convert data from JSON to base64
    data = Buffer.from(data).toString('base64');

    await database.updateUnsafe('roadmapProgress', id, { data });
  }
};
