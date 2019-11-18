/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
/* eslint-disable indent */
const { expect } = require('chai');
const request = require('supertest');
const fs = require('fs');
const app = require('../server');

const baseUrl = '/api/v1';
describe('Team work: Other Routes', () => {
    const validUserCredential = {
      email: 'admin@gmail.com',
      password: 'password',
    };

    let token = '';
    before((done) => {
        request(app)
        .post(`${baseUrl}/auth/signin`)
        .send(validUserCredential)
        .end((err, response) => {
        // parse token from the 'response'
            const result = JSON.parse(response.text);
            token = result.data.token;
            userId = result.data.userId;
            done();
        });
    });

    describe('gifs', () => {
        describe('/POST gif', () => {
            it('should create gif', (done) => {
                request(app).post(`${baseUrl}/gifs`)
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .set('Authorization', `Bearer ${token}`)
                .field('title', 'Test Title')
                .attach('image', fs.readFileSync('test/image/love.png'), 'love.png')

                .end((err, res) => {
                    expect(res.body).to.be.an('object');
                    expect(res.statusCode).to.equal(201);// status
                    expect(res.body.status).to.equal('success');
                    expect(res.body.data).to.have.property('gifId');
                    expect(res.body.data).to.have.property('message');
                    expect(res.body.data).to.have.property('createdOn');
                    expect(res.body.data).to.have.property('title');
                    expect(res.body.data).to.have.property('imageUrl');
                    // done();
                });
                done();
            });
        });

        describe('/DELETE gif', () => {
            it('should delete gifs', (done) => {
                // create the gif to delete
                request(app).post(`${baseUrl}/gifs`)
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .set('Authorization', `Bearer ${token}`)
                .field('title', 'Test Title')
                .attach('image', fs.readFileSync('test/image/love.png'), 'love.png')
                .end((err, response) => {
                    const result = JSON.parse(response.text);
                    const { gifId } = result.data;

                    request(app).delete(`${baseUrl}/gifs/${gifId}`)
                    .set('Authorization', `Bearer ${token}`)
                    .end((err, res) => {
                        expect(res.body).to.be.an('object');
                        expect(res.statusCode).to.equal(200);// status
                        expect(res.body.status).to.equal('success');
                        expect(res.body.data).to.have.property('message');
                        done();
                    });
                });
            });
        });
    });

    // TESTS FOR ARTICLES
    describe('articles', () => {
        describe('/POST article', () => {
            it('should create articles', (done) => {
                request(app).post(`${baseUrl}/articles`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: 'Test Article',
                    article: 'Sample Article is set here',
                })
                .end((err, res) => {
                    expect(res.body).to.be.an('object');
                    expect(res.statusCode).to.equal(201);// status
                    expect(res.body.status).to.equal('success');
                    expect(res.body.data).to.have.property('message');
                    expect(res.body.data).to.have.property('articleId');
                    expect(res.body.data).to.have.property('createdOn');
                    expect(res.body.data).to.have.property('title');
                    done();
                });
            });
        });

        describe('/PATCH/:id', () => {
            it('should update an article by id', (done) => {
                // first create the article to be updated
                request(app)
                .post(`${baseUrl}/articles`)
                .set('Authorization', `Bearer ${token}`)
                .send({ title: 'Article Title', article: 'Article Boody' })
                .end((err, response) => {
                    const result = JSON.parse(response.text);
                    const { articleId } = result.data; // object destructuring

                    request(app).patch(`${baseUrl}/articles/${articleId}`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({
                        title: 'Updated Title',
                        article: 'Updated Article',
                    })
                    .end((err, res) => {
                        expect(res.body).to.be.an('object');
                        expect(res.statusCode).to.equal(200);
                        expect(res.body.status).to.equal('success');
                        expect(res.body.data).to.have.property('article').eql('Updated Article');
                        expect(res.body.data).to.have.property('title').eql('Updated Title');
                        done();
                    });
                });
            });
        });

        describe('/DELETE/:id', () => {
            it('should delete an article by id', (done) => {
                // first, create the article to be deleted
                request(app)
                .post(`${baseUrl}/articles`)
                .set('Authorization', `Bearer ${token}`)
                .send({ title: 'Article Title', article: 'Article Boody' })
                .end((err, response) => {
                    const result = JSON.parse(response.text);
                    const { articleId } = result.data;

                    request(app).delete(`${baseUrl}/articles/${articleId}`)
                    .set('Authorization', `Bearer ${token}`)
                    .end((err, res) => {
                        expect(res.body).to.be.an('object');
                        expect(res.statusCode).to.equal(200);// status
                        expect(res.body.status).to.equal('success');
                        expect(res.body.data).to.have.property('message');
                        done();
                    });
                });
            });
        });
    });

    describe('Comments', () => {
        describe('POST /articles/:articleId/comment', () => {
            it('should create a comment for a particular article', (done) => {
                // first, create the article to comment on
                request(app)
                .post(`${baseUrl}/articles`)
                .set('Authorization', `Bearer ${token}`)
                .send({ title: 'Article Title', article: 'Article Boody' })
                .end((err, response) => {
                    const result = JSON.parse(response.text);
                    const { articleId } = result.data;

                    request(app).delete(`${baseUrl}/articles/${articleId}/comment`)
                    .set('Authorization', `Bearer ${token}`)
                    .end((err, res) => {
                        expect(res.body).to.be.an('object');
                        expect(res.statusCode).to.equal(200);// status
                        expect(res.body.status).to.equal('success');
                        expect(res.body.data).to.have.property('message');
                        expect(res.body.data).to.have.property('createOn');
                        expect(res.body.data).to.have.property('articleTitle');
                        expect(res.body.data).to.have.property('article');
                        expect(res.body.data).to.have.property('comment');
                        done();
                    });
                });
            });
        });

        describe('POST /gifs/:gifId/comment', () => {
            it('should create a comment for a particular article', (done) => {
                // first, create the gif to comment on
                request(app).post(`${baseUrl}/gifs`)
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .set('Authorization', `Bearer ${token}`)
                .field('title', 'Test Title')
                .attach('image', fs.readFileSync('test/image/love.png'), 'love.png')
                .end((err, response) => {
                    const result = JSON.parse(response.text);
                    const { gifId } = result.data;

                    request(app).post(`${baseUrl}/gifs/${gifId}/comment`)
                    .set('Authorization', `Bearer ${token}`)
                    .end((_err, res) => {
                        expect(res.body).to.be.an('object');
                        expect(res.statusCode).to.equal(200);// status
                        expect(res.body.status).to.equal('success');
                        expect(res.body.data).to.have.property('message');
                        expect(res.body.data).to.have.property('createOn');
                        expect(res.body.data).to.have.property('gifTitle');
                        expect(res.body.data).to.have.property('comment');
                        done();
                    });
                });
            });
        });
    });
});
