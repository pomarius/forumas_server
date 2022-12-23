import { Router } from 'express';
import { commentController } from '../controllers/comment.controller';

const router = Router();

router.post(`/create`, commentController.createComment);
router.get(`/read/:postId`, commentController.readComment);
router.get(`/read/:id/:postId/:topicId`, commentController.readComment);
router.patch(`/update/:id`, commentController.updateComment);
router.delete(`/delete/:id`, commentController.deleteComment);
router.post(`/upvote/:id`, commentController.upvoteComment);
router.post(`/downvote/:id`, commentController.downvoteComment);
router.post(`/unvote/:id`, commentController.unvoteComment);

export const commentRouter = router;
