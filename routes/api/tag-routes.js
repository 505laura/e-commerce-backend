const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async(req, res) => {
  res.json(await Tag.findAll({include: [Product]}));
});

router.get('/:id', async(req, res) => {
  const tag = await Tag.findOne({
    where: {id: req.params.id},
    include: [Product]
  })
  res.json(tag);
});

router.post('/', async(req, res) => {
  const tag = await Tag.create({tag_name: req.body.tag_name});
  const id = tag.getDataValue('id');
  res.json({tag_id: id})
});

router.put('/:id', async(req, res) => {
  const result = await Tag.update({tag_name: req.body.tag_name}, {where: {id: req.params.id}});
  res.json({success: true});
});

router.delete('/:id', async(req, res) => {
  const result = await Tag.destroy({where: {id: req.params.id}});
  res.json({success: true})
});

module.exports = router;
