let express = require("express");
/*
   - This line imports the Express framework, which is used to create and handle web servers and APIs in Node.js.
   - Express simplifies server creation by providing various built-in middleware and methods for routing, making it easier to handle HTTP requests and responses.
*/

let cors = require("cors");
/*
   - This imports the `cors` package, which stands for Cross-Origin Resource Sharing.
   - `cors` allows you to control which domains can access your API. By default, browsers block requests made to a different domain unless CORS is enabled.
   - In this case, you are using it to allow access to your API from any domain, which is especially useful if you're hosting your backend separately from the frontend.
*/

const app = express();
/*
   - Here, the `app` constant is initialized as an instance of Express.
   - This creates your server object, which will be used to define routes (endpoints), middleware, and listen for incoming requests.
*/

app.use(cors());
/*
   - The `app.use(cors())` middleware function allows CORS for all routes and requests.
   - This is particularly important when your API is accessed from other domains or different ports (like making an API request from a frontend running on a different port).
   - By enabling it globally, you're allowing any origin to make requests to your server, which is useful during development or for open APIs.
*/

app.use(express.json());
/*
   - This middleware is used to automatically parse incoming requests with a JSON payload.
   - Without this line, your application would not be able to handle requests containing JSON data in the request body.
   - It allows you to easily access the data sent in the request body via `req.body` in your route handlers.
   - This is especially necessary for POST and PUT requests, where data is typically sent in JSON format.
*/


// Import the employee model and Sequelize instance from the previously defined paths
let Employee = require("./models/employee.model");

let { sequelize_instance } = require("./lib/index");
const employee = require("./models/employee.model");

let port = 3000;

app.listen(port, () => {
  console.log("Server is running on port " + port);
});

app.get("/", (req, res) => {
  res.status(200).json({ message: "BD5.3 - HW2" });
});
let employeeData = [
  {
    id: 1,
    name: 'John Doe',
    designation: 'Manager',
    department: 'Sales',
    salary: 90000,
  },
  {
    id: 2,
    name: 'Anna Brown',
    designation: 'Developer',
    department: 'Engineering',
    salary: 80000,
  },
  {
    id: 3,
    name: 'James Smith',
    designation: 'Designer',
    department: 'Marketing',
    salary: 70000,
  },
  {
    id: 4,
    name: 'Emily Davis',
    designation: 'HR Specialist',
    department: 'Human Resources',
    salary: 60000,
  },
  {
    id: 5,
    name: 'Michael Wilson',
    designation: 'Developer',
    department: 'Engineering',
    salary: 85000,
  },
  {
    id: 6,
    name: 'Sarah Johnson',
    designation: 'Data Analyst',
    department: 'Data Science',
    salary: 75000,
  },
  {
    id: 7,
    name: 'David Lee',
    designation: 'QA Engineer',
    department: 'Quality Assurance',
    salary: 70000,
  },
  {
    id: 8,
    name: 'Linda Martinez',
    designation: 'Office Manager',
    department: 'Administration',
    salary: 50000,
  },
  {
    id: 9,
    name: 'Robert Hernandez',
    designation: 'Product Manager',
    department: 'Product',
    salary: 95000,
  },
  {
    id: 10,
    name: 'Karen Clark',
    designation: 'Sales Associate',
    department: 'Sales',
    salary: 55000,
  },
]

// end point to see the db
app.get("/seed_db", async (req, res) => {
  try {
    // Synchronize the database, forcing it to recreate the tables if they already exist

    await sequelize_instance.sync({ force: true });
    // Bulk create entries in the book table using predefined data

    // self study
    /*
    capture the result of the bulkCreate method, which returns an array of the created instances
    */

    let insertedEmployee = await Employee.bulkCreate(employeeData);
    // Send a 200 HTTP status code and a success message if the database is seeded successfully
    res.status(200).json({
      message: "Database Seeding successful",
      recordsInserted: insertedEmployee.length,
    }); // Displays the number of Employee inserted
  } catch (error) {
    // Send a 500 HTTP status code and an error message if there's an error during seeding

    console.log("Error in seeding db", error.message);
    return res.status(500).json({
      code: 500,
      message: "Error in seeding db",
      error: error.message,
    });
  }
});

/*
Exercise 1: Fetch all employees

Create an endpoint /employees that’ll return all the employees in the database.

Create a function named fetchAllEmployees to query the database using the sequelize instance.

API Call

http://localhost:3000/employees

Expected Output:

{
  employees: [
    // All the employees in the database
  ],
}
*/
//fucntion to fetch all employees
async function fetchAllEmployees() {
  try {
    //The createdAt and updatedAt fields are automatically added by Sequelize when you define a model.If you don't want these fields to be returned when you fetch data, you can use the attributes option in your Sequelize query
    let allEmployee = await Employee.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    if (!allEmployee || allEmployee.length == 0) {
      throw new Error("No Employee found");
    }
    return { employees: allEmployee };
  } catch (error) {
    console.log("Error in fetching  all Employee", error.message);
    throw error;
  }
}

//endpoint to fetch all employee
app.get("/employees", async (req, res) => {
  try {
    let allEmployee = await fetchAllEmployees();
    console.log(
      "succesfully fetched " + allEmployee.employees.length + " employees",
    );
    return res.status(200).json(allEmployee);
  } catch (error) {
    if (error.messaage === "No Employee found") {
      return res.status(404).json({
        code: 404,
        message: "No Employee found",
        error: error.message,
      });
    } else {
      return res.status(500).json({
        code: 500,
        message: "Error in fetching all Employee",
        error: error.message,
      });
    }
  }
});
/*
Exercise 2: Add a new employee in the database

Create a POST endpoint /employees/new that’ll return the newly inserted employee details.

Declare a variable named newEmployee to store the request body data AKA req.body.newEmployee.

Create a function named addNewEmployee that’ll insert the new employee into the database and return the new employee record from the database.

API Call

http://localhost:3000/employees/new

Request Body:

{
    'newEmployee': {
        'name': 'Jane Smith',
        'designation': 'Software Engineer',
        'department': 'Engineering',
        'salary': 75000
    }
}

Expected Output:

{
    'newEmployee': {
        'id': 11,
        'name': 'Jane Smith',
        'designation': 'Software Engineer',
        'department': 'Engineering',
        'salary': 75000
    }
}
     */

// fucntion to add new employee in db
async function addNewEmployee(newEmployee) {
  try {
    const result = await employee.create(newEmployee);
    if (!result) {
      throw new Error('Failed to add new employee');
    }
    return { newEmployee: result };
  } catch (error) {
    console.error(`Error adding new employee: ${error.message}`);
    throw error;
  }
}
///endpoint to add new employee
app.post("/employee/new", async (req, res) => {
  try {
    let newEmployee = req.body.newEmployee;
    let result = await addNewEmployee(newEmployee);
    return res.status(200).json(result);
  } catch (error) {
    if (error.message === "Failed to add new employee") {
      return res.status(404).json({
        code: 404,
        message: "Failed to add new employee",
        error: error.message,
      });
    } else {
      // Handle general errors, such as database connection issues or validation errors.
      return res.status(500).json({
        code: 500,
        message: "Error in adding new employee", // Response message indicating an internal server error occurred.
        error: error.message, // Provide the error message to help with debugging.
      });
    }
  }
});

/**
 * Exercise 3: Update employee information

Create a POST endpoint /employees/update/:id that’ll return the updated employee details.

Declare a variable named id to store the path parameter passed by the user.

Declare a variable named newEmployeeData to store the request body data.

Create a function named updateEmployeeById that’ll update the employee in the database and return the updated employee record from the database.

API Call

http://localhost:3000/employees/update/11

Request Body:

{
  'salary': 80000
}

Expected Output:

{
    'message': 'Employee updated successfully',
    'updatedEmployee': {
        'id': 11,
        'name': 'Jane Smith',
        'designation': 'Software Engineer',
        'department': 'Engineering',
        'salary': 80000
    }
}

 */

// fucntion to update employee info
async function updateEmployeeById(id, newEmployeeData) {
  try {
    let employeeToBeUpdated = await employee.findByPk(id);
    if (!employeeToBeUpdated) {
      throw new Error("Employee not found");
    }
    let updatedEmployee = await employeeToBeUpdated.update(newEmployeeData);
    return {
      message: 'Employee updated successfully',
      updatedEmployee: updatedEmployee
    };
  } catch (error) {
    console.log("error in updating employee ", error.messaage);
    throw error;
  }
}
//endpoint to update employee
app.post("/employees/update/:id", async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    let newEmployeeData = req.body;
    let updatedEmployee = await updateEmployeeById(id, newEmployeeData);
    return res.status(200).json(updatedEmployee);
  } catch (error) {
    if (error.messaage === "Employee not found") {
      return res.status(404).json({
        code: 404,
        message: 'Employee not found',
        error: error.messaage
      });
    } else {
      // Handle general errors, such as database connection issues or validation errors.
      return res.status(500).json({
        code: 500,
        message: "Error in updating  employee", // Response message indicating an internal server error occurred.
        error: error.message, // Provide the error message to help with debugging.
      });
    }
  }
});
/*
Exercise 4: Delete an employee from the database

Create a POST endpoint /employees/delete that’ll delete the employee record from the database.

Declare a variable named id to store the parameter from request body.

Create a function named deleteEmployeeById that’ll delete the employee record from the database based on the employee id.

API Call

http://localhost:3000/employees/delete

Request Body:

{
	'id': 11
}

Expected Output:

{ 'message': 'Employee record deleted successfully' }



  */



 //fucntion to delete employee by id in db
 async function deleteEmployeeById(id)
 {
  try
  {
    let result = await employee.destroy({where : {id: id}});
    if(result == 0)
    {
      throw new Error("Employee not found");
    }

    return { message: 'Employee record deleted successfully' }

  }catch(error)
  {
    console.log("error in deleteing employee by id ", error.message);
    throw error;
  }
 }
 // endpoint to delete employee by id
 app.post("/employees/delete", async (req, res) => {
  try{
    let id = req.body.id;
    let response = await deleteEmployeeById(id);

   return res.status(200).json(response);
  }catch(error)
  {
    if(error.messaage === "Employee not found")
    {
      return res.status(404).json({
        code: 404,
        message: "Employee not found",
        error: error.message,
      });
    } else {
      // Handle general errors, such as database connection issues or validation errors.
      return res.status(500).json({
        code: 500,
        message: "Error in deleting  employee", // Response message indicating an internal server error occurred.
        error: error.message, // Provide the error message to help with debugging.
      });
    }
  }
});
