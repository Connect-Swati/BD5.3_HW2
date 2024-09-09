const { sequelize_instance, DataTypes } = require("../lib/index");
/*
Create a model for employee in the folder ./models/employee.model.js

Define the Datatypes for each column based on the structure of the dummy data

Don’t define id in the model. Sequelize will automatically assign id’s to each record

name: "Alice",
  salary: 60000,
  department: "Engineering",
  designation: "Software Engineer",
  
*/
const employee = sequelize_instance.define("employee", {
  name: DataTypes.TEXT,
  designation: DataTypes.TEXT,
  department: DataTypes.TEXT,
  salary: DataTypes.INTEGER,
  
  
});
module.exports = employee;
