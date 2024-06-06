"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for jobs. */

class Job {
  /** Create a job (from data), update db, return new job data.
   *
   * data should be { title, salary, equity, companyHandle }
   *
   * Returns { id, title, salary, equity, companyHandle }
   * */

  static async create({ title, salary, equity, companyHandle }) {

    const result = await db.query(
          `INSERT INTO jobs
           (title, salary, equity, company_handle)
           VALUES ($1, $2, $3, $4)
           RETURNING id, title, salary, equity, company_handle AS "companyHandle"`,
        [
          title,
          salary,
          equity,
          companyHandle
        ],
    );
    const job = result.rows[0];

    return job;
  }

  /** Find all jobs.
   *
   * Returns [{ id, title, salary, equity, companyHandle }, ...]
   * */

  static async findAll() {
    const jobsRes = await db.query(
          `SELECT id,
                  title,
                  salary,
                  equity,
                  company_handle AS "companyHandle"
           FROM jobs
           ORDER BY id DESC`);
    return jobsRes.rows;
  }

  /** Filters from all jobs based title, minSalary, hasEquity
   * 
   * filters can include {title, minSalary, hasEquity}
   * 
   * returns [{id, title, salary, equity, companyHandle}, ...]
   */

  static async filter(filters){
    let queries = []
    let values = []
    let idx = 1;
    if (filters.title){
      queries.push(`title ILIKE $${idx}`);
      values.push(`%${filters.title}%`)
      idx++;
    }
    if (filters.minSalary){
      queries.push(`salary >= $${idx}`);
      values.push(filters.minSalary)
      idx++;
    }
    if (filters.hasEquity){
      queries.push(`equity > 0`);
    }
    const query = queries.join(' AND ');
    const jobsRes = await db.query(
          `SELECT id, 
                  title,
                  salary,
                  equity, 
                  company_handle AS "companyHandle"
          FROM jobs
          WHERE ${query} 
          ORDER BY id DESC`, values);
    return jobsRes.rows;
  }

  /** Given a job id, return data about job.
   *
   * Returns { id, title, salary, equity, company }
   *   where company is { handle, name, description, numEmployees, logoUrl }
   *
   * Throws NotFoundError if not found.
   **/

  static async get(id) {
    const jobRes = await db.query(
          `SELECT id,
                  title,
                  salary,
                  equity,
                  company_handle AS "companyHandle"
           FROM jobs
           WHERE id = $1`,
        [id]);
    if (jobRes.rows.length === 0) throw new NotFoundError(`No job with id of ${id}`);
    const companyHandle = jobRes.rows[0].companyHandle
    const job = {
      id: jobRes.rows[0].id,
      title: jobRes.rows[0].title,
      salary: jobRes.rows[0].salary,
      equity: jobRes.rows[0].equity
    };

    const companyRes = await db.query(
            `SELECT handle,
                    name,
                    num_employees AS "numEmployees",
                    description,
                    logo_url AS "logoUrl"
            FROM companies
            WHERE handle = $1`,
        [companyHandle]
    )
    job.company = companyRes.rows[0]
    return job;
  }

  /** Update job data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   *
   * Data can include: {title, salary, equity}
   *
   * Returns {id, title, salary, equity, companyHandle}
   *
   * Throws NotFoundError if not found.
   */

  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(
        data,
        {
          companyHandle: "company_handle"
        });
    const idVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE jobs 
                      SET ${setCols} 
                      WHERE id = ${idVarIdx} 
                      RETURNING id, 
                                title, 
                                salary, 
                                equity, 
                                company_handle AS "companyHandle"`;
    const result = await db.query(querySql, [...values, id]);
    console.log('result = ', result.rows)
    const job = result.rows[0];

    if (!job) throw new NotFoundError(`No job with id of ${id}`);

    return job;
  }

  /** Delete given job from database; returns undefined.
   *
   * Throws NotFoundError if job not found.
   **/

  static async remove(id) {
    const result = await db.query(
          `DELETE
           FROM jobs
           WHERE id = $1
           RETURNING id`,
        [id]);
    const job = result.rows[0];

    if (!job) throw new NotFoundError(`No job with id of ${id}`);
  }
}


module.exports = Job;