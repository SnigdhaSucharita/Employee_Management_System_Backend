let { DataTypes, sequelize } = require("../lib/index");

let employee = sequelize.define("employee", {
  employeeId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  departmentId: {
    type: DataTypes.INTEGER
  },
  roleId: {
    type: DataTypes.INTEGER
  }
})

module.exports = { employee };