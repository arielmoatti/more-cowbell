const supertest = require("supertest");
const { app } = require("./index.js");
// jest automatically looks in our mock folder for 'cookie-session'
const cookieSession = require("cookie-session");

test("1. user logout: GET /petition redirects to /register", () => {
    cookieSession.mockSessionOnce();
    return supertest(app)
        .get("/petition")
        .then((res) => {
            expect(res.headers.location).toBe("/register");
            expect(res.statusCode).toBe(302);
        });
});

test("2a. user login: GET /register redirects to /petition", () => {
    cookieSession.mockSessionOnce({
        userId: 1,
    });
    return supertest(app)
        .get("/register")
        .then((res) => {
            expect(res.headers.location).toBe("/petition");
            expect(res.statusCode).toBe(302);
        });
});

test("2b. user login: GET /petition redirects to /thank-you", () => {
    cookieSession.mockSessionOnce({
        userId: 1,
    });
    return supertest(app)
        .get("/login")
        .then((res) => {
            expect(res.headers.location).toBe("/petition");
            expect(res.statusCode).toBe(302);
        });
});

test.only("3. user login, signed: GET /petition redirects to /thank-you", () => {
    cookieSession.mockSessionOnce({
        userId: 1,
        signed: true,
    });
    return supertest(app)
        .get("/petition")
        .then((res) => {
            expect(res.headers.location).toBe("/thank-you");
            expect(res.statusCode).toBe(302);
        });
});

test.only("3. user login, signed: GET /petition redirects to /thank-you", () => {
    cookieSession.mockSessionOnce({
        userId: 1,
        signed: true,
    });
    return supertest(app)
        .get("/petition")
        .then((res) => {
            expect(res.headers.location).toBe("/thank-you");
            expect(res.statusCode).toBe(302);
        });
});
