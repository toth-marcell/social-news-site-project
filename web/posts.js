import {
  Comment,
  CommentVote,
  Post,
  PostVote,
  User,
  sequelize,
} from "./models.js";

export async function GetPosts(sort, offset = 0, user) {
  if (typeof offset == "string") offset = parseInt(offset);
  let order;
  switch (sort) {
    case "hot":
      order = [
        [sequelize.fn("date", sequelize.col("Post.createdAt")), "DESC"],
        ["votes", "DESC"],
      ];
      break;
    case "new":
      order = [["id", "DESC"]];
      break;
  }
  const customAttrs = [
    [
      sequelize.literal(
        "(SELECT COUNT(*) FROM PostVotes WHERE PostId=Post.Id)"
      ),
      "votes",
    ],
  ];
  if (user)
    customAttrs.push([
      sequelize.literal(
        `(SELECT COUNT(*) FROM PostVotes WHERE PostId=Post.Id AND UserId=${user.id})`
      ),
      "voted",
    ]);
  const limit = 20;
  const result = await Post.findAndCountAll({
    include: [{ model: User, attributes: ["name"] }],
    attributes: { include: customAttrs },
    order,
    limit,
    offset,
  });
  return {
    posts: result.rows.map((x) => x.get()),
    count: result.count,
    limit,
    offset,
  };
}

async function fetchComments(commentObject, commentData, user) {
  const customAttrs = [
    [
      sequelize.literal(
        "(SELECT COUNT(*) FROM CommentVotes WHERE CommentId=Comment.id)"
      ),
      "votes",
    ],
  ];
  if (user)
    customAttrs.push([
      sequelize.literal(
        `(SELECT COUNT(*) FROM CommentVotes WHERE CommentId=Comment.id AND UserId=${user.id})`
      ),
      "voted",
    ]);
  commentData.Children = await Promise.all(
    (
      await commentObject.getChildren({
        include: { model: User, attributes: ["name"] },
        attributes: { include: customAttrs },
        order: [["votes", "DESC"]],
      })
    ).map((x) => fetchComments(x, x.get(), user))
  );
  return (commentObject, commentData);
}

export async function GetPost(id, user) {
  const customAttrs = [
    [
      sequelize.literal(
        "(SELECT COUNT(*) FROM PostVotes WHERE PostId=Post.Id)"
      ),
      "votes",
    ],
  ];
  const customCommentAttrs = [
    [
      sequelize.literal(
        "(SELECT COUNT(*) FROM CommentVotes WHERE CommentId=Comment.id)"
      ),
      "votes",
    ],
  ];
  if (user) {
    customAttrs.push([
      sequelize.literal(
        `(SELECT COUNT(*) FROM PostVotes WHERE PostId=Post.Id AND UserId=${user.id})`
      ),
      "voted",
    ]);
    customCommentAttrs.push([
      sequelize.literal(
        `(SELECT COUNT(*) FROM CommentVotes WHERE CommentId=Comment.id AND UserId=${user.id})`
      ),
      "voted",
    ]);
  }
  const post = await Post.findByPk(id, {
    include: [
      {
        model: Comment,
        where: { ParentId: null },
        required: false,
        include: { model: User, attributes: ["name"] },
        attributes: { include: customCommentAttrs },
        order: [["votes", "DESC"]],
        separate: true,
      },
      { model: User, attributes: ["name"] },
    ],
    attributes: { include: customAttrs },
  });
  if (!post) return { status: 404, msg: "No such post!" };
  const postData = post.get();
  for (let i = 0; i < post.Comments.length; i++) {
    postData.Comments[i] = await fetchComments(
      post.Comments[i],
      post.Comments[i].get(),
      user
    );
  }
  return { status: 200, post: postData };
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
  await UpvotePost(post.id, user);
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
  await post.update({ title, link, linkType, text, category });
  return { status: 200, msg: "Success!" };
}

export async function TopComment(text, PostId, user) {
  if (!text)
    return { status: 400, msg: "You can't submit a comment with no text!" };
  const post = await Post.findByPk(PostId);
  if (!post) return { status: 404, msg: "No such post!" };
  const comment = await post.createComment({ text, UserId: user.id });
  await UpvoteComment(comment.id, user);
  return { status: 200, comment };
}

export async function GetSingleComment(id, user) {
  const customAttrs = [
    [
      sequelize.literal(
        "(SELECT COUNT(*) FROM CommentVotes WHERE CommentId=Comment.Id)"
      ),
      "votes",
    ],
  ];
  if (user)
    customAttrs.push([
      sequelize.literal(
        `(SELECT COUNT(*) FROM CommentVotes WHERE CommentId=Comment.Id AND UserId=${user.id})`
      ),
      "voted",
    ]);
  const comment = await Comment.findByPk(id, {
    include: [
      { model: User, attributes: ["name"] },
      { model: Post, attributes: ["title"] },
    ],
    attributes: { include: customAttrs },
  });
  if (!comment) return { status: 404, msg: "No such comment!" };
  return { status: 200, msg: "Success!", comment: comment.get() };
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
  await UpvoteComment(comment.id, user);
  return { status: 200, msg: "Success!", comment };
}

export async function DeleteComment(id, user) {
  const comment = await Comment.findByPk(id);
  if (!comment) return { status: 404, msg: "No such comment!" };
  if (!(comment.UserId == user.id || user.isAdmin))
    return {
      status: 403,
      msg: "You can only delete your own comments, unless you are an admin.",
    };
  await comment.destroy();
  return { status: 200, msg: "Success!" };
}

export async function EditComment(id, text, user) {
  if (!text) return { status: 400, msg: "You can't have an empty comment!" };
  const comment = await Comment.findByPk(id);
  if (!comment) return { status: 404, msg: "No such comment!" };
  if (!user.isAdmin && comment.UserId != user.id) {
    return {
      status: 403,
      msg: "You can only edit your own comments, unless you are an admin.",
    };
  }
  await comment.update({ text });
  return { status: 200, msg: "Success!" };
}

export async function UpvotePost(PostId, user) {
  const post = await Post.findByPk(PostId);
  if (!post) return { status: 404, msg: "Post not found!" };
  const existingVote = await PostVote.findOne({
    where: { PostId, UserId: user.id },
  });
  if (existingVote) {
    await existingVote.destroy();
    return { status: 200, msg: "Upvote removed!" };
  }
  await PostVote.create({ PostId, UserId: user.id });
  return { status: 201, msg: "Upvote added!" };
}

export async function UpvoteComment(CommentId, user) {
  const comment = await Comment.findByPk(CommentId);
  if (!comment) return { status: 404, msg: "Comment not found!" };
  const existingVote = await CommentVote.findOne({
    where: { CommentId, UserId: user.id },
  });
  if (existingVote) {
    await existingVote.destroy();
    return { status: 200, msg: "Upvote removed!", comment };
  }
  await CommentVote.create({ CommentId, UserId: user.id });
  return { status: 201, msg: "Upvote added!", comment };
}
