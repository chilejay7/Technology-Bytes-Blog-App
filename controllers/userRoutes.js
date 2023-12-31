const router = require('express').Router();
const { User } = require('../models');

router.get('/', (req, res) => {
    res.render('user');
});

// Login route
router.post('/', async (req, res) => {

    const { user_name, password } = req.body;
    console.log(`Username is: ${user_name} and the password is: ${password}`);

    // This will query the database using the name attribute of user_name set in the user.handlebars login form.
    const userData = await User.findOne({
        where: {
            user_name: user_name.toLowerCase(),
        }
    });

    if (!userData) {
        res
        .status(400)
        .render('user')
        // .json({ message: 'Incorrect username or password. Please try again!' });
        return;
    }

    // The checkPassword function is defined in the User model.  When the User class extends the Model parent, the new function is added to the class.
    const validPassword = await userData.checkPassword(password);
    console.log(`ValidPassword Data follows: ${validPassword}`);

    // If the login password doesn't match the associated record in the database, a 400 status code is returned and stays on the login page.
    if (!validPassword) {
        res.status(400).render('user');
        return;
    }

    // This creates a session variable with loggedIn values to save the user state.
    // Once set on a user's session, this is passed to the views through the controllers as a variable that can be used in conditional statements.
    req.session.save(async () => {
        req.session.user_id = userData.id;
        req.session.loggedIn = true;

        // The redirect needs to be included with the response. Only one response can be sent to a single request.
        res.status(200).redirect('/');
    });

    console.dir(`Session data for debugging: ${req.session}`);
});

// Create new user route
router.post('/create', async (req, res) => {
    
    const { user_name, email, password } = req.body;

    try {
        // The variables from the request are all set by the sign-up form's name attributes in the user.handlebars file.
        const userData = await User.create({
            user_name: user_name.toLowerCase(),
            email: email.toLowerCase(),
            password,
        });

        const newUser = await User.findOne({
            where: {
                user_name,
            }
        });


        req.session.save(() => {
            req.session.user_id = newUser.id;
            req.session.loggedIn = true;
            res.status(200).redirect('/');
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.post('/logout', async (req, res) => {
    req.session.loggedIn ? req.session.destroy(() => res.status(204).end())
        : res.status(404).end();
});

module.exports = router;