const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/wChallenge', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false
})
    .then(db => console.log('DB is connected'))
    .catch(err => console.error('wrong to connect DB'));