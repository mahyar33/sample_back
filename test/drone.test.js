process.env.MONGODB_URI = "mongodb://mahyar:Mahyar123@ds163418.mlab.com:63418/db_test_test";
process.env.NODE_ENV = 'test';
let mongoose = require("mongoose");
let Drone = require('../models/drone.model');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../bin/www');
const droneService = require("../services/drone.service");
let should = chai.should();
chai.use(chaiHttp);


describe('Drones', () => {
    before((done) => { //Before test we empty the database
        Drone.remove({}, (err) => {
            done();
        });
    });
    /*
      * Test the /GET route
      */
    describe('/GET drone', () => {
        it('it should GET all the drones', (done) => {
            chai.request(server)
                .get('/drones/list')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    res.body.data.length.should.be.eql(0);
                    done();
                });
        });
    });
    /*
      * Test the /POST route
      */
    describe('/POST drone', () => {
        it('it should not POST a drone with wrong quadrant', (done) => {
            let drone = {
                x: 12.34,
                y: 12.43,
                quadrant: 1954
            }
            chai.request(server)
                .post('/drones/create')
                .send(drone)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.an('object');
                    res.body.should.have.property('message')
                    done();
                });
        });
        it('it should POST a drone ', (done) => {
            let drone = {
                x: 12.34,
                y: 12.43,
                quadrant: 3
            }
            chai.request(server)
                .post('/drones/create')
                .send(drone)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Product Created successfully');
                    done();
                });
        });
    });
    /*
     * Test the /DELETE route
     */
    describe('/DELETE drone', () => {
        it('it should DELETE a drone given the id', (done) => {
            let drone = new Drone(
                {
                    position: {x: 12.34, y: 12.43},
                    quadrant: 3
                }
            )
            drone.save((err, drone) => {
                chai.request(server)
                    .delete(`/drones/${drone._id}/delete`)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.an('object');
                        res.body.should.have.property('message').eql('Deleted successfully!');
                        done();
                    });
            });
        });
    });
    /*
    * Check initialization
    */
    describe('check initialize drone', () => {
        it('it should generate 20 drones', (done) => {
            Drone.collection.drop();
            droneService.initializeDatabase(() => {
                droneService.dronesList((result) => {
                    result.should.to.have.length(20);
                    done()
                });
            });

        });
    });

    /*
     * Check movement
     */
    describe('check movement drone', () => {
        it('it should change the x,y of drone', (done) => {
            droneService.dronesList((beforeMov) => {
                droneService.movement();
                setTimeout(() => {
                    droneService.dronesList((afterMov) => {
                        afterMov[0].x.should.not.equal(beforeMov[0].x);
                        done()
                    });
                }, 1000)

            });
        });
    });
    /*
        * Check 404
        */
    describe('check 404 response', () => {
        it('it should be 404', (done) => {
            chai.request(server)
                .post('/drones/creat')
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
    });

});