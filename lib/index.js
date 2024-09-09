let sq = require("sequelize");
let sequelize_instance = new sq.Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
});
module.exports = {
  DataTypes: sq.DataTypes,
  sequelize_instance,
};
