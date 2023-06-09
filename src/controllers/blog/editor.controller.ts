import { ProtectedRequest } from 'app-request';
import { BlogRepo } from '../../database/repos';
import {
  AsyncHandler,
  BadRequestError,
  ForbiddenError,
  SuccessMsgResponse,
  SuccessResponse,
} from '../../core';
import { Types } from 'mongoose';

const HandleGetAllEditorDrafts = AsyncHandler(
  async (req: ProtectedRequest, res) => {
    const blogs = await BlogRepo.findAllDrafts();
    return new SuccessResponse('success', blogs).send(res);
  },
);

const HandleGetAllEditorSubmitted = AsyncHandler(
  async (_: ProtectedRequest, res) => {
    const blogs = await BlogRepo.findAllSubmissions();
    return new SuccessResponse('success', blogs).send(res);
  },
);

const HandleGetAllEditorPublished = AsyncHandler(
  async (req: ProtectedRequest, res) => {
    const blogs = await BlogRepo.findAllPublished();
    return new SuccessResponse('success', blogs).send(res);
  },
);

const HandleGetSingleBlogForEditor = AsyncHandler(
  async (req: ProtectedRequest, res) => {
    const blog = await BlogRepo.findBlogAllDataById(
      new Types.ObjectId(req.params.id),
    );

    if (!blog) throw new BadRequestError('Blog does not exists');
    if (!blog.isSubmitted && !blog.isPublished)
      throw new ForbiddenError('This blog is private');

    new SuccessResponse('success', blog).send(res);
  },
);

const HandlePublishSingleBlog = AsyncHandler(
  async (req: ProtectedRequest, res) => {
    const blog = await BlogRepo.findBlogAllDataById(
      new Types.ObjectId(req.params.id),
    );
    if (!blog) throw new BadRequestError('Blog does not exists');

    blog.isDraft = false;
    blog.isSubmitted = false;
    blog.isPublished = true;
    blog.text = blog.draftText;
    if (!blog.publishedAt) blog.publishedAt = new Date();

    await BlogRepo.update(blog);
    return new SuccessMsgResponse('Blog published successfully').send(res);
  },
);

const HandleUnpublishSingleBlog = AsyncHandler(
  async (req: ProtectedRequest, res) => {
    const blog = await BlogRepo.findBlogAllDataById(
      new Types.ObjectId(req.params.id),
    );
    if (!blog) throw new BadRequestError('Blog does not exists');

    blog.isDraft = true;
    blog.isSubmitted = false;
    blog.isPublished = false;

    await BlogRepo.update(blog);
    return new SuccessMsgResponse('Blog unpublished successfully').send(res);
  },
);

const HandleDeleteSingleBlog = AsyncHandler(
  async (req: ProtectedRequest, res) => {
    const blog = await BlogRepo.findBlogAllDataById(
      new Types.ObjectId(req.params.id),
    );
    if (!blog) throw new BadRequestError('Blog does not exists');

    blog.status = false;

    await BlogRepo.update(blog);
    return new SuccessMsgResponse('Blog deleted successfully').send(res);
  },
);

export {
  HandleGetAllEditorDrafts,
  HandleGetAllEditorSubmitted,
  HandleGetAllEditorPublished,
  HandleGetSingleBlogForEditor,
  HandlePublishSingleBlog,
  HandleUnpublishSingleBlog,
  HandleDeleteSingleBlog,
};
