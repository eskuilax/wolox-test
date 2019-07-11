const router = require('express').Router();
const fetch = require('node-fetch');
const userFunctions = require('../controller/users');
const folderPermission = require('../models/folderShares');
var sess;

router.get('/myAlbumesShared', async (req, res) => {
    sess = req.session;
    var userId = sess.idUser;

    if (sess.email) {

        const albums = await userFunctions.getAlbumByUserId(userId);
        res.render('user/myAlbumesShared', { albums });

    } else {
        res.redirect('/');
    }
});

router.post('/getAlbumFilter', async (req, res) => {
    console.log('In ' + req.path)
    sess = req.session;
    var userId = sess.idUser;
    var userFinded;
    const idAlbum = req.body.SL_myAlbumes;
    const read = req.body.chk_read || 0;
    const write = req.body.chk_write || 0;

    var exist = 0;
    var stringSort = '';

    console.log('read %d and write %d and idAlbum %d', read, write, idAlbum);
    if (read == 1 && write == 1) {
        exist = await folderPermission.find({ idAlbum: idAlbum, readAccess: read, writeAccess: write }) || null;
    } else if (read == 1 && write == 0) {
        exist = await (folderPermission.find({ idAlbum: idAlbum, readAccess: 1 })) || null;
    } else if (read == 0 && write == 1) {
        exist = await folderPermission.find({ idAlbum: idAlbum, writeAccess: 1 }) || null;
    }

    if (exist.length > 0) {
        console.log('Number of user filtered=>' + exist.length);

        for (let index = 0; index < exist.length; index++) {
            if (index > 0) {
                stringSort += '&';
            }
            stringSort += 'id=' + exist[index].idUser;
        }

        userFinded = await fetch('https://jsonplaceholder.typicode.com/users?' + stringSort)
            .then((response) => {
                return response.json();
            })
            .then(async (post) => {
                return post;
            });
    }

    const albums = await userFunctions.getAlbumByUserId(userId);

    res.render('user/myAlbumesShared', { albums, userFinded });
});

module.exports = router;