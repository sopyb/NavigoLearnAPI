import DatabaseDriver from '@src/util/Database/DatabaseDriver';
import { IRoadmap } from '@src/types/models/Roadmap';

export const up = async () => {
  const database = new DatabaseDriver();

  const roadmaps = await database.getAllUnsafe<IRoadmap>('roadmaps');

  if (!roadmaps) {
    return;
  }

  // loop through each roadmap
  for (const roadmap of roadmaps) {
    // get the roadmap's data
    let { data, miscData } = roadmap;

    // convert data from base64 to JSON
    data = Buffer.from(data, 'base64').toString('utf-8');
    miscData = Buffer.from(miscData, 'base64').toString('utf-8');

    // update the roadmap's data
    await database.updateUnsafe('roadmaps', roadmap.id, { data, miscData });
  }
};
export const down = async () => {
  const database = new DatabaseDriver();

  const roadmaps = await database.getAll<IRoadmap>('roadmaps');

  if (!roadmaps) {
    return;
  }

  // loop through each roadmap
  for (const roadmap of roadmaps) {
    // get the roadmap's data
    let { data, miscData } = roadmap;

    // convert data from JSON to base64
    data = Buffer.from(JSON.stringify(data)).toString('base64');
    miscData = Buffer.from(JSON.stringify(miscData)).toString('base64');

    // update the roadmap's data
    await database.update('roadmaps', roadmap.id, { data, miscData });
  }
};
