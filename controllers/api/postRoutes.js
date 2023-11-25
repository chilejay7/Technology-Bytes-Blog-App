const router = require('express').Router();
const { Post } = require('../../models');

router.get('/', async (req, res) => {
    // console.log(req);
    const postData = await Post.findAll();
    // console.log(postData);
    console.log(req.session);
    const posts = postData.map(post => post.get({ plain: true }));
    console.log(posts);
    res.render('homepage', { 
        posts,
        loggedIn: req.session.loggedIn,
    });
});

module.exports = router;