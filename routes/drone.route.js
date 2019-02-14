/**
 * Module dependencies.
 */
const express = require('express');
const router = express.Router();
const drone_controller = require('../controllers/drone.controller');


/**
 * Drone routers
 */

router.post('/create', drone_controller.drone_create);
router.get('/list', drone_controller.drone_list);
router.delete('/:id/delete', drone_controller.drone_delete);



module.exports = router;