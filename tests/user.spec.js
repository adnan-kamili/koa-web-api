"use strict";

process.env.NODE_ENV = 'testing';
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const should = chai.should();

chai.use(chaiHttp);

const baseUrl = '/v1/users';
let resourceUrl = null;
const keys = ['id', 'email', 'name', 'lastLogin', 'tenantId', 'createdAt', 'updatedAt'];

describe('Users', () => {
    before((done) => {
        setTimeout(() => done(), 10000);
    });
    describe('/POST user', () => {
        it('it should not POST a user without required fields', (done) => {
            const user = {
                name: "Adnan Kamili",
                email: "incorrect email"
            }
            chai.request(app).
                post(baseUrl).
                send(user).
                end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    done();
                });
        });
        it('it should POST a user ', (done) => {
            const user = {
                name: "Adnan Kamili",
                email: `adnan.kamili+${Date.now()}@gmail.com`,
                password: "password1"
            }
            chai.request(app).
                post(baseUrl).
                send(user).
                end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    resourceUrl = res.headers.location;
                    done();
                });
        });
    });
    describe('/GET/:id user', () => {
        it('it should GET a user by the given id', (done) => {
            chai.request(app).
                get(resourceUrl).
                end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.all.keys(...keys);
                    done();
                });
        });
    });
    describe('/GET user', () => {
        it('it should GET all the users', (done) => {
            chai.request(app).
                get(baseUrl).
                end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body[0].should.have.all.keys(...keys);
                    done();
                });
        });
    });
    describe('/PUT/:id user', () => {
        it.skip('it should UPDATE a user given the id', (done) => {
            const user = {
                title: "The Chronicles of Narnia",
                author: "C.S. Lewis",
                year: 1948,
                pages: 778
            }
            user.save((err, user) => {
                chai.request(app).
                    put(resourceUrl).
                    send({
                        title: "The Chronicles of Narnia",
                        author: "C.S. Lewis",
                        year: 1950,
                        pages: 778
                    }).
                    end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message').eql('user updated!');
                        res.body.user.should.have.property('year').eql(1950);
                        done();
                    });
            });
        });
    });

    /*
     * Test the /DEconstE/:id route
     */
    describe('/DEconstE/:id user', () => {
        it.skip('it should DEconstE a user given the id', (done) => {
            const user = {
                title: "The Chronicles of Narnia",
                author: "C.S. Lewis",
                year: 1948,
                pages: 778
            }
            user.save((err, user) => {
                chai.request(app).
                    deconste(resourceUrl).
                    end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message').eql('user successfully deconsted!');
                        res.body.result.should.have.property('ok').eql(1);
                        res.body.result.should.have.property('n').eql(1);
                        done();
                    });
            });
        });
    });
});
