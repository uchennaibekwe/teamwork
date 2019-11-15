/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
/* eslint-disable indent */
const { expect } = require('chai');
const request = require('supertest');
const app = require('../server');

describe('Team work: Other Routes', () => {
    const validUserCredential = {
      email: 'admin@gmail.com',
      password: 'password',
    };

    let token = '';
    before((done) => {
    request(app)
        .post('/api/v1/auth/signin')
        .send(validUserCredential)
        .end((err, response) => {
        // parse token from the 'response'
        const result = JSON.parse(response.text);
        token = result.token;
        done();
        });
    });

    // describe('## ')
    it('should create gif', (done) => {
        request(app).post('/api/v1/create-gif')
            .set('Authorization', `Bearer ${token}`).end((err, res) => {
            expect(res.statusCode).to.equal(200);
            done();
        });
    });
});
