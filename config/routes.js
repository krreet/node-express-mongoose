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
    res.render('index', { title: 'Cool, huh!', condition: true, anyArray: [1, 2, 3] });
  });

  function getrefcode(hello) {
    return new mongoose.Types.ObjectId();

  }

  let eadd;

  app.post('/', (req, res) => {
    let refcode = getrefcode(req.body.address);
    // console.log(refsucc+"refsuccess");
    eadd = req.body.address;


    let user = new User({
      ethaddress: eadd,
      _id: refcode,
      points: 0

    });
    if (ethereum_address.isAddress(eadd)) {
      console.log('Valid ethereum address.');


      //  User.findOneAndUpdate({ethaddress: eadd}, user, {upsert:true}, function(err, doc){

      User.findOne({ ethaddress: eadd }, function (err, result) {
        if (err) { console.log(err); res.json({ 'url': '/' + refcode }); }
        if (!result) {
          // do stuff here

          user.save().then(result => {
            console.log('save result' + result);
          
            if (refsucc) {


              let temppoint;
  
              User.findOne({ _id: refsucc }).exec().then(doc => {
  
                let temppoint = doc.points;
  
                if (temppoint) {
                  let poi = temppoint + 1;
                  User.update({ _id: refsucc }, { $set: { points: poi } }).exec().then(resu => {
                    console.log(resu);
  console.log(refcode+"  will be routed here");
                    res.json({ 'url': '/' + refcode });
  
                  }).catch(err => console.log(err));
                }
  
              }).catch(err => {
                console.log(err);
  
              });
  
  
            }


          
          }).catch(err => console.log(err));

         



        }
        
        else
        
        {
console.log(result+"already present");
refcode = result._id;

          res.json({ 'url': '/' + refcode });

        }
      });


     
    }

    else {
      console.log('Invalid Ethereum address.');
      res.json({ 'code': 101, 'msg': 'Please enter a valid ETH wallet address!' });
    }

  });
  // do something with the document

  /*  User.findOne({ ethaddress: eadd }).exec().then(doc => {

     refcode = doc._id;
     res.json({ 'url': '/' + refcode });


   }).catch(err => {


     user.save().then(result => {
       console.log('save result' + result);

       if (refsucc) {


         let temppoint;

         User.findOne({ _id: refsucc }).exec().then(doc => {

           temppoint = doc.points;

           if (temppoint) {
             let poi = temppoint + 1;
             User.update({ _id: refsucc }, { $set: { points: poi } }).exec().then(res => { console.log(res); }).catch(err => console.log(err));
           }

         }).catch(err => {
           console.log(err);

         });


       }


       res.json({ 'url': '/' + refcode });
     }).catch(err => {
       res.json({ 'url': '/' + refcode });

       console.log(err);
     });


     console.log(err);
   });






 }
 else {
   console.log('Invalid Ethereum address.');
   res.json({ 'code': 101, 'msg': 'Please enter a valid ETH wallet address!' });
 }

});
*/


  app.get('/:dynamicroute', function (req, res) {
    // res.send({ "param" : req.params.dynamicroute });
    let dyn = req.params.dynamicroute;

if(dyn != "favicon.ico"){



    let invited = 0;
    let earned = 0;


    User.findOne({

      _id: dyn
    }).exec().then(doc => {
      console.log(doc);

      if (doc.points) {
        invited = doc.points - 1;
        earned = 200 + 120 * (invited);
      }
      res.render('step2', { code: req.params.dynamicroute, invited: invited, earned: earned });
    }).catch(err => {
      res.redirect('/'); console.log(err);

    });

  }else{

    res.status(500).send('nOT FOUND');
  }
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
