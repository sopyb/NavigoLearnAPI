import { Response, Router } from 'express';
import Paths from '@src/routes/constants/Paths';
import { RequestWithSession } from '@src/middleware/session';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import Database from '@src/util/DatabaseDriver';
import { Roadmap } from '@src/models/Roadmap';
import axios from 'axios';
import EnvVars from '@src/constants/EnvVars';
import logger from 'jet-logger';
import { Tag } from '@src/models/Tags';

const RoadmapsGet = Router({ mergeParams: true });

async function checkIfRoadmapExists(req: RequestWithSession, res: Response):
  Promise<{
    id: bigint,
    roadmap: Roadmap,
    issueCount: bigint
  } | undefined> {
  const id = req.params.roadmapId;

  if (!id) {
    res.status(HttpStatusCodes.BAD_REQUEST)
      .json({ error: 'Roadmap id is missing.' });
    return;
  }

  // get database connection
  const db = new Database();

  // get roadmap from database
  const roadmap = await db.get<Roadmap>('roadmaps', BigInt(id));
  const issueCount = await db.countWhere('issues', 'roadmapId', id);

  // check if roadmap is valid
  if (!roadmap) {
    res.status(HttpStatusCodes.NOT_FOUND)
      .json({ error: 'Roadmap does not exist.' });

    return;
  }

  return { id: BigInt(id), roadmap, issueCount };
}

RoadmapsGet.get(Paths.Roadmaps.Get.Roadmap,
  async (req: RequestWithSession, res) => {
    //get data from params
    const data = await checkIfRoadmapExists(req, res);

    if (!data) return;

    const { roadmap, issueCount } = data;

    // return roadmap
    return res.status(HttpStatusCodes.OK).json({
      id: roadmap.id.toString(),
      name: roadmap.name,
      description: roadmap.description,
      ownerId: roadmap.ownerId.toString(),
      issueCount: issueCount.toString(),
      // TODO: star count
      // TODO: add progress info
      createdAt: roadmap.createdAt,
      updatedAt: roadmap.updatedAt,
      isPublic: roadmap.isPublic,
      data: roadmap.data,
    });
  });

RoadmapsGet.get(Paths.Roadmaps.Get.MiniRoadmap,
  async (req: RequestWithSession, res) => {
    // get id from params
    const data = await checkIfRoadmapExists(req, res);

    if (!data) return;

    const { roadmap, issueCount } = data;

    // return roadmap
    return res.status(HttpStatusCodes.OK).json({
      id: roadmap.id.toString(),
      name: roadmap.name,
      description: roadmap.description,
      issueCount: issueCount.toString(),
      ownerId: roadmap.ownerId.toString(),
    });
  });

RoadmapsGet.get(Paths.Roadmaps.Get.Tags,
  async (req: RequestWithSession, res) => {
    //get data from params
    const id = req.params.roadmapId;

    if (!id) return res.status(HttpStatusCodes.BAD_REQUEST)
      .json({ error: 'Roadmap id is missing.' });

    // get database connection
    const db = new Database();

    // check if roadmap exists
    const roadmap = await db.get<Roadmap>('roadmaps', BigInt(id));
    if (!roadmap) return res.status(HttpStatusCodes.NOT_FOUND).json({
      error: 'Roadmap does not exist.',
    });

    // get tags from database
    const tags = await db.getAllWhere<Tag>('roadmapTags', 'roadmapId', id);

    // check if there are any tags
    if (tags?.length === 0 || !tags) {
      // return empty array
      return res.status(HttpStatusCodes.OK).json({ tags: [] });
    }

    // map tags name to array
    const tagNames = tags.map(tag => tag.name);

    // return tags
    return res.status(HttpStatusCodes.OK).json({ tags: tagNames });
  });

RoadmapsGet.get(Paths.Roadmaps.Get.Owner,
  async (req: RequestWithSession, res) => {
    //get data from params
    const data = await checkIfRoadmapExists(req, res);

    if (!data) return;

    const { roadmap } = data;

    // fetch /api/users/:id
    axios.get(`http://localhost:${EnvVars.Port}/api/users/${roadmap.ownerId}`)
      .then(response => {
        res.status(response.status).json(response.data);
      })
      .catch(error => {
        logger.err(error);
        res.status(500).send('An error occurred');
      });
  });

RoadmapsGet.get(Paths.Roadmaps.Get.OwnerMini,
  async (req: RequestWithSession, res) => {
    //get data from params
    const data = await checkIfRoadmapExists(req, res);

    if (!data) return;

    const { roadmap } = data;

    // fetch /api-wrapper/users/:id
    const user =
      await axios.get(
        `http://localhost:${EnvVars.Port}/api/users/${roadmap.ownerId}/mini`);

    // ? might need to check if json needs to be parsed

    // return roadmap
    return res.status(user.status).json(user.data);
  });

export default RoadmapsGet;