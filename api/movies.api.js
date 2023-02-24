const { Router } = require('express');
const { Movies } = require('../models/movies');
const { UserAccount } = require('../models/userAccount');

const router = Router();

/**
 * GET http://localhost:8080/movies?....
 */

router.use("/movies*", async (req, res, next) => {
 const { authorization } = req.headers;
 if (!authorization) {
  return res.status(401).send({ message: `Authorization header is required` });
 }

 const user = await UserAccount.findOne({ tokens: authorization });
 if (!user) {
  return res.status(401).send({ message: `User was not found by token` });
 }

 console.log(`[auth] user login:${user.login}`);
 return next();
});

router.get("/movies", async (req, res) => {
 const { skip = 0, limit = 10, year, period_year, imdb_rating } = req.query;

 if (skip < 0) {
  return res.status(400).send({
   message: 'skip must be positive number'
  });
 }

 if (limit < 0) {
  return res.status(400).send({
   message: 'limit must be positive number'
  });
 }

 const dbQuery = {};

 if (year) {
  dbQuery.year = year;
 }

 if (period_year) {
  if (year) {
   return res.status(400).send({
    message: 'Only one parameter is allowed:period_year,year'
   });
  }
  // period_year => 2000,2005 
  const parsedPeriod = period_year.split(','); // => ["2000", "2005"]
  // parsedPeriod.map(e => parseInt(e, 10)) => [2000, 2005]
  // from => parsedPeriod[0] => 2000
  // to => parsedPeriod[1] => 2005
  const [from, to] = parsedPeriod.map(e => parseInt(e, 10));
  dbQuery.year = { $gte: from, $lte: to };
 }

 if (imdb_rating) {
  dbQuery["imdb.rating"] = parseInt(imdb_rating, 10);
 }

 console.debug(`db query:${JSON.stringify(dbQuery)}`);
 const docs = await Movies.find(dbQuery).skip(skip).limit(limit);

 return res.status(200).send(docs);
});

module.exports = { router };