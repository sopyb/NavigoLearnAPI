import { Router } from 'express';
import Paths from '@src/routes/constants/Paths';
import { ExploreDB } from '@src/util/ExploreDB';

const ExploreRouter = Router();

interface RoadmapResult {
  id: bigint | string;
  name: string;
  description: string;
  likes: bigint | string;
  issueCount: bigint | string;
  ownerName: string;
  ownerId: bigint | string;
}

ExploreRouter.get(Paths.Explore.Default, async (req, res) => {
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

  // get roadmaps from database
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const roadmaps = await ExploreDB.searchRoadmapsByLiked<RoadmapResult>(
    query,
    countNum,
    pageNum,
  );

  // process roadmaps
  roadmaps.forEach((roadmap) => {
    roadmap.id = roadmap.id.toString();
    roadmap.likes = roadmap.likes.toString();
    roadmap.issueCount = roadmap.issueCount.toString();
    roadmap.ownerId = roadmap.ownerId.toString();
  });
  // send roadmaps
  res.status(200).json({
    success: true,
    roadmaps,
  });
});

export default ExploreRouter;
