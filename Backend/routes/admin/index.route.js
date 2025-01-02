const userRoute = require("./user.route");

module.exports.routesAdmin = (app) => {
  console.log("hello");
  app.use("/admin/user", userRoute);
};
