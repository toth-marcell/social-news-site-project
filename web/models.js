import { DataTypes, Sequelize } from "sequelize";

export const sequelize = new Sequelize("sqlite:data/db.sqlite");

export const User = sequelize.define("User", {
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
});

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

Comment.belongsTo(Comment, { foreignKey: "ParentId" });
Comment.hasMany(Comment, { foreignKey: "ParentId" });

User.belongsToMany(Post, { through: "PostVote" });
Post.belongsToMany(User, { through: "PostVote" });

User.belongsToMany(Comment, { through: "CommentVote" });
Comment.belongsToMany(User, { through: "CommentVote" });

await sequelize.sync();
