/* eslint-disable */
let Request = require('request');

describe("Server", () => {
    let server;
    beforeAll( () => {
        server = require('../server');
    });

    afterAll( () => {
        server.close();
    });

    describe("GET /", () => {
        let base_url = 'http://localhost:3000/api/v1';
        let data = {};
        beforeAll( (done) => {
            Request.post(`${base_url}/auth/create-user`, (err, res, body) => {
                data.status = res.statusCode;
                data.body = body;
                done();
            });
        });

        it("Status 200", () => {
            expect(data.status).toBe(200);
        });
        it("Body", () => {
            expect(data.body).toEqual(JSON.stringify({"data":{"message":"User"} }));
        });
    });
});
