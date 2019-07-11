const router = require('express').Router();
const fetch = require('node-fetch');
var sess;

router.get('/user/signin',(req,res)=>{
    res.render('user/signin');
   });

router.post('/login', (req, res)=>{
    sess = req.session;
    console.log('en sginnin');
    const email = req.body.email;
    const error = [];


    fetch( 'https://jsonplaceholder.typicode.com/users?email='+email)
      .then((response)=>{
        return  response.json();
      }) 
      .then((post) => {

        if(post[0] != undefined){

          user = post;
          sess.idUser = post[0].id;
          sess.email = post[0].email;  
          usersesion = sess.email;

          res.redirect('/myControlPanel');
          
        }else{
          error.push('El usuario no existe!');
          res.render('user/signin', {error});
        }
      });

   });

   router.get('/logout',(req,res) => {
     console.log('logout');
     usersesion = null;
    req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        res.redirect('/');
    });

});


module.exports = router;