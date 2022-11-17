const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async(req, res) => {
  const products = await Product.findAll({
    include: [Category, Tag]
  });
  res.json(products);
});

// get one product
router.get('/:id', async(req, res) => {
  const products = await Product.findOne({
    where: {id: req.params.id},
    include: [Category, Tag]
  });
  res.json(products);
});

// create new product
router.post('/', async(req, res) => {
  try {
    const product = await Product.create(req.body);
    // if no product tags, just respond
    if (!req.body.tagIds.length) {
      res.status(200).json(product);
      return;
    }
    // if there's product tags, we need to create pairings to bulk create in the ProductTag model
    const productTagIdArr = req.body.tagIds.map((tag_id) => {
      return {product_id: product.id, tag_id};
    });
    const productTagIds = await ProductTag.bulkCreate(productTagIdArr);
    console.log(productTagIdArr);
    res.status(200).json(productTagIds);
  } catch(err) {
      console.log(err);
      res.status(400).json(err);
  }
});

// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', async(req, res) => {
  const result = await Product.destroy({where: {id: req.params.id}});
  res.json({success: true})
});

module.exports = router;
