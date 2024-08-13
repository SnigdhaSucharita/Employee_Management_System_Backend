let express = require("express");
let { employee } = require("./models/employee.model");
let { role } = require("./models/role.model");
let { department } = require("./models/department.model");
let { sequelize } = require("./lib/index");
let app = express();

app.use(express.json());

let employees = [
    { employeeId: 1, name: 'Rahul Sharma', email: 'rahul.sharma@example.com', departmentId: 1, roleId: 1 },
    { employeeId: 2, name: 'Priya Singh', email: 'priya.singh@example.com', departmentId: 2, roleId: 2 },
    { employeeId: 3, name: 'Ankit Verma', email: 'ankit.verma@example.com', departmentId: 1, roleId: 3 }
  ];

let departments = [
      { departmentId: 1, name: 'Engineering' },
      { departmentId: 2, name: 'Marketing' }
    ];

let roles =  [
      { roleId: 1, title: 'Software Engineer' },
      { roleId: 2, title: 'Marketing Specialist' },
      { roleId: 3, title: 'Product Manager' }
    ];


app.get("/seed_db", async (req, res) => {
  try {
    await sequelize.sync({ force: true });

    await employee.bulkCreate(employees);
    await department.bulkCreate(departments);
    await role.bulkCreate(roles);

    res.status(200).json({ message: "Database Seeding successful" });
  } catch(error) {
    res.status(500).json({ message: "Error seeding the data", error: error.message });
  }
});

async function fetchAllEmployees() {
  let employees = await employee.findAll();
  return { employees };
}

app.get("/employees", async(req, res) => {
  try {
    let response = await fetchAllEmployees();
    if(response.employees.length === 0) {
      return res.status(404).json({ message: "No employees found" });
    }
    return res.status(200).json(response);
  } catch(error) {
    return res.status(500).json({ error: error.message });
  }
})

async function getEmployeeById(employeeId) {
  let employeeData = await employee.findOne({ where: { employeeId } });
  if(!employeeData) return {};
  return { employee: employeeData }; 
}

app.get("/employees/details/:employeeId", async(req, res) => {
  try {
    let employeeId = req.params.employeeId;
    let response = await getEmployeeById(employeeId);
    if(response.employee === undefined) {
      return res.status(404).json({ message: "Employee not found" });
    }
    return res.status(200).json(response);
  } catch(error) {
    return res.status(500).json({ error: error.message });
  }
})

async function getEmployeesByDepartmentId(departmentId) {
  let employees = await employee.findAll({ where: { departmentId } });
  return { employees };
}

app.get("/employees/department/:departmentId", async(req, res) => {
  try {
    let departmentId = req.params.departmentId;
    let response = await getEmployeesByDepartmentId(departmentId);
    if(response.employees.length === 0) {
      return res.status(404).json({ message: "No employees found" });
    }
    return res.status(200).json(response);
  } catch(error) {
    return res.status(500).json({ error: error.message });
  }
})

async function getEmployeesSortedByName(order) {
  let employees = await employee.findAll({ order: [["name", order]] });
  return { employees };
}

app.get("/employees/sort-by-name", async(req, res) => {
  try {
    let order = req.query.order;
    let response = await getEmployeesSortedByName(order);
    if(response.employees.length === 0) {
      return res.status(404).json({ message: "No employees found" });
    }
    return res.status(200).json(response);
  } catch(error) {
    return res.status(500).json({ error: error.message });
  }
})

async function addNewEmployee(newEmployee) {
  let employeeData = await employee.create(newEmployee);
  return { newEmployee: employeeData };
}

app.post("/employees/new", async(req, res) => {
  try {
    let newEmployee = req.body;
    let response = await addNewEmployee(newEmployee);
    return res.status(200).json(response);
  } catch(error) {
    return res.status(500).json({ error: error.message });
  }
})

async function updateEmployeeById(employeeId, updatedEmployee) {
  let employeeData = await employee.findOne({ where: { employeeId } });
  if(!employeeData) return {};
  employeeData.set(updatedEmployee);
  let updatedEmployeeData = await employeeData.save();
  return { updatedEmployee: updatedEmployeeData };
}

app.post("/employees/:employeeId", async(req, res) => {
  try {
    let employeeId = req.params.employeeId;
    let updatedEmployee = req.body;
    let response = await updateEmployeeById(employeeId, updatedEmployee);
    if(response.updatedEmployee === undefined) {
      return res.status(404).json({ message: "Employee not found" });
    }
    return res.status(200).json(response);
  } catch(error) {
    return res.status(500).json({ error: error.message });
  }
})

async function deleteEmployeeById(employeeId) {
  let destroyedEmployee = await employee.destroy({ where: { employeeId } });
  if(!destroyedEmployee) return {};
  return { message: `Employee with ID ${employeeId} deleted successfully` }
}

app.post("/employees", async(req, res) => {
  try {
    let employeeId = req.body.id;
    let response = await deleteEmployeeById(employeeId);
    if(!response.message) {
      return res.status(404).json({message: "Employee not found"});
    }
    return res.status(200).json(response);
  } catch(error) {
    return res.status(500).json({ error: error.message });
  }
})

async function getEmployeesByRoleId(roleId) {
  let employees = await employee.findAll({ where: { roleId } });

  return { employees }; 
}

app.get("/employees/role/:roleId", async(req, res) => {
  try {
    let roleId = req.params.roleId;
    let response = await getEmployeesByRoleId(roleId);
    if(response.employees.length === 0) {
      return res.status(404).json({ message: "No employees found" });
    }
    return res.status(200).json(response);
  } catch(error) {
    return res.status(500).json({ error: error.message });
  }
})

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});