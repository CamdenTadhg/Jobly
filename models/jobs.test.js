"use strict";
process.env.NODE_ENV === "test"

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Job = require("./job.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  librarianId
} = require("./_testCommon");

process.env.NODE_ENV === "test"

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("create", function () {
    const newJob = {
      title: "new job",
      salary: 20000,
      equity: 0,
      companyHandle: 'c1'
    };
  
    test("works", async function () {
      let job = await Job.create(newJob);
      expect(job).toEqual(newJob);
  
      const result = await db.query(
            `SELECT title, salary, equity, companyHandle
             FROM jobs
             WHERE title = 'new job'`);
      expect(result.rows).toEqual([
        {
            title: "new job",
            salary: 20000,
            equity: 0,
            companyHandle: 'c1'
        }]);
    });
});
  
  /************************************** findAll */
  
  describe("findAll", function () {
    test("works: no filter", async function () {
      let jobs = await Job.findAll();
      expect(jobs).toEqual([
        {
          title: "librarian",
          salary: 75000,
          equity: "0",
          companyHandle: 'c1'
        },
        {
          title: "software engineer",
          salary: 150000,
          equity: "0.356",
          companyHandle: 'c2'
        },
        {
          title: "arborist",
          salary: 55000,
          equity: "0",
          companyHandle: 'c3'
        }
      ]);
    });
  });
  
  /************************************** filter */
  
  describe('filter', function() {
    test('works: filter by title', async function(){
      let jobs = await Job.filter({title: 'librarian'});
      expect(jobs).toEqual([
        {
            title: "librarian",
            salary: 75000,
            equity: "0",
            companyHandle: 'c1'
        }
      ]);
    });
    test('works: filter by minSalary', async function(){
      let jobs = await Job.filter({minSalary: 75000});
      expect(jobs).toEqual([
        {
            title: "librarian",
            salary: 75000,
            equity: "0",
            companyHandle: 'c1'
        },
        {
            title: "software engineer",
            salary: 150000,
            equity: "0.356",
            companyHandle: 'c2'
        }
      ]);
    });
    test('works: filter by equity', async function(){
      let jobs = await Job.filter({equity: true});
      expect(jobs).toEqual([
        {
            title: "software engineer",
            salary: 150000,
            equity: "0.356",
            companyHandle: 'c2'
        }
      ]);
    });
    test('works: filter by false equity and minSalary', async function(){
        let jobs = await Job.filter({equity: false, minSalary: 55000});
        expect(jobs).toEqual([
            {
                title: "librarian",
                salary: 75000,
                equity: "0",
                companyHandle: 'c1'
              },
              {
                title: "software engineer",
                salary: 150000,
                equity: "0.356",
                companyHandle: 'c2'
              },
              {
                title: "arborist",
                salary: 55000,
                equity: "0",
                companyHandle: 'c3'
              }
        ]);
    });
  });
  
  
  /************************************** get */
  
  describe("get", function () {
    test("works", async function () {
      let job = await Job.get(librarianId);
      expect(job).toEqual({
        title: "librarian",
        salary: 75000,
        equity: "0",
        companyHandle: 'c1'
      });
    });
  
    test("not found if no such job", async function () {
      try {
        await Job.get(0);
        fail();
      } catch (err) {
        expect(err instanceof NotFoundError).toBeTruthy();
      }
    });
  });
  
  /************************************** update */
  
  describe("update", function () {
    const updateData = {
      title: "senior librarian",
      salary: 85000,
      equity: 0
    };
  
    test("works", async function () {
      let job = await Job.update(librarianId, updateData);
      expect(job).toEqual({
        id: librarianId,
        companyHandle: 'c1',
        ...updateData
      });
  
      const result = await db.query(
            `SELECT id, title, salary, equity, company_handle
             FROM jobs
             WHERE id = ${librarianId}`);
      expect(result.rows).toEqual([{
        id: librarianId,
        title: "senior librarian",
        salary: 85000,
        equity: 0,
        companyHandle: "c1",
      }]);
    });
  
    test("works: null fields", async function () {
      const updateDataSetNulls = {
        title: "senior librarian",
        salary: null,
        equity: null
      };
  
      let job = await Job.update(librarianId, updateDataSetNulls);
      expect(job).toEqual({
        id: librarianId,
        companyHandle: 'c1',
        ...updateDataSetNulls,
      });
  
      const result = await db.query(
            `SELECT id, title, salary, equity, company_handle
            FROM jobs
            WHERE id = ${librarianId}`);
      expect(result.rows).toEqual([{
        id: librarianId,
        title: "senior librarian",
        salary: null,
        equity: null,
        companyHandle: 'c1'
      }]);
    });
  
    test("not found if no such job", async function () {
      try {
        await Job.update(0, updateData);
        fail();
      } catch (err) {
        expect(err instanceof NotFoundError).toBeTruthy();
      }
    });
  
    test("bad request with no data", async function () {
      try {
        await Job.update(librarianId, {});
        fail();
      } catch (err) {
        expect(err instanceof BadRequestError).toBeTruthy();
      }
    });
  });
  
  /************************************** remove */
  
  describe("remove", function () {
    test("works", async function () {
      await Job.remove(librarianId);
      const res = await db.query(
          `SELECT id FROM jobs WHERE id = ${librarianId}`);
      expect(res.rows.length).toEqual(0);
    });
  
    test("not found if no such job", async function () {
      try {
        await Job.remove(0);
        fail();
      } catch (err) {
        expect(err instanceof NotFoundError).toBeTruthy();
      }
    });
  });