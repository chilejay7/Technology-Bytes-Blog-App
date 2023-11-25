const router = require('express').Router();
const { User } = require('../models');
const bcrypt = require('bcrypt');

router.get('/', (req, res) => {
    // console.log(req.headers);
    res.render('user');
    // res.send('User request received');
});

router.post('/', async (req, res) => {
    console.log(`Username is: ${req.body.user_name} and the password is: ${req.body.password}`);

    const userData = await User.findOne({
        where: {
           user_name: req.body.user_name,
        }
    });

    // !userData ? res.status(400).json({message: 'User not found.  Please re-enter your credentials.'})
    console.log(userData);

    //  const validPassword = await userData.checkPassword(req.body.password);

    req.session.save(() => {
        req.session.user_id = userData.id;
        req.session.logged_in = true;

        res.status(200);
    });

    res.redirect('/');
});

module.exports = router;