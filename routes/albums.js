const router = require('express').Router();
const fetch = require('node-fetch');
const userFunctions = require('../controller/users');
const folderPermission = require('../models/folderShares');
var sess;

router.get('/myControlPanel', async (req, res) => {
  sess = req.session;
  var userId = sess.idUser;

  if (sess.email) {

    const albums = await userFunctions.getAlbumByUserId(userId);
    res.render('user/myPanel', { albums });

  } else {
    res.redirect('/');
  }


});

router.post('/shareAlbum', async (req, res) => {
  console.log('entro a shareAlbum');
  const error = [], exito = [];
  const idAlbum = req.body.SL_myAlbumes;
  const read = req.body.chk_read || 0;
  const write = req.body.chk_write || 0;
  const email = req.body.ip_userToShare;

  const resFetchUsers = await userFunctions.validateUserToShare(email);

  if (resFetchUsers[0]) {

    const exist = await folderPermission.find({ idUser: resFetchUsers[0].id, idAlbum: idAlbum });
    console.log('busqueda ' + JSON.stringify(exist));

    if (exist.length == 0) {
      console.log('the access doesnt exist!')
      console.log('read %d and write %d and idUser %d and idAlbum %d', read, write, resFetchUsers[0].id, idAlbum);
      const newPermission = new folderPermission({
        idUser: resFetchUsers[0].id,
        idAlbum: idAlbum,
        readAccess: read,
        writeAccess: write
      });

      const createdPermission = await newPermission.save(function (err) {
        if (err) console.log('Error in Saving permission: ' + err);
        console.log('Permission Registration succesful');
      });

        req.flash('success_msg', 'Compartiste esta carpeta con %s :)', resFetchUsers[0].name);
        res.redirect('/myControlPanel/');
      

    } else {
      console.log('the access exist and was updated!')
      const updateAccess = await folderPermission.findOneAndUpdate({ idUser: resFetchUsers[0].id, idAlbum: idAlbum }, {
        readAccess: read,
        writeAccess: write
      });

      if (updateAccess) {
        req.flash('success_msg', 'Permisos actualizados con éxito :)');
        res.redirect('/myControlPanel/');
      } else {
        req.flash('error_msg', 'No se pudo actualizar los permisos :(');
        res.redirect('/myControlPanel/');
      }

    }

  } else {
    req.flash('error_msg', 'El usuario no existe :(');
    res.redirect('/myControlPanel/');
  }

});

module.exports = router;