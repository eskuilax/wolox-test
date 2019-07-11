const router = require('express').Router();
const userFunctions = require('../controller/users');
var sess;

router.get('/Comments', async (req, res) => {
    sess = req.session;

    if (sess.email) {
        const getComments = await userFunctions.getComments();
        res.render('user/comments', { getComments });
    }else{
        res.redirect('/');
    }
});

router.post('/getCommentsFilter', async (req, res) => {

    const keySearch = req.body.ip_buscar;
    const getComments = await userFunctions.getCommentsFilter(keySearch);
    console.log('comments=>' + getComments);
    if (getComments) {

    }

    res.render('user/comments', { getComments });
});

module.exports = router;