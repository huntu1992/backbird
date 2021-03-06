const express = require('express');
const db = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

router.get('/:tag', async (req, res, next) => {
  // Get /hashtag/:id?lastId=10&limit=10
  try {
    let where = {};
    if (parseInt(req.query.lastId, 10)) {
      where = {
        id: {
          [db.Sequelize.Op.lt]: parseInt(req.query.lastId, 10),
        },
      };
    }
    const posts = await db.Post.findAll({
      where,
      include: [
        {
          model: db.Hashtag,
          //한글이 올수있기때문에 decodeURIComponent
          where: { name: decodeURIComponent(req.params.tag) },
        },
        {
          model: db.User,
          attributes: ['id', 'nickname'],
        },
        {
          model: db.Image,
        },
        {
          model: db.User,
          as: 'Likers',
          attributes: ['id'],
        },
        {
          model: db.Post,
          as: 'Retweet',
          include: [
            {
              model: db.User,
              attributes: ['id', 'nickname'],
            },
            {
              model: db.Image,
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
      // offset: parseInt(req.query.offset, 10) || 0, //실무에서는 중간에 삭제를 고려하기 때문에 안쓰는 방식임. 성능문제도있음
      limit: parseInt(req.query.limit, 10) || 10,
    });
    res.json(posts);
  } catch (err) {
    console.error(err);
    next(err);
  }
});
module.exports = router;
