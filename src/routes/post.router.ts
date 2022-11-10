import { Router } from 'express';
import { postController } from '../controllers/post.controller';

const router = Router();

router.post(`/create`, postController.createPost);
router.get(`/read`, postController.readAllPosts);
router.get(`/read/:id`, postController.readPost);
router.patch(`/update/:id`, postController.updatePost);
router.post(`/delete/:id`, postController.deletePost);
router.post(`/upvote/:id`, postController.upvotePost);
router.post(`/downvote/:id`, postController.downvotePost);
router.post(`/unvote/:id`, postController.unvotePost);

export const postRouter = router;
