
const { Router } = require('express');
const router = Router();
const { getAlbums_, getAlbumsById_, getBodyAlbums_, deleteAlbums_, updateAlbums_, findKeyword_ } = require('../controller/albumController');

router.get('/albums', getAlbums_);
router.get('/albums/:id', getAlbumsById_);
router.post('/albums',  getBodyAlbums_);
router.delete('/albums/:id', deleteAlbums_);
router.put('/albums/:id', updateAlbums_);
router.get('/album', findKeyword_);


module.exports = router;