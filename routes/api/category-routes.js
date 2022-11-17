const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async(req, res) => {
  const categories = await Category.findAll({include: [Product]});
  res.json(categories);
});

router.get('/:id', async(req, res) => {
  const category = await Category.findOne({
    where: {id: req.params.id},
    include: [Product]
  });
  res.json(category);
});

router.post('/', async(req, res) => {
  const category = await Category.create({category_name: req.body.category_name});
  const id = category.getDataValue('id');
  res.json({category_id: id})
});

router.put('/:id', async(req, res) => {
  const result = await Category.update({category_name: req.body.category_name}, {where: {id: req.params.id}});
  res.json({success: true});
});

router.delete('/:id', async(req, res) => {
  const result = await Category.destroy({where: {id: req.params.id}});
  res.json({success: true})
});

module.exports = router;
