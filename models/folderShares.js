const mongoose = require('mongoose');

const {Schema} = mongoose;

const folderPermission = new Schema({

idUser: {type: Number, required: true},
idAlbum: {type: Number, required:true},
readAccess: { type: Number, default: 0}, //0: notAccess 1:Access
writeAccess: {type: Number, default: 0} //0: notAccess 1:Access
},{
    versionKey: false 
});

module.exports = mongoose.model('folderPermission', folderPermission);