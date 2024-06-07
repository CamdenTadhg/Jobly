"use strict";
process.env.NODE_ENV === "test"

const request = require("supertest");

const db = require("../db");
const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u3Token
} = require("./_testCommon");

let librarianId;

beforeAll(async () => {
    await commonBeforeAll()
    const librarian = await db.query(`SELECT id FROM jobs WHERE title = 'librarian`);
    librarianId = librarian.rows[0].id;
});
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /jobs */

describe("POST /jobs", function () {
  const newJob = {
    title: "new job",
    salary: 50000,
    equity: 0,
    companyHandle: 'c1'
  };

  test("ok for admins", async function () {
    const resp = await request(app)
        .post("/jobs")
        .send(newJob)
        .set("authorization", `Bearer ${u3Token}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      job: {
        id: expect.any(Number),
        title: "new job",
        salary: 50000,
        equity: "0",
        companyHandle: "c1"
      }
    });
  });

  test('forbidden for users', async function(){
    const resp = await request(app)
      .post('/jobs')
      .send(newJob)
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(403);
  })

  test('unauth for anonymous', async function(){
    const resp = await request(app)
      .post('/jobs')
      .send(newJob)
    expect(resp.statusCode).toEqual(401);
  })

  test("bad request with missing data", async function () {
    const resp = await request(app)
        .post("/jobs")
        .send({
          salary: 10000,
          companyHandle: 'c3'
        })
        .set("authorization", `Bearer ${u3Token}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with invalid data", async function () {
    const resp = await request(app)
        .post("/jobs")
        .send({
          ...newCompany,
          salary: "not-a-salary",
        })
        .set("authorization", `Bearer ${u3Token}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** GET /jobs */

describe("GET /jobs", function () {
  test("ok for anon", async function () {
    const resp = await request(app).get("/jobs");
    expect(resp.body).toEqual({
      jobs:
          [
            {
              id: expect.any(Number),  
              title: 'arborist', 
              salary: 55000,
              equity: "0", 
              companyHandle: 'c3'
            },
            {
              id: expect.any(Number),
              title: 'software engineer', 
              salary: 150000,
              equity: "0.356",
              companyHandle: 'c2'
            },
            {
              id: expect.any(Number),
              title: 'librarian', 
              salary: 75000,
              equity: "0",
              companyHandle: 'c1'
            }
          ]
    });
  });


  test('filter by all three', async function(){
    const resp = await request(app).get("/jobs?title=engineer&minSalary=1000&equity=true")
    expect(resp.body).toEqual({
      companies:
          [
            {
                id: expect.any(Number),
                title: 'software engineer', 
                salary: 150000,
                equity: "0.356",
                companyHandle: 'c2'
            }
          ]
    });
  });

  test('fails: extraneous filters', async function(){
    const resp = await request(app).get("/jobs?title=soft&state=CA");
    expect(resp.statusCode).toEqual(400);
  });

  test('fails: wrong data type', async function(){
    const resp = await request(app).get('/jobs?name=soft&minSalary=b');
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** GET /jobs/:handle */

describe("GET /jobs/:id", function () {
  test("works for anon", async function () {
    const resp = await request(app).get(`/jobs/${librarianId}`);
    expect(resp.body).toEqual({
      job: {
        id: librarianId,
        title: 'librarian', 
        salary: 75000,
        equity: "0",
        company: {
            handle: 'c1',
            name: 'C1', 
            numEmployees: 1,
            description: 'Desc1',
            logoUrl: "http://c1.img"
        }
      }
    });
  });

  test("not found for no such job", async function () {
    const resp = await request(app).get(`/jobs/0`);
    expect(resp.statusCode).toEqual(404);
  });
});

/************************************** PATCH /jobs/:handle */

describe("PATCH /jobs/:handle", function () {
  test("works for admins", async function () {
    const resp = await request(app)
        .patch(`/jobs/${librarianId}`)
        .send({
          title: "senior librarian",
        })
        .set("authorization", `Bearer ${u3Token}`);
    expect(resp.body).toEqual({
      job: {
        id: librarianId,
        title: "senior librarian",
        salary: 75000,
        equity: "0",
        company: {
            handle: 'c1',
            name: 'C1', 
            numEmployees: 1,
            description: 'Desc1',
            logoUrl: "http://c1.img"
        }
      }
    });
  });

  test('forbidden for users', async function(){
    const resp = await request(app)
      .patch('/jobs/librarianId')
      .send({
        title: "senior librarian"
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(403);
  })

  test("unauth for anon", async function () {
    const resp = await request(app)
        .patch(`/jobs/librarianId`)
        .send({
          title: "senior librarian",
        });
    expect(resp.statusCode).toEqual(401);
  });

  test("not found on no such company", async function () {
    const resp = await request(app)
        .patch(`/jobs/0`)
        .send({
          name: "new nope",
        })
        .set("authorization", `Bearer ${u3Token}`);
    expect(resp.statusCode).toEqual(404);
  });

  test("bad request on company change attempt", async function () {
    const resp = await request(app)
        .patch(`/jobs/${libraianId}`)
        .send({
          companyHandle: "c1-new",
        })
        .set("authorization", `Bearer ${u3Token}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request on id change attempt", async function (){
    const resp = await request(app)
        .patch(`/jobs/${librarianId}`)
        .send({
            id: 136
        })
        .set("authorization", `Bearer ${u3Token}`);
    expect(resp.statusCode).toEqual(400);
  })

  test("bad request on invalid data", async function () {
    const resp = await request(app)
        .patch(`/jobs/${librarianId}`)
        .send({
          salary: 'not-a-salary'
        })
        .set("authorization", `Bearer ${u3Token}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** DELETE /jobs/:handle */

describe("DELETE /jobs/:handle", function () {
  test("works for admins", async function () {
    const resp = await request(app)
        .delete(`/jobs/${librarianId}`)
        .set("authorization", `Bearer ${u3Token}`);
    expect(resp.body).toEqual({ deleted: librarianId });
  });

  test('forbidden for users', async function() {
    const resp = await request(app)
      .delete(`/jobs/${librarianId}`)
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(403);
  })

  test("unauth for anon", async function () {
    const resp = await request(app)
        .delete(`/jobs/${librarianId}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found for no such job", async function () {
    const resp = await request(app)
        .delete(`/jobs/0`)
        .set("authorization", `Bearer ${u3Token}`);
    expect(resp.statusCode).toEqual(404);
  });
});