"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError.js");
const Job = require("./job.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon.js");

process.env.NODE_ENV === "test"

let librarianId, engineerId, arboristId; 

beforeAll(async () => {
  await commonBeforeAll();
  const librarian = await db.query(`SELECT id FROM jobs WHERE title = 'librarian'`);
  librarianId = librarian.rows[0].id
  const engineer = await db.query(`SELECT id FROM jobs WHERE title = 'software engineer'`);
  engineerId = engineer.rows[0].id
  const arborist = await db.query(`SELECT id FROM jobs WHERE title = 'arborist'`);
  arboristId = arborist.rows[0].id
});
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
      const newjob = await db.query(`SELECT id FROM jobs WHERE title = 'new job'`);
      const newId = newjob.rows[0].id
      expect(job).toEqual({
        title: "new job",
        salary: 20000,
        equity: "0",
        companyHandle: 'c1',
        id: newId
      });
      const result = await db.query(
            `SELECT id, title, salary, equity, company_handle AS "companyHandle"
             FROM jobs
             WHERE title = 'new job'`);
      expect(result.rows).toEqual([
        {
            id: newId,
            title: "new job",
            salary: 20000,
            equity: "0",
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
          id: arboristId,
          title: "arborist",
          salary: 55000,
          equity: "0",
          companyHandle: 'c3'
        },        
        {
          id: engineerId,
          title: "software engineer",
          salary: 150000,
          equity: "0.356",
          companyHandle: 'c1'
        },
        {
          id: librarianId,
          title: "librarian",
          salary: 75000,
          equity: "0",
          companyHandle: 'c1'
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
            id: librarianId,
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
          id: engineerId,
          title: "software engineer",
          salary: 150000,
          equity: "0.356",
          companyHandle: 'c1'
        },
        {
            id: librarianId,
            title: "librarian",
            salary: 75000,
            equity: "0",
            companyHandle: 'c1'
        }
      ]);
    });
    test('works: filter by equity', async function(){
      let jobs = await Job.filter({hasEquity: true});
      expect(jobs).toEqual([
        {
            id: engineerId,
            title: "software engineer",
            salary: 150000,
            equity: "0.356",
            companyHandle: 'c1'
        }
      ]);
    });
    test('works: filter by false equity and minSalary', async function(){
        let jobs = await Job.filter({hasEquity: false, minSalary: 55000});
        expect(jobs).toEqual([
              {
                id: arboristId,
                title: "arborist",
                salary: 55000,
                equity: "0",
                companyHandle: 'c3'
              },
              {
                id: engineerId,
                title: "software engineer",
                salary: 150000,
                equity: "0.356",
                companyHandle: 'c1'
              },
              {
                id: librarianId,
                title: "librarian",
                salary: 75000,
                equity: "0",
                companyHandle: 'c1'
              }
        ]);
    });
  });
  
  
  /************************************** get */
  
  describe("get", function () {
    test("works", async function () {
      let job = await Job.get(librarianId);
      expect(job).toEqual({
        id: librarianId,
        title: "librarian",
        salary: 75000,
        equity: "0",
        company: {
            handle: 'c1',
            name: 'C1',
            numEmployees: 1, 
            description: 'Desc1',
            logoUrl: 'http://c1.img'
        }
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
        title: "senior librarian",
        salary: 85000,
        equity: "0"
      });
  
      const result = await db.query(
            `SELECT id, title, salary, equity, company_handle AS "companyHandle"
             FROM jobs
             WHERE id = ${librarianId}`);
      expect(result.rows).toEqual([{
        id: librarianId,
        title: "senior librarian",
        salary: 85000,
        equity: "0",
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
            `SELECT id, title, salary, equity, company_handle AS "companyHandle"
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