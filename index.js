const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const { Comments } = require('./models/comments');
const MoviesController = require('./api/movies.api');
const UserAccountController = require('./api/userAccount.api');

// process.env
console.log(`MONGO_DB_URI:${process.env.MONGO_DB_URI}`);
// console.log('MONGO_DB_URI:', process.env.MONGO_DB_URI);

const Mongo = require('./setup/mongoose');

const app = express();
app.use(bodyParser.json());

const setup = async () => {
 await Mongo.setupDb(process.env.MONGO_DB_URI);

 const addMiddlewareLabel = (req, value) => {
  if (req.extraMiddlewares && Array.isArray(req.extraMiddlewares)) {
   req.extraMiddlewares.push(value);
   return;
  }

  req.extraMiddlewares = [value];
 };

 // (req,res,next) => { ... }
 // next - функція, яка викликає наступний обробник
 const m1 = (req, res, next) => {
  console.log("M1");
  // req.extraMiddlewares = ["M1"];
  addMiddlewareLabel(req, "M1");
  next();
 };
 const m2 = (req, res, next) => {
  console.log("M2");
  // req.extraMiddlewares.push("M2");
  addMiddlewareLabel(req, "M2");
  next();
 };
 const m3 = (req, res, next) => {
  console.log("M3");
  // req.extraMiddlewares.push("M3");
  addMiddlewareLabel(req, "M3");
  next();
 };

 const handler = (req, res) => {
  console.log("handler");
  req.extraMiddlewares.push("handler");
  return res.status(200).send({
   middlewares: req.extraMiddlewares // ["M1", "M3", "handler"]
  });
 };

 app.get("/middlewares", m3, m2, m1, handler);

 app.use(MoviesController.router);
 app.use(UserAccountController.router);

 app.post("/comments", async (req, res) => {
  const { name, email, text } = req.body;

  const doc = new Comments({
   name, email, text, date: new Date()
  });

  const elem = await doc.save();

  return res.status(200).send(elem);
 });

 app.get("/comments", async (req, res) => {
  /**
   * All values are string
   */
  const { email, createdAt } = req.query;

  const queryDb = {};

  if (email) {
   queryDb.email = email;
  }

  if (createdAt) {
   /**
    * Повернути записи в яких поле date має значення більше за createdAt
    * $gt -- строго бліше
    * $gte -- більше рівне
    * $lte -- менше рівне
    * $lt -- строго менше
    */
   queryDb.date = { $gt: new Date(createdAt) };
  }

  const docs = await Comments.find(queryDb);

  return res.status(200).send(docs);
 });

 app.listen(process.env.PORT, () => {
  console.log(`Server was started on ${process.env.PORT}`);
 });
};

setup();