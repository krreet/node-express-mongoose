'use strict';

/**
 * Module dependencies.
 */

const home = require('../app/controllers/home');
const mongoose = require('mongoose');
var ethereum_address = require('ethereum-address');
 

const User = require('../app/models/user');
/**
 * Expose
 */

module.exports = function (app, passport) {

let refsucc = '';
  app.get('/', function (req, res, next) {

    refsucc = req.query.r;
    res.render('index', { title: 'Cool, huh!', condition: true, anyArray: [1,2,3] });
  });

function getrefcode (hello) {
return new mongoose.Types.ObjectId();

}

let eadd ;

  app.post('/', (req , res) => {
let refcode =  getrefcode( req.body.address);
// console.log(refsucc+"refsuccess");
eadd = req.body.address;


    const user = new User({
ethaddress:  eadd,
_id : refcode,
points : '0'

    });
    if (ethereum_address.isAddress(eadd)) {
      console.log('Valid ethereum address.');
      User.findOne({ ethaddress : eadd }).exec().then(doc => {

        refcode =   doc._id;

      }).catch(err => {
      

        user.save().then(result => {
          console.log( 'save result' + result);
          
          if (refsucc){
          
          
            let temppoint;
          
            User.findOne({ _id : refsucc }).exec().then(doc => {
          
              temppoint = +doc.points;
          
              if (temppoint){
          let poi = temppoint + 1;
                User.update( { _id : refsucc } , { $set : { points : poi.toString() } } ).exec().then( res => { console.log(res);  }).catch(err => console.log(err));
              }
          
            }  ).catch(err => { console.log(err) ;
            
            });
          
           
          } 
          
          
          res.json({ 'url' : '/' + refcode });
              }).catch(err => {
                res.json({ 'url' : '/' + refcode });
              
                console.log(err);});


        console.log(err);});
   

      
      
    

  }
  else {
    console.log('Invalid Ethereum address.');
    res.json( { 'code':101,'msg':'Please enter a valid ETH wallet address!' } );
  }

});



  app.get('/:dynamicroute', function ( req,res) {
   // res.send({ "param" : req.params.dynamicroute });
   let dyn = req.params.dynamicroute ;
let invited = 0 ;
let  earned = 0;


   User.findOne({

    _id : dyn
   }).exec().then(doc => {
console.log(doc);

if ( doc.points){
  invited = +doc.points - 1;
earned = 200 + 120 * (invited);
}
res.render('step2', { code: req.params.dynamicroute ,  invited : invited , earned : earned  });
   }).catch(err => {   res.redirect('/');  console.log(err) ;
  
  });

   
});

  // app.get('/', home.index);

  /**
   * Error handling
   */

  app.use(function (err, req, res, next) {
    // treat as 404
    if (err.message
      && (~err.message.indexOf('not found')
      || (~err.message.indexOf('Cast to ObjectId failed')))) {
      return next();
    }
    console.error(err.stack);
    // error page
    res.status(500).render('error', { error: err.stack });
  });

  // assume 404 since no middleware responded
  app.use(function (req, res, next) {
    res.status(404).render('error', {
      url: req.originalUrl,
      error: 'Not found'
    });
  });
};
