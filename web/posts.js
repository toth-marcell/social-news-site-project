import { Comment, CommentVote, Post, PostVote, User } from "./models.js";

export async function GetPosts() {
  const posts = await Post.findAll({
    include: { model: User, attributes: ["name"] },
  });
  const postObjects = [];
  for (const post of posts) {
    postObjects.push(
      Object.assign(post.get(), {
        votes: await post.countVotes(),
      })
    );
  }
  return postObjects;
}

async function fetchComments(commentObject, commentData) {
  commentData.Children = await Promise.all(
    (
      await commentObject.getChildren({
        include: { model: User, attributes: ["name"] },
      })
    ).map((x) => fetchComments(x, x.get()))
  );
  commentData.votes = await commentObject.countVotes();
  return (commentObject, commentData);
}

export async function GetPost(id) {
  const postObject = await Post.findByPk(id, {
    include: [
      {
        model: Comment,
        where: { ParentId: null },
        required: false,
        include: { model: User, attributes: ["name"] },
      },
      { model: User, attributes: ["name"] },
    ],
  });
  if (!postObject) return { status: 404, msg: "No such post!" };
  const post = postObject.get();
  post.votes = await postObject.countVotes();
  for (let i = 0; i < postObject.Comments.length; i++) {
    post.Comments[i] = await fetchComments(
      postObject.Comments[i],
      postObject.Comments[i].get()
    );
  }
  return { status: 200, post };
}

export async function CreatePost(title, link, linkType, text, category, user) {
  if (!(title && category))
    return { status: 400, msg: "The title and category must be filled!" };
  if (!((link && linkType) || text))
    return {
      status: 400,
      msg: "The link and link type; or the text field must be filled.",
    };
  if ((link && !linkType) || (linkType && !link))
    return {
      status: 400,
      msg: "If the link is set the link type must be set too.",
    };
  const post = await user.createPost({
    title,
    link: link == "" ? null : link,
    linkType: linkType == "" ? null : linkType,
    text: text == "" ? null : text,
    category,
  });
  return { status: 201, msg: "Success!", id: post.id };
}

export async function DeletePost(id, user) {
  const post = await Post.findByPk(id);
  if (!post) return { status: 404, msg: "No such post!" };
  if (!(post.UserId == user.id || user.isAdmin))
    return {
      status: 403,
      msg: "You can only delete your own posts, unless you are an admin.",
    };
  await post.destroy();
  return { status: 200, msg: "Success!" };
}

export async function EditPost(
  id,
  title,
  link,
  linkType,
  text,
  category,
  user
) {
  const post = await Post.findByPk(id);
  if (!post) return { status: 404, msg: "No such post!" };
  if (!(post.UserId == user.id || user.isAdmin))
    return {
      status: 403,
      msg: "You can only edit your own posts, unless you are an admin.",
    };
  if (!(title || link || linkType || text || category))
    return { status: 400, msg: "Not changing anything." };
  if (title) await post.update({ title });
  if (link) await post.update({ link });
  if (linkType) await post.update({ linkType });
  if (text) await post.update({ text });
  if (category) await post.update({ category });
  return { status: 200, msg: "Success!" };
}

export async function TopComment(text, PostId, user) {
  if (!text)
    return { status: 400, msg: "You can't submit a comment with no text!" };
  const post = await Post.findByPk(PostId);
  if (!post) return { status: 404, msg: "No such post!" };
  const comment = await post.createComment({ text, UserId: user.id });
  return { status: 200, comment };
}

export async function GetSingleComment(id) {
  const comment = await Comment.findByPk(id, {
    include: [
      { model: User, attributes: ["name"] },
      { model: Post, attributes: ["title"] },
    ],
  });
  if (!comment) return { status: 404, msg: "No such comment!" };
  return {
    status: 200,
    comment: Object.assign(comment.get(), {
      votes: await comment.countVotes(),
    }),
  };
}

export async function ChildComment(text, ParentId, user) {
  if (!text)
    return { status: 400, msg: "You can't submit a comment with no text!" };
  const parent = await Comment.findByPk(ParentId);
  if (!parent) return { status: 404, msg: "No such parent comment!" };
  const comment = await parent.createChild({
    text,
    UserId: user.id,
    PostId: parent.PostId,
  });
  return { status: 200, comment };
}

export async function UpvotePost(PostId, user) {
  const post = await Post.findByPk(PostId);
  if (!post) return { status: 404, msg: "Post not found!" };
  const existingVote = await PostVote.findOne({
    where: { PostId, UserId: user.id },
  });
  if (existingVote) return { status: 400, msg: "You already voted on this!" };
  await PostVote.create({ PostId, UserId: user.id });
  return { status: 200, msg: "Success!" };
}

export async function UpvoteComment(CommentId, user) {
  const comment = await Comment.findByPk(CommentId);
  if (!comment) return { status: 404, msg: "Comment not found!" };
  const existingVote = await CommentVote.findOne({
    where: { CommentId, UserId: user.id },
  });
  if (existingVote)
    return { status: 400, msg: "You already voted on this!", comment };
  await CommentVote.create({ CommentId, UserId: user.id });
  return { status: 200, msg: "Success!", comment };
}
