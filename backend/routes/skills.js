const { Router } = require('express');
const { createNewSkill } = require('../controller/skillsController');
const router  = Router();

router.post('/', createNewSkill);

module.exports = router;