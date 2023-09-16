import {Router} from 'express';
import Paths from '@src/constants/Paths';
import validateSession from '@src/middleware/validateSession';

const NotificationsRouter = Router();

const { Get, Dismiss } = Paths.Notifications;

NotificationsRouter.get(Get.Base, validateSession, async (req, res) => {});

NotificationsRouter.post(Dismiss, validateSession, async (req, res) => {});

export default NotificationsRouter;
