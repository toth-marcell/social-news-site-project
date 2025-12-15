import { Comment, Post, User } from "./models.js";

export const GetPosts = async () => {
  const posts = await Post.findAll({
    include: { model: User, attributes: ["name", "id"] },
  });
  const postObjects = [];
  for (const post of posts) {
    postObjects.push(
      Object.assign(post.get(), {
        votes: await post.countVotes(),
      }),
    );
  }
  return postObjects;
};

async function fetchComments(commentObject, commentData) {
  commentData.Children = await Promise.all(
    (
      await commentObject.getChildren({
        include: { model: User, attributes: ["name"] },
      })
    ).map((x) => fetchComments(x, x.get())),
  );
  commentData.votes = await commentObject.countVotes();
  return (commentObject, commentData);
}

export const GetPost = async (id) => {
  const postObject = await Post.findByPk(id, {
    include: [
      {
        model: Comment,
        where: { ParentId: null },
        required: false,
        include: { model: User, attributes: ["name"] },
      },
      { model: User, attributes: ["name", "id"] },
    ],
  });
  const post = postObject.get();
  post.votes = await postObject.countVotes();
  for (let i = 0; i < postObject.Comments.length; i++) {
    post.Comments[i] = await fetchComments(
      postObject.Comments[i],
      postObject.Comments[i].get(),
    );
  }
  return post;
};

export const CreatePost = async (
  title,
  link,
  linkType,
  text,
  category,
  user,
) => {
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
};

export const DeletePost = async (id, user) => {
  const post = await Post.findByPk(id);
  if (!post) return { status: 404, msg: "No such post!" };
  if (!(post.UserId == user.id || user.isAdmin))
    return {
      status: 403,
      msg: "You can only delete your own posts, unless you are an admin.",
    };
  await post.destroy();
  return { status: 200, msg: "Success!" };
};

export const EditPost = async (
  id,
  title,
  link,
  linkType,
  text,
  category,
  user,
) => {
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
};

export async function TopComment(text, PostId, user) {
  const post = await Post.findByPk(PostId);
  if (!post) return { status: 404, msg: "No such post!" };
  const comment = await post.createComment({ text, UserId: user.id });
  return { status: 200, comment };
}
