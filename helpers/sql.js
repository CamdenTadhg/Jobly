const { BadRequestError } = require("../expressError");

// description of input
// description of output
// description of errors

/** Helper function supporting update methods. Takes in partial data set for a resource 
 * and returns sections of a valid SQL update query. 
 * 
 * Input: 
 *  dataToUpdate: object with data values meant for updating a single resource
 *      example: {password: 'securepassword', email: 'theenbydeveloper@gmail.com'}
 *  jsToSql: object translating variable names from javascript convention to SQL convention
 *      example:{firstName: "first_name", lastName: "last_name", isAdmin: "is_admin"}
 * 
 * Output: 
 *  setCols: string in valid SQL of columns to update
 *      example: "password" = $1, "email" = $2
 *  values: object of values to update in same order as columns
 *      example: ['lasgdoiwonvwoihovihweovwioew', 'theenbydeveloper@gmail.com]
 * 
 * Errors: 
 * If an empty dataToUpdate object is passed into function, it returns a BadRequestError
 */

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );
  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };

/** GET /  =>
 *   { companies: [ { handle, name, description, numEmployees, logoUrl }, ...] }
 *
 * Can filter on provided search filters:
 * - minEmployees
 * - maxEmployees
 * - nameLike (will find case-insensitive, partial matches)
 *
 * Authorization required: none
 */