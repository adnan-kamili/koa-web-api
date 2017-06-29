"use strict";

process.env.NODE_ENV = 'testing';
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const should = chai.should();

chai.use(chaiHttp);

const baseUrl = '/v1/users';
let resourceUrl = null;
const keys = ['id', 'email', 'name', 'lastLogin', 'tenantId', 'roles', 'createdAt', 'updatedAt'];

describe('Users', () => {
    before((done) => {
        setTimeout(() => done(), 10000);
    });
    describe('/POST user', () => {
        it('it should not POST a user without required fields', (done) => {
            const user = {
                name: "test user",
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
                name: "test user",
                email: `test.user+${Date.now()}@gmail.com`,
                password: "password1",
                roles: []
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
    describe('/PATCH/:id user', () => {
        it('it should UPDATE a user given the id', (done) => {
            const user = {
                name: "test user",
                roles: []
            }
            chai.request(app).
                patch(resourceUrl).
                send(user).
                end((err, res) => {
                    res.should.have.status(204);
                    done();
                });
        });
    });
    describe('/DELETE/:id user', () => {
        it('it should DELETE a user given the id', (done) => {
            chai.request(app).
                delete(resourceUrl).
                end((err, res) => {
                    res.should.have.status(204);
                    done();
                });
        });
    });
});
