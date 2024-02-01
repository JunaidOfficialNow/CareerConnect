const {Router} = require('express');
const {createNewSkill, getSkills, deleteSkills} = require('../controller/skillsController');


const router = Router();

router.post('/', createNewSkill);
router.get('/', getSkills);
router.delete('/:skillId', deleteSkills)


module.exports = router;
