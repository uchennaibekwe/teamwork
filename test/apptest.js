/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
/* eslint-disable indent */
const { expect } = require('chai');
const request = require('supertest');
const app = require('../server');

describe('Team work', () => {
    const validUserCredential = {
      email: 'admin@gmail.com',
      password: 'password',
    };

    // const userCredentials = {
    //   firstname: 'Uchenna',
    //   lastname: 'Ibekwe',
    //   email: 'anothertesteremployee@gmail.com',
    //   password: 'password',
    //   gender: 'male',
    //   jobrole: 'product manager',
    //   department: 'ICT',
    //   address: '1, Umechukwu Street',
    // };

    // describe('# User Account', () => {
    //   it('should create a user', (done) => {
    //     request(app).post('/api/v1/auth/create-user').send(userCredentials).end((err, res) => {
    //         expect(res.body).to.be.an('object');
    //         expect(res.statusCode).to.equal(201);
    //         expect(res.body.status).to.equal('success');
    //         expect(res.body.data).to.have.property('token');
    //         expect(res.body.data).to.have.property('userId');
    //         expect(res.body.data).to.have.property('message');
    //       done();
    //     });
    //   });

    it('should log in a user', (done) => {
      request(app).post('/api/v1/auth/signin').send(validUserCredential).end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.statusCode).to.equal(200);
        expect(res.body.status).to.equal('success');
        expect(res.body.data).to.have.property('token');
        expect(res.body.data).to.have.property('userId');
        done();
      });
    });
});
