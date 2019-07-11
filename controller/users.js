const fetch = require('node-fetch');
const folderPermission = require('../models/folderShares');


async function getComments(){

return await fetch( 'https://jsonplaceholder.typicode.com/comments')
  .then((response)=>{
    return  response.json();
  }) 
  .then(async (post) => {
     return post;
  });
}

async function getCommentsFilter(keysearch){

  var critery = keysearch;
  console.log('key'+keysearch);

  if (critery.includes('@')) {
    critery = '?email='+keysearch;
  }else if(critery.length){
    critery = '?name='+keysearch;
  }else{
    critery = '';
  }
  console.log('critery: '+critery);
return await fetch( 'https://jsonplaceholder.typicode.com/comments'+critery)
  .then((response)=>{
    return  response.json();
  }) 
  .then(async (post) => {
     return post;
  });
}

async function validateUserToShare(email){

  return await fetch('https://jsonplaceholder.typicode.com/users?email=' + email)
    .then((response) => {
      return response.json();
    })
    .then(async(post) => {
      return post;
    });

}

async function getAlbumByUserId(userId){

return await fetch('https://jsonplaceholder.typicode.com/albums?userId=' + userId)
.then((response) => {
    return response.json();
})
.then(async (post) => {
    return post;
});
}

async function getFolderUser(idAlbum, permission){

var exist ;
var stringSort = '';
if (permission == 'read') {
 exist=   await( folderPermission.find({ idAlbum: idAlbum,  readAccess: 1}));
}else{
   exist = await folderPermission.find({ idUser: idUserShared, idAlbum: idAlbum,  writeAccess: 1});
}
console.log('finded=>'+ exist.length + '\n==========&===========' );
//console.log('\n=========FIRTS============' );


  for (let index = 0; index < exist.length; index++) {
    
    if(index>0) stringSort+='&';


    stringSort += 'id='+ exist[index].idUser ;


    console.log('on for=> '+exist[index].idUser );
  }
console.log('string generated=> '+stringSort);
  const resFetchUsers = await fetch('https://jsonplaceholder.typicode.com/albums?' + stringSort)
    .then((response) => {
      return response.json();
    })
    .then(async (post) => {
      const data = post;
     await  console.log('post ' + JSON.stringify(data) );
      return post;
    });

}

module.exports = {getComments, getCommentsFilter, getFolderUser,  validateUserToShare, getAlbumByUserId};
    