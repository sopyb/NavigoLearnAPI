import { Response, Router } from 'express';
import Paths from '@src/constants/Paths';
import { RequestWithSession } from '@src/middleware/session';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import Database from '@src/util/DatabaseDriver';
import { Roadmap } from '@src/models/Roadmap';
import { User } from '@src/models/User';
import validateSession from '@src/validators/validateSession';

const RoadmapsUpdate = Router({ mergeParams: true });

async function isRoadmapValid(
  req: RequestWithSession,
  res: Response,
): Promise<
  | {
      id: bigint;
      roadmap: Roadmap;
    }
  | undefined
> {
  // get data from request
  const id = req?.params?.roadmapId;

  if (!id) {
    res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json({ error: 'Roadmap id is missing.' });
  }

  const db = new Database();

  // get roadmap from database
  const roadmap = await db.get<Roadmap>('roadmaps', BigInt(id));

  // check if the roadmap is valid
  if (!roadmap) {
    res
      .status(HttpStatusCodes.NOT_FOUND)
      .json({ error: 'Roadmap does not exist.' });
    return;
  }

  // check if the user is the owner of the roadmap
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (roadmap.ownerId !== req.session?.userId) {
    res
      .status(HttpStatusCodes.FORBIDDEN)
      .json({ error: 'User is not the owner of the roadmap.' });

    return;
  }

  return { id: BigInt(id), roadmap };
}

RoadmapsUpdate.post('*', validateSession);

RoadmapsUpdate.post(
  Paths.Roadmaps.Update.Title,
  async (req: RequestWithSession, res) => {
    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
    const title = req.body?.title as string;
    if (!title)
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'Roadmap title is missing.' });

    // check if the roadmap is valid
    const data = await isRoadmapValid(req, res);
    if (!data) return;
    const { roadmap } = data;

    // get database connection
    const db = new Database();

    // update roadmap
    roadmap.set({
      name: title,
      updatedAt: new Date(),
    });
    const success = await db.update('roadmaps', roadmap.id, roadmap);

    if (!success)
      return res
        .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Roadmap could not be updated.' });

    return res.status(HttpStatusCodes.OK).json({ success: true });
  },
);

RoadmapsUpdate.post(
  Paths.Roadmaps.Update.Description,
  async (req: RequestWithSession, res) => {
    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
    const description = req.body?.description as string;
    if (!description)
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'Roadmap description is missing.' });

    // check if the roadmap is valid
    const data = await isRoadmapValid(req, res);
    if (!data) return;
    const { roadmap } = data;

    // get database connection
    const db = new Database();

    // update roadmap
    roadmap.set({
      description,
      updatedAt: new Date(),
    });
    const success = await db.update('roadmaps', roadmap.id, roadmap);

    if (!success)
      return res
        .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Roadmap could not be updated.' });

    return res.status(HttpStatusCodes.OK).json({ success: true });
  },
);

RoadmapsUpdate.post(
  Paths.Roadmaps.Update.Visibility,
  async (req: RequestWithSession, res) => {
    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
    const visibilityData = req.body?.visibility;
    let visibility: boolean;
    try {
      visibility = Boolean(visibilityData);
    } catch (e) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'Roadmap visibility is invalid.' });
    }

    if (visibility === undefined)
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'Roadmap visibility is missing.' });

    // check if the roadmap is valid
    const data = await isRoadmapValid(req, res);
    if (!data) return;
    const { roadmap } = data;

    // get database connection
    const db = new Database();

    // update roadmap
    roadmap.set({
      isPublic: visibility,
      updatedAt: new Date(),
    });
    const success = await db.update('roadmaps', roadmap.id, roadmap);

    if (!success)
      return res
        .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Roadmap could not be updated.' });

    return res.status(HttpStatusCodes.OK).json({ success: true });
  },
);

RoadmapsUpdate.post(
  Paths.Roadmaps.Update.Owner,
  async (req: RequestWithSession, res) => {
    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-argument
    const newOwnerId = BigInt(req?.body?.newOwnerId || -1);
    if (newOwnerId < 0)
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'Roadmap new owner id is missing.' });

    // check if the roadmap is valid
    const data = await isRoadmapValid(req, res);
    if (!data) return;
    const { roadmap } = data;

    // get database connection
    const db = new Database();

    // check if the new owner exists
    const newOwner = await db.get<User>('users', BigInt(newOwnerId));
    if (!newOwner)
      return res
        .status(HttpStatusCodes.NOT_FOUND)
        .json({ error: 'New owner does not exist.' });

    // update roadmap
    roadmap.set({
      userId: newOwnerId,
      updatedAt: new Date(),
    });
    const success = await db.update('roadmaps', roadmap.id, roadmap);

    if (!success)
      return res
        .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Roadmap could not be updated.' });

    return res.status(HttpStatusCodes.OK).json({ success: true });
  },
);

RoadmapsUpdate.post(
  Paths.Roadmaps.Update.Data,
  async (req: RequestWithSession, res) => {
    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
    const data = req.body?.data as string;

    if (!data)
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'Roadmap data is missing.' });

    // check if the roadmap is valid
    const dataP = await isRoadmapValid(req, res);
    if (!dataP) return;
    const { roadmap } = dataP;

    // get database connection
    const db = new Database();

    // update roadmap
    roadmap.set({
      data,
      updatedAt: new Date(),
    });
    const success = await db.update('roadmaps', roadmap.id, roadmap);

    if (!success)
      return res
        .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Roadmap could not be updated.' });

    return res.status(HttpStatusCodes.OK).json({ success: true });
  },
);

export default RoadmapsUpdate;
