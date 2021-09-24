const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { Post, Hashtag } = require('../models');
const { isLoggedIn } = require('./middlewares');
const {hash} = require("bcrypt");

const router = express.Router();

const UPLOAD_DIR = 'uploads/'

try {
  fs.readdirSync(UPLOAD_DIR);
} catch (error) {
  console.warn(`No upload directory, creating new one`);
  fs.mkdirSync(UPLOAD_DIR);
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, UPLOAD_DIR);
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname);
      done(null, path.basename(file.originalname, ext) + Date.now() + ext);
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post('/img', isLoggedIn, upload.single('img'), (req, res) => {
  console.log(req.file);
  res.json({ url: `/img/${req.file.filename}` });
});


const upload2 = multer();
router.post('/', isLoggedIn, upload2.none(), async (req, res, next) => {
  try {
    const post = await Post.create({
      content: req.body.content,
      img: req.body.url,
      UserId: req.user.id,
    });

    const hashtags = req.body.content.match(/#[^\s#]+/g);
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map(tag => {
          return Hashtag.findOrCreate({
            where: { title: tag.slice(1).toLowerCase() }
          })
        })
      );

      await post.addHashtags(result.map(r => r[0]));
    }
    res.redirect('/');

  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;