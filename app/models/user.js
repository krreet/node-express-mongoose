
/*!
 * Module dependencies
 */

var mongoose = require('mongoose');
//var userPlugin = require('mongoose-user');
var Schema = mongoose.Schema;

/**
 * User schema
 */

var UserSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  ethaddress: { type : String , unique : true, required : true },
  // refcode: { type : String , unique : true, required : true },
  points: { type: String, default: 0 }
 
});

/**
 * User plugin
 */

//UserSchema.plugin(userPlugin, {});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */

UserSchema.method({

});

/**
 * Statics
 */

UserSchema.static({

});

/**
 * Register
 */

mongoose.model('User', UserSchema);

module.exports = mongoose.model('User' ,UserSchema );
