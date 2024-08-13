let { DataTypes, sequelize } = require("../lib/index");

let role = sequelize.define("role", {
  roleId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = { role };