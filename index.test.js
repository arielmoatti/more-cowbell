const supertest = require("supertest");
const { app } = require("./index.js");
// jest automatically looks in our mock folder for 'cookie-session'
const cookieSession = require("cookie-session");

test("1. logged-out user: GET /petition redirects to /register", () => {
    cookieSession.mockSessionOnce();
    return supertest(app)
        .get("/petition")
        .then((res) => {
            expect(res.headers.location).toBe("/register");
            expect(res.statusCode).toBe(302);
        });
});

test("2a. logged user: GET /register redirects to /petition", () => {
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

test("2b. logged user: GET /petition redirects to /thank-you", () => {
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

test("3. logged user, signed: GET /petition redirects to /thank-you", () => {
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

test("4a. logged user, not signed: GET /thank-you redirects to /petition", () => {
    cookieSession.mockSessionOnce({
        userId: 1,
    });
    return supertest(app)
        .get("/thank-you")
        .then((res) => {
            expect(res.headers.location).toBe("/petition");
            expect(res.statusCode).toBe(302);
        });
});

test("4b. logged user, not signed: GET /signerslist redirects to /petition", () => {
    cookieSession.mockSessionOnce({
        userId: 1,
    });
    return supertest(app)
        .get("/signerslist")
        .then((res) => {
            expect(res.headers.location).toBe("/petition");
            expect(res.statusCode).toBe(302);
        });
});
