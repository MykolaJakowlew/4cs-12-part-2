module.exports.wrapperApi = (handler) => {
 return async (req, res) => {
  try {
   await handler(req, res);
  } catch (err) {
   console.error(err);
   return req.status(500).send({
    message: err.toString()
   });
  }
 };
};