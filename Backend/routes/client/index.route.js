const userRoute = require("./user.route");
const bookRoute = require("./book.route");
const tagRoute = require("./tag.route");
const chapRoute = require("./chapter.route");

module.exports.routesClient = (app) => {
  app.use("/user", userRoute);
  app.use("/book", bookRoute);
  app.use("/tag", tagRoute);
  app.use("/chapter", chapRoute);
};
