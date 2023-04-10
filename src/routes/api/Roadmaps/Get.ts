import { Router } from 'express';
import Paths from '@src/routes/constants/Paths';
import { RequestWithSession } from '@src/middleware/session';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import Database from '@src/util/DatabaseDriver';
import { Roadmap } from '@src/models/Roadmap';

const GetRouter = Router({ mergeParams: true });

GetRouter.get(Paths.Roadmaps.Get.Roadmap,
  async (req: RequestWithSession, res) => {
    //get data from body and session
    const id = req.params.roadmapId;

    if (!id) return res.sendStatus(HttpStatusCodes.BAD_REQUEST)
      .json({ error: 'Roadmap id is missing.' });

    // get database connection
    const db = new Database();

    // get roadmap from database
    const roadmap = await db.get<Roadmap>('roadmaps', BigInt(id));

    // check if roadmap is valid
    if (!roadmap) return res.sendStatus(HttpStatusCodes.NOT_FOUND)
      .json({ error: 'Roadmap does not exist.' });

    // return roadmap
    return res.status(HttpStatusCodes.OK).json({
      id: roadmap.id.toString(),
      name: roadmap.name,
      description: roadmap.description,
      ownerId: roadmap.ownerId.toString(),
      createdAt: roadmap.createdAt,
      updatedAt: roadmap.updatedAt,
      isPublic: roadmap.isPublic,
      data: roadmap.data,
    });
  });

export default GetRouter;