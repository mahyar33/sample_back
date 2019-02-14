/**
 * Module dependencies.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Drone Schema.
 */
let DroneSchema = new Schema({
    quadrant: {type: Number, required: true, max: 4},
    position: {x:{type:Number  , required: true}, y:{type:Number  , required: true}}
});


// Export the model
module.exports = mongoose.model('Drone', DroneSchema);