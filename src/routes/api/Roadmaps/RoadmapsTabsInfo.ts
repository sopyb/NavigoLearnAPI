import { Router } from 'express';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import Paths from '@src/routes/constants/Paths';
import {
  RequestWithSession,
  requireSessionMiddleware
} from '@src/middleware/session';
import { ITabInfo, TabInfo } from '@src/models/TabInfo';
import Database from '@src/util/DatabaseDriver';
import * as console from 'console';

const RoadmapTabsInfo = Router({ mergeParams: true });

RoadmapTabsInfo.post(Paths.Roadmaps.TabsInfo.Create, requireSessionMiddleware);

RoadmapTabsInfo.post(
  Paths.Roadmaps.TabsInfo.Create,
  async (req: RequestWithSession, res) => {
    //get data from body and session
    let tabInfo;
    const session = req.session;

    try {
      // eslint-disable-next-line max-len
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
      const tabInfoData = req.body?.tabInfo as ITabInfo;

      if (!tabInfoData) {
        throw new Error('tabinfo is missing.');
      }

      // set userId
      tabInfoData.userId = session?.userId || BigInt(-1);
      tabInfoData.id = BigInt(-1);
      tabInfoData.roadmapId = BigInt(tabInfoData.roadmapId); // set as string on frontend

      tabInfo = TabInfo.from(tabInfoData);
    } catch (e) {
      console.log(e);
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'tabinfo data is invalid.' });
    }

    // get database connection
    const db = new Database();

    // save issue to database
    console.log(tabInfo);
    const id = await db.insert('tabsInfo', tabInfo);

    // check if id is valid
    if (id < 0)
      return res
        .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Issue could not be saved to database.' });

    // return id
    return res.status(HttpStatusCodes.CREATED).json({ id: id.toString() });
  },
);

RoadmapTabsInfo.get(Paths.Roadmaps.TabsInfo.Get, async (req, res) => {
  // get issue id  from params
  const stringId = req.params?.tabInfoId;
  const roadmapId = BigInt(req.params?.roadmapId || -1);

  if (roadmapId < 0) {
    return res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json({ error: 'RoadmapId is invalid.' });
  }

  if (!stringId) return res
    .status(HttpStatusCodes.BAD_REQUEST)
    .json({ error: 'TabID not found.' });

  // get database connection
  const db = new Database();

  // the stringId is supposed to be unique and created with uuidv4 by the frontend
  const tabData = await db.getWhere<ITabInfo>(
    'tabsInfo',
    'stringId',
    stringId,
    'roadmapId',
    roadmapId
  );

  if (!tabData) res.status(HttpStatusCodes.NOT_FOUND)
    .json({ error: 'TabInfo not found.' });

  const result = {
    id: tabData?.id.toString(),
    stringId: tabData?.stringId,
    roadmapId: tabData?.roadmapId.toString(),
    userId: tabData?.userId.toString(),
    content: tabData?.content,
  };

  return res.status(HttpStatusCodes.OK).json({ tabInfo: result });
});

RoadmapTabsInfo.post(Paths.Roadmaps.TabsInfo.Update, async (req, res) => {
  const stringId = req.params?.tabInfoId;
  const roadmapId = BigInt(req.params?.roadmapId || -1);

  if (roadmapId < 0) return res
    .status(HttpStatusCodes.BAD_REQUEST)
    .json({ error: 'RoadmapId is invalid.' });

  if (!stringId) return res
    .status(HttpStatusCodes.BAD_REQUEST)
    .json({ error: 'TabID not found.' });

  // get database connection
  const db = new Database();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const sentTabData = req.body?.tabInfo as ITabInfo;
  const newContent = sentTabData.content;
  console.log('new content', newContent);
  // gets previous data from the table
  const tabData = await db.getWhere<ITabInfo>(
    'tabsInfo',
    'stringId',
    stringId,
    'roadmapId',
    roadmapId
  );

  if (tabData?.content) {
    tabData.content = newContent;
  } else {
    return res
      .status(HttpStatusCodes.NOT_FOUND)
      .json({ error: 'Issue not found.' });
  }
  const success = await db.update('tabsInfo', tabData.id, tabData);

  if (!success)
    return res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'Issue could not be saved to database.' });
  // return success
  return res.status(HttpStatusCodes.OK).json({ success: true });
});

export default RoadmapTabsInfo;
