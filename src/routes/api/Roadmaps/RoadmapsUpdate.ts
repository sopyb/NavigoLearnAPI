import { Router } from 'express';
import Paths from '@src/routes/constants/Paths';
import {
  RequestWithSession,
  requireSessionMiddleware,
} from '@src/middleware/session';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import Database from '@src/util/DatabaseDriver';
import { Roadmap } from '@src/models/Roadmap';
import { Tag } from '@src/models/tags';
import User from '@src/models/User';

const RoadmapsUpdate = Router({ mergeParams: true });

RoadmapsUpdate.post('*', requireSessionMiddleware);

RoadmapsUpdate.post(Paths.Roadmaps.Update.Title,
  async (req: RequestWithSession, res) => {
    // get data from request
    const id = req.params.roadmapId;
    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
    const title = req.body?.title as string;

    if (!id) return res.status(HttpStatusCodes.BAD_REQUEST)
      .json({ error: 'Roadmap id is missing.' });
    if (!title) return res.status(HttpStatusCodes.BAD_REQUEST)
      .json({ error: 'Roadmap title is missing.' });

    // get database connection
    const db = new Database();

    // get roadmap from database
    const roadmap = await db.get<Roadmap>('roadmaps', BigInt(id));

    // check if the roadmap is valid
    if (!roadmap) return res.status(HttpStatusCodes.NOT_FOUND)
      .json({ error: 'Roadmap does not exist.' });

    // check if the user is the owner of the roadmap
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (roadmap.ownerId !== req.session?.userId)
      return res.status(HttpStatusCodes.FORBIDDEN)
        .json({ error: 'User is not the owner of the roadmap.' });

    // update roadmap
    roadmap.name = title;
    roadmap.updatedAt = new Date();
    const success = await db.update('roadmaps', roadmap.id, roadmap);

    if (!success) return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'Roadmap could not be updated.' });

    return res.status(HttpStatusCodes.OK)
      .json({ success: true });
  });

RoadmapsUpdate.post(Paths.Roadmaps.Update.Description,
  async (req: RequestWithSession, res) => {
    // get data from request
    const id = req.params.roadmapId;
    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
    const description = req.body?.description as string;

    if (!id) return res.status(HttpStatusCodes.BAD_REQUEST)
      .json({ error: 'Roadmap id is missing.' });
    if (!description) return res.status(HttpStatusCodes.BAD_REQUEST)
      .json({ error: 'Roadmap description is missing.' });

    // get database connection
    const db = new Database();

    // get roadmap from database
    const roadmap = await db.get<Roadmap>('roadmaps', BigInt(id));

    // check if the roadmap is valid
    if (!roadmap) return res.status(HttpStatusCodes.NOT_FOUND)
      .json({ error: 'Roadmap does not exist.' });

    // check if the user is the owner of the roadmap
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (roadmap.ownerId !== req.session?.userId)
      return res.status(HttpStatusCodes.FORBIDDEN)
        .json({ error: 'User is not the owner of the roadmap.' });

    // update roadmap
    roadmap.description = description;
    roadmap.updatedAt = new Date();
    const success = await db.update('roadmaps', roadmap.id, roadmap);

    if (!success) return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'Roadmap could not be updated.' });

    return res.status(HttpStatusCodes.OK)
      .json({ success: true });
  });

RoadmapsUpdate.post(Paths.Roadmaps.Update.Tags,
  async (req: RequestWithSession, res) => {
    // get data from request
    const id = req.params.roadmapId;
    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
    const tags: string[] = req?.body?.tags;

    if (!id) return res.status(HttpStatusCodes.BAD_REQUEST)
      .json({ error: 'Roadmap id is missing.' });
    if (!tags) return res.status(HttpStatusCodes.BAD_REQUEST)
      .json({ error: 'Roadmap tags are missing.' });

    // get database connection
    const db = new Database();

    // get roadmap from database
    const roadmap = await db.get<Roadmap>('roadmaps', BigInt(id));

    // check if the roadmap is valid
    if (!roadmap) return res.status(HttpStatusCodes.NOT_FOUND)
      .json({ error: 'Roadmap does not exist.' });

    // check if the user is the owner of the roadmap
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (roadmap.ownerId !== req.session?.userId)
      return res.status(HttpStatusCodes.FORBIDDEN)
        .json({ error: 'User is not the owner of the roadmap.' });

    // get all tags from database
    const allTags =
      await db.getAllWhere<Tag>('roadmapTags', 'roadmapId', roadmap.id);

    const success: boolean[] = [];

    if (allTags !== undefined && allTags.length > 0) {
      // filter out tags that are not in the request
      const tagsToDelete = allTags.filter((tag) => !tags.includes(tag.name));

      // delete tags that are not in the request
      for (const tag of tagsToDelete) {
        success.push(await db.delete('roadmapTags', tag.id));
      }

      // filter out tags that are already in the database
      const tagsNames = allTags.map(e => e.name);
      const tagsToCreate =
        tags.filter((tag) => !tagsNames.includes(tag));

      // create tags that are not in the database
      for (const tag of tagsToCreate) {
        success.push(await db.insert('roadmapTags', {
          tagName: tag,
          roadmapId: roadmap.id,
        }) >= 0);
      }
    } else {
      for (const tag of tags) {
        success.push(await db.insert('roadmapTags', {
          tagName: tag,
          roadmapId: roadmap.id,
        }) >= 0);
      }
    }
    roadmap.updatedAt = new Date();

    if (success.includes(false))
      return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Roadmap could not be updated.' });

    return res.status(HttpStatusCodes.OK)
      .json({ success: true });
  });

RoadmapsUpdate.post(Paths.Roadmaps.Update.Visibility,
  async (req: RequestWithSession, res) => {
    // get data from request
    const id = req.params.roadmapId;
    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
    const visibilityData = req.body?.visibility;
    let visibility: boolean;
    try {
      visibility = Boolean(visibilityData);
    } catch (e) {
      return res.status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'Roadmap visibility is invalid.' });
    }

    if (!id) return res.status(HttpStatusCodes.BAD_REQUEST)
      .json({ error: 'Roadmap id is missing.' });
    if (visibility === undefined) return res.status(HttpStatusCodes.BAD_REQUEST)
      .json({ error: 'Roadmap visibility is missing.' });

    // get database connection
    const db = new Database();

    // get roadmap from database
    const roadmap = await db.get<Roadmap>('roadmaps', BigInt(id));

    // check if the roadmap is valid
    if (!roadmap) return res.status(HttpStatusCodes.NOT_FOUND)
      .json({ error: 'Roadmap does not exist.' });

    // check if the user is the owner of the roadmap
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (roadmap.ownerId !== req.session?.userId)
      return res.status(HttpStatusCodes.FORBIDDEN)
        .json({ error: 'User is not the owner of the roadmap.' });

    // update roadmap
    roadmap.isPublic = visibility;
    roadmap.updatedAt = new Date();
    const success = await db.update('roadmaps', roadmap.id, roadmap);

    if (!success) return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'Roadmap could not be updated.' });

    return res.status(HttpStatusCodes.OK)
      .json({ success: true });
  });

RoadmapsUpdate.post(Paths.Roadmaps.Update.Owner,
  async (req: RequestWithSession, res) => {
    // get data from request
    const id = req.params.roadmapId;
    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-argument
    const newOwnerId = BigInt(req?.body?.newOwnerId || -1);

    if (!id) return res.status(HttpStatusCodes.BAD_REQUEST)
      .json({ error: 'Roadmap id is missing.' });
    if (newOwnerId < 0) return res.status(HttpStatusCodes.BAD_REQUEST)
      .json({ error: 'Roadmap new owner id is missing.' });

    // get database connection
    const db = new Database();

    // get roadmap from database
    const roadmap = await db.get<Roadmap>('roadmaps', BigInt(id));

    // check if the roadmap is valid
    if (!roadmap) return res.status(HttpStatusCodes.NOT_FOUND)
      .json({ error: 'Roadmap does not exist.' });

    // check if the user is the owner of the roadmap
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (roadmap.ownerId !== req.session?.userId)
      return res.status(HttpStatusCodes.FORBIDDEN)
        .json({ error: 'User is not the owner of the roadmap.' });

    // check if the new owner exists
    const newOwner = await db.get<User>('users', BigInt(newOwnerId));
    if (!newOwner) return res.status(HttpStatusCodes.NOT_FOUND)
      .json({ error: 'New owner does not exist.' });

    // update roadmap
    roadmap.ownerId = BigInt(newOwnerId);
    roadmap.updatedAt = new Date();
    const success = await db.update('roadmaps', roadmap.id, roadmap);

    if (!success) return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'Roadmap could not be updated.' });

    return res.status(HttpStatusCodes.OK)
      .json({ success: true });
  });

RoadmapsUpdate.post(Paths.Roadmaps.Update.Data,
  async (req: RequestWithSession, res) => {
    // get data from request
    const id = req.params.roadmapId;
    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
    const data = req.body?.data as string;

    if (!id) return res.status(HttpStatusCodes.BAD_REQUEST)
      .json({ error: 'Roadmap id is missing.' });
    if (!data) return res.status(HttpStatusCodes.BAD_REQUEST)
      .json({ error: 'Roadmap data is missing.' });

    // get database connection
    const db = new Database();

    // get roadmap from database
    const roadmap = await db.get<Roadmap>('roadmaps', BigInt(id));

    // check if the roadmap is valid
    if (!roadmap) return res.status(HttpStatusCodes.NOT_FOUND)
      .json({ error: 'Roadmap does not exist.' });

    // check if the user is the owner of the roadmap
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (roadmap.ownerId !== req.session?.userId)
      return res.status(HttpStatusCodes.FORBIDDEN)
        .json({ error: 'User is not the owner of the roadmap.' });

    // update roadmap
    roadmap.data = data;
    roadmap.updatedAt = new Date();
    const success = await db.update('roadmaps', roadmap.id, roadmap);

    if (!success) return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'Roadmap could not be updated.' });

    return res.status(HttpStatusCodes.OK)
      .json({ success: true });
  });

export default RoadmapsUpdate;