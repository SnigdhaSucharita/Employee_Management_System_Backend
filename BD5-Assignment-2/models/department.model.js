let { DataTypes, sequelize } = require("../lib/index");

let department = sequelize.define("department", {
  departmentId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = { department };