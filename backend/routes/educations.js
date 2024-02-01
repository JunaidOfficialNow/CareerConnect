const {Router} = require('express');
const { createNewEducation, getEducations, deleteEducation } = require('../controller/educationsController');


const router = Router();

router.post('/', createNewEducation);
router.get('/', getEducations);
router.delete('/:educationId', deleteEducation)


module.exports = router;
