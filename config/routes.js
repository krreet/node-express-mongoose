'use strict';

/**
 * Module dependencies.
 */

const home = require('../app/controllers/home');

/**
 * Expose
 */

module.exports = function (app, passport) {


  app.get('/', function (req, res, next) {
    res.render('index', { title: 'Cool, huh!', condition: true, anyArray: [1,2,3] });
  });



  app.post('/', (req , res) => {

    let address = req.body.address;
    res.json({ 'url' : '/tuytdudgfd' });

  });



  app.get('/:dynamicroute', function ( req,res) {
   // res.send({ "param" : req.params.dynamicroute });

    res.render('step2', { code: req.params.dynamicroute ,  invited : 5 , earned : 400  });
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
