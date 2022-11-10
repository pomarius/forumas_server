import { Router } from 'express';
import { topicController } from '../controllers/topic.controller';

const router = Router();

router.post(`/create`, topicController.createTopic);
router.get(`/read/:id`, topicController.readTopic);
router.get(`/read`, topicController.readAllTopics);
router.patch(`/update/:id`, topicController.updateTopic);
router.post(`/delete/:id`, topicController.deleteTopic);
router.post(`/moderator/:id`, topicController.addTopicModerator);
router.post(`/block/:id`, topicController.blockUser);

export const topicRouter = router;
