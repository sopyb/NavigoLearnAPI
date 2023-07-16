import { Router } from 'express';
import Paths from '@src/constants/Paths';
import { ExploreDB } from '@src/util/ExploreDB';
import { RoadmapMini } from '@src/models/Roadmap';
import Database from '@src/util/DatabaseDriver';
import { RequestWithSession } from '@src/middleware/session';
import { addView } from '@src/routes/roadmapsRoutes/RoadmapsGet';

const ExploreRouter = Router();

ExploreRouter.get(Paths.Explore.Default,
  async (req: RequestWithSession, res) => {
    // get query, count, and page from url
    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment,prefer-const
    let { query, count, page } = req.query;

    // check if query is a string
    if (typeof query !== 'string') {
      query = '';
    }

    // check if count is a number
    let countNum = parseInt(count as string) || 9;

    // max count is 100 and min count is 1 so clip count
    countNum = Math.max(1, Math.min(countNum, 100));

    // check if page is a number
    const pageNum = parseInt(page as string) - 1 || 0;

    const userId = BigInt(req.session?.userId || -1);

    // get roadmaps from database
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const roadmaps = await ExploreDB.searchRoadmapsByLiked<RoadmapMini>(
      query,
      userId,
      countNum,
      pageNum,
    );

    const db = new Database();

    // get total roadmaps
    const totalRoadmaps =
      await db.countWhereLike('roadmaps', 'name', `%${query}%`);

    // page count
    const pageCount = Math.ceil(parseInt(totalRoadmaps.toString()) / countNum);

    // process roadmaps
    roadmaps.forEach((roadmap) => {
      addView(userId, BigInt(roadmap.id), false);

      roadmap.id = roadmap.id.toString();
      roadmap.likes = roadmap.likes.toString();
      roadmap.ownerId = roadmap.ownerId.toString();
      roadmap.isLiked = Boolean(roadmap.isLiked);

    });
    // send roadmaps
    res.status(200).json({
      success: true,
      roadmaps,
      pageCount,
    });
  });

export default ExploreRouter;
