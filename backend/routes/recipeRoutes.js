const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');

router.get('/', recipeController.getAllRecipes);
router.post('/', recipeController.createRecipe);
router.put('/:id', recipeController.updateRecipe);

// 🔥 THÊM DÒNG NÀY
router.delete('/menu/:menu_ID', recipeController.deleteByMenu);

router.delete('/:id', recipeController.deleteRecipe);

module.exports = router;