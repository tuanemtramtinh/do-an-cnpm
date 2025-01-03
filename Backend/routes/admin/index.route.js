const userRoute = require("./user.route");

module.exports.routesAdmin = (app) => {
  app.use("/admin/user", userRoute);
};
