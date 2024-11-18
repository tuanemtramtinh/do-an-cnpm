const userRoute = require("./user.route");
const bookRoute = require("./book.route");

module.exports.routesClient = (app) => {
  app.use("/user", userRoute);
  app.use("/book", bookRoute);
};
