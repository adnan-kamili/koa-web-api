"use strict";

process.env.NODE_ENV = 'testing';
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const should = chai.should();

chai.use(chaiHttp);

const baseUrl = '/v1/roles';
let resourceUrl = null;
const keys = ['id', 'name', 'description', 'tenantId', 'claims', 'createdAt', 'updatedAt'];

describe('Roles', () => {
    before((done) => {
        setTimeout(() => done(), 10000);
    });
    describe('/POST role', () => {
        it('it should not POST a role without required fields', (done) => {
            const role = {
                description: "incorrect role",
                claims: ['user:read']
            }
            chai.request(app).
                post(baseUrl).
                send(role).
                end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    done();
                });
        });
        it('it should POST a role ', (done) => {
            const role = {
                name: `role+${Date.now()}`,
                description: "correct role",
                claims: ['user:read']
            }
            chai.request(app).
                post(baseUrl).
                send(role).
                end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    resourceUrl = res.headers.location;
                    done();
                });
        });
    });
    describe('/GET/:id role', () => {
        it('it should GET a role by the given id', (done) => {
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
    describe('/GET role', () => {
        it('it should GET all the roles', (done) => {
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
    describe('/PATCH/:id role', () => {
        it('it should UPDATE a role given the id', (done) => {
            const role = {
                name: `role+${Date.now()}`,
                description: "correct role updated",
                claims: ['user:delete']
            }
            chai.request(app).
                patch(resourceUrl).
                send(role).
                end((err, res) => {
                    res.should.have.status(204);
                    done();
                });
        });
    });
    describe('/DELETE/:id role', () => {
        it('it should DELETE a role given the id', (done) => {
            chai.request(app).
                delete(resourceUrl).
                end((err, res) => {
                    res.should.have.status(204);
                    done();
                });
        });
    });
});
