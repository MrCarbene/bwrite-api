import Joi from 'joi';
import { JoiObjectId, JoiUrlEndpoint } from '../../../middlewares/validators';

export default {
  createBlog: Joi.object().keys({
    title: Joi.string().required().min(3).max(500),
    description: Joi.string().required().min(3).max(2000),
    text: Joi.string().required().max(50000),
    blogUrl: JoiUrlEndpoint().required().max(200),
    imgUrl: Joi.string().optional().uri().max(200),
    score: Joi.number().optional().min(0).max(1),
    tags: Joi.array().optional().min(1).items(Joi.string().uppercase()),
  }),
  updateBlog: Joi.object().keys({
    title: Joi.string().optional().min(3).max(500),
    description: Joi.string().optional().min(3).max(2000),
    text: Joi.string().optional().max(50000),
    blogUrl: JoiUrlEndpoint().optional().max(200),
    imgUrl: Joi.string().optional().uri().max(200),
    score: Joi.number().optional().min(0).max(1),
    tags: Joi.array().optional().min(1).items(Joi.string().uppercase()),
  }),
  blogId: Joi.object().keys({
    id: JoiObjectId().required(),
  }),
  blogUrl: Joi.object().keys({
    endpoint: JoiUrlEndpoint().required().max(200),
  }),
  blogTag: Joi.object().keys({
    tag: Joi.string().required(),
  }),
  pagination: Joi.object().keys({
    pageNumber: Joi.number().required().integer().min(1),
    pageItemCount: Joi.number().required().integer().min(1),
  }),
  authorId: Joi.object().keys({
    id: JoiObjectId().required(),
  }),
};
