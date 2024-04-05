



const express = require('express');
const router = express.Router();
const { createUser } = require('../Controller/usercontroller');

router.post('/users', createUser);



module.exports = router;
