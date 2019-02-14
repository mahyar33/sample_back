/**
 * Module dependencies.
 */
const droneService = require("../services/drone.service");



/**
 * Create drone
 */
exports.drone_create =  (req, res, next)=> {
    let drone = {
        x: req.body.x,
        y: req.body.y,
        quadrant: req.body.quadrant
    };
    console.log(drone)
    droneService.droneCreate(drone,  (err) =>{
        if (err)
            return next(err);
        res.send({message: 'Product Created successfully'})
    })

};

/**
 * Delete drone
 */

exports.drone_delete =  (req, res, next) =>{
    droneService.droneDelete(req.params.id, function (err) {
        if (err) return next(err);
        res.send({message: 'Deleted successfully!'});
    })
};

/**
 * Get drone List
 */

exports.drone_list =  (req, res, next)=> {
    droneService.dronesList( (data) =>{
        res.send({message: 'ok', data: data});
    })

};


