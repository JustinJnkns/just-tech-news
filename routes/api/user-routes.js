const router = require('express').Router()
const { User } = require('../../models')

// GET /api/users
router.get('/', (req, res) => {
    // Access our User model and run .findAll() method)
    User.findAll()
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//GET /api/user/1
router.get('/:id', (req, res) => {
    User.findOne({
            attributes: { exclude: ['password'] },
            where: {
                id: req.params.id
            }
        })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id' })
                return
            }
            res.json(dbUserData)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        })
})

//POST /api/users
router.post('/', (req, res) => {
    //expects {username: 'justin',email:'fake@email.com',password:'12345'}
    User.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        })
})

router.post('/login', (req, res) => {
    //expects{email: '.....' , password:'.....'}
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(dbUserData => {
        if (!dbUserData) {
            res.status(400).json({ message: 'No user with that email address!' })
            return
        }
        //res.json({ user: dbUserData })
        //verify user
        const validPassword = dbUserData.checkPassword(req.body.password)
        if (!validPassword) {
            res.status(400).json({ message: 'Incorrect Password' })
            return
        }
        res.json({ user: dbUserData, message: "you're now logged in!" })
    })
})

//PUT /api/user/1
router.put('/:id', (req, res) => {
    //expects {username:'justin',email:'fake@email.com',password:'12345}
    //if req.body has exact key/value pairs to match model, can use req.body
    User.update(req.body, {
            individualHooks: true,
            where: { id: req.params.id }
        }).then(dbUserData => {
            if (!dbUserData[0]) {
                res.status(404).json({ message: 'No user found with this id' })
                return
            }
            res.json(dbUserData)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        })
})

//DELETE /api/user/1
router.delete('/:id', (req, res) => {
    User.destroy({
            where: {
                id: req.params.id
            }
        }).then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'no user found with this id' })
                return
            }
            res.json(dbUserData)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        })
})

module.exports = router