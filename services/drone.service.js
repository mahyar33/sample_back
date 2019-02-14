/**
 * Module dependencies.
 */
const Drone = require('../models/drone.model');


/**
 * Initialize database and create 20 drones
 */
exports.initializeDatabase = (callback) => {
    Drone.db.db.listCollections({name: 'drones'})
        .next((err, collInfo) => {
            if (!collInfo) {
                generateDrone(20, callback)
            } else {
                if (callback)
                    callback()
            }
        });
};

/**
 * Delete drone by id
 */
exports.droneDelete = (id, callback) => {
    Drone.findByIdAndRemove(id, (err) => {
        callback(err)

    })
};
/**
 * Creat drone
 */
exports.droneCreate = (drone, callback) => {
    if (isNaN(Number(drone.x)) || isNaN(Number(drone.y)) ||isNaN(Number(drone.quadrant))) {
        let err = new Error(`bad request`);
        err.statusCode = 400;
        return callback(err)
    }
    let droneModel = new Drone(
        {
            quadrant: drone.quadrant,
            position: {x: parseFloat(drone.x).toFixed(2), y: parseFloat(drone.y).toFixed(2)}
        }
    );
    droneModel.save((err) => {
        if (err) {
            console.log('error', err.message);
        }
        return callback(err);
    })
};
/**
 * Get drones list
 */
exports.dronesList = (callback) => {
    Drone.find({}, (err, users) => {
        let userMap = [];
        if (users && users.length > 0)
            users.forEach((user) => {
                userMap.push({
                        id: user._id,
                        x: user.position.x.toString(),
                        y: user.position.y.toString(),
                        quadrant: user.quadrant
                    }
                )
            });
        callback(userMap)
    })
}

/**
 * Generate random Drone with position x,t between 0 ,200
 */
const generateDrone = (number, callback) => {
    let drones = [];
    for (let i = 0; i < number; i++)
        drones.push(new Drone(
            {
                quadrant: random(1, 4, false),
                position: {x: random(0, 200), y: random(0, 200)}
            }
        ));
    Drone.collection.insert(drones, (err) => {
        if (err) {
            console.log('error', err.message);

        } else {
            console.log("drones were successfully stored.");
        }
        if (callback)
            callback()
    });

}

/**
 * move Drones and if position x,y > 250 generate random position
 */
exports.movement = () => {
    Drone.find({}, (err, users) => {
        let userMap = {};
        if (users !== undefined && users.length > 0) {
            users.forEach(function (user) {
                let x, y;
                random(0, 1) ? x = random(user.position.x, user.position.x + 20) : x = random(user.position.x - 20, user.position.x);
                random(0, 1) ? y = random(user.position.y, user.position.y + 20) : y = random(user.position.y - 20, user.position.y);
                if (x < 0)
                    x = user.position.x;
                if (y < 0)
                    y = user.position.y;
                if (x > 250)
                    x = random(0, 200);
                if (y > 250)
                    y = random(0, 200);
                user.position = {x, y};
                Drone.findByIdAndUpdate(user._id, {position: user.position}, {useFindAndModify: false}, (err, doc) => {
                    if (err) console.log(err)
                });
                userMap[user._id] = user;
            });
        }

    })
}

/**
 * generate random number
 */
const random = (min, max, isFloat = true) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    if (isFloat)
        return ((Math.random() * (max - min + 1)) + min).toFixed(2);
    else
        return Math.floor(Math.random() * (max - min + 1)) + min;

}
