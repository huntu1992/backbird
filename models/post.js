module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    'Post',
    {
      // 테이블명 posts
      content: {
        type: DataTypes.TEXT, // 매우 긴 글
        allowNull: false,
      }, // createdAt, updatedAt 자동생성
    },
    {
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    }
  );
  Post.associate = (db) => {
    db.Post.belongsTo(db.User); // UserId // addUser addUsers도있음
    db.Post.hasMany(db.Comment);
    db.Post.hasMany(db.Image);
    db.Post.belongsToMany(db.User, { through: 'Like', as: 'Likers' }); //as 이름으로 db테이블명이 대체됨
    db.Post.belongsTo(db.Post, { as: 'Retweet' }); // PostId=>RetweetId
    db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' });
  };
  return Post;
};
