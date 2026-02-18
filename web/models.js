import { DataTypes, Sequelize } from "sequelize";
import { toSvg } from "jdenticon";

export const sequelize = new Sequelize("sqlite:data/db.sqlite");

export const User = sequelize.define(
  "User",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    about: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    identicon: {
      type: DataTypes.VIRTUAL,
      get: function () {
        return toSvg(this.get("name"), 25);
      },
    },
  },
  {
    defaultScope: { attributes: { exclude: "password" } },
    scopes: {
      includePassword: {},
    },
  }
);

export const Post = sequelize.define("Post", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  link: {
    type: DataTypes.STRING,
  },
  linkType: {
    type: DataTypes.STRING,
  },
  text: {
    type: DataTypes.STRING,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

User.hasMany(Post);
Post.belongsTo(User);

export const Comment = sequelize.define("Comment", {
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Comment.belongsTo(User);
User.hasMany(Comment);

Comment.belongsTo(Post);
Post.hasMany(Comment);

Comment.belongsTo(Comment, { foreignKey: "ParentId", as: "Parent" });
Comment.hasMany(Comment, { foreignKey: "ParentId", as: "Children" });

export const PostVote = sequelize.define("PostVote");
User.belongsToMany(Post, { through: PostVote, as: "VotedPosts" });
Post.belongsToMany(User, { through: PostVote, as: "Votes" });

export const CommentVote = sequelize.define("CommentVote");
User.belongsToMany(Comment, { through: CommentVote, as: "VotedComments" });
Comment.belongsToMany(User, { through: CommentVote, as: "Votes" });

export const Log = sequelize.define(
  "Log",
  {
    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { updatedAt: false }
);

Log.belongsTo(User);
User.hasMany(Log);

await sequelize.sync();
