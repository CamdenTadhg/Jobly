"use strict";
process.env.NODE_ENV === "test"

const jwt = require("jsonwebtoken");
const { UnauthorizedError, ForbiddenError } = require("../expressError");
const {
  authenticateJWT,
  ensureLoggedIn,
  ensureAdmin,
  ensureAdminOrSelf
} = require("./auth");

process.env.NODE_ENV === "test"


const { SECRET_KEY } = require("../config");
const testJwt = jwt.sign({ username: "test", isAdmin: false }, SECRET_KEY);
const badJwt = jwt.sign({ username: "test", isAdmin: false }, "wrong");


describe("authenticateJWT", function () {
  test("works: via header", function () {
    expect.assertions(2);
     //there are multiple ways to pass an authorization token, this is how you pass it in the header.
    //this has been provided to show you another way to pass the token. you are only expected to read this code for this project.
    const req = { headers: { authorization: `Bearer ${testJwt}` } };
    const res = { locals: {} };
    const next = function (err) {
      expect(err).toBeFalsy();
    };
    authenticateJWT(req, res, next);
    expect(res.locals).toEqual({
      user: {
        iat: expect.any(Number),
        username: "test",
        isAdmin: false,
      },
    });
  });

  test("works: no header", function () {
    expect.assertions(2);
    const req = {};
    const res = { locals: {} };
    const next = function (err) {
      expect(err).toBeFalsy();
    };
    authenticateJWT(req, res, next);
    expect(res.locals).toEqual({});
  });

  test("works: invalid token", function () {
    expect.assertions(2);
    const req = { headers: { authorization: `Bearer ${badJwt}` } };
    const res = { locals: {} };
    const next = function (err) {
      expect(err).toBeFalsy();
    };
    authenticateJWT(req, res, next);
    expect(res.locals).toEqual({});
  });
});


describe("ensureLoggedIn", function () {
  test("works", function () {
    expect.assertions(1);
    const req = {};
    const res = { locals: { user: { username: "test", isAdmin: false } } };
    const next = function (err) {
      expect(err).toBeFalsy();
    };
    ensureLoggedIn(req, res, next);
  });

  test("unauth if no login", function () {
    expect.assertions(1);
    const req = {};
    const res = { locals: {} };
    const next = function (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    };
    ensureLoggedIn(req, res, next);
  });
});

describe('ensureAdmin', function(){
  test('works', function (){
    expect.assertions(1);
    const req = {};
    const res = {locals: {user: {username: "test", isAdmin: true}}};
    const next = function(err){
      expect(err).toBeFalsy();
    };
    ensureAdmin(req, res, next);
  });

  test('forbidden if not admin', function (){
    expect.assertions(1);
    const req = {};
    const res = {locals: {user: {username: "test", isAdmin: false}}};
    const next = function(err){
      expect(err instanceof ForbiddenError).toBeTruthy();
    };
    ensureAdmin(req, res, next);
  });
});

describe('ensureAdminOrSelf', function(){
  test('works for self', function(){
    expect.assertions(1);
    const req = {params: {username: 'u1'}};
    const res = {locals: {user: {username: 'u1', isAdmin: false}}};
    const next = function(err){
      expect(err).toBeFalsy();
    };
    ensureAdminOrSelf(req, res, next);
  });

  test('forbidden if user is not matching', function(){
    expect.assertions(1);
    const req = {params: {username: 'u2'}};
    const res = {locals: {user: {username: 'u1', isAdmin: false}}};
    const next = function(err){
      expect(err instanceof ForbiddenError).toBeTruthy();
    };
    ensureAdminOrSelf(req, res, next);
  });

  test('works for admin', function(){
    expect.assertions(1);
    const req = {params: {username: 'u1'}};
    const res = {locals: {user: {username: 'u3', isAdmin: true}}};
    const next = function(err){
      expect(err).toBeFalsy();
    };
    ensureAdminOrSelf(req, res, next);
  });
});
