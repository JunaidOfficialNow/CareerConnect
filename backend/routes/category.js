const {Router} = require('express');
const { createNewCategory, getCategories, deleteCategory } = require('../controller/categoryController');


const router = Router();

router.post('/', createNewCategory);
router.get('/', getCategories);
router.delete('/:categoryId', deleteCategory)


module.exports = router;
