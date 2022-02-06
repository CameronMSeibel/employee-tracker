const db = require("./config/connection");
const ctable = require("console.table");
const inquirer = require("inquirer");

/**
 * 
 * @returns {boolean} whether or not database operation succeeded
 */
async function viewAllEmployees(){
    try{
        const [rows] = await db.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name as department, role.salary,
        (SELECT CONCAT_WS(" ", employee.first_name, employee.last_name) WHERE employee.id=employee.manager_id) AS manager
        FROM employee
        INNER JOIN role ON employee.role_id=role.id
        INNER JOIN department ON role.department_id=department.id;`);
        console.table(rows);
        return true;
    }catch(err){
        console.error(err)
        return false;
    }
}

async function addEmployee(){
    try{ 
        const roles = await listRoles();
        const employees = await listEmployees();
        const questions = [
            {
                message: "What is the employee's first name?",
                name: "firstName"
            },
            {
                message: "What is the employee's last name?",
                name: "lastName"
            },
            {
                type: "list",
                message: "What is the employee's role?",
                name: "role",
                choices: [...roles, "Add Role"]
            },
            {
                type: "list",
                message: "Who is the employee's manager?",
                name: "manager",
                choices: ["None", ...employees]
            }
        ];
        let {firstName, lastName, role, manager} = await inquirer.prompt(questions);
        if(role === "Add Role"){
            role = await addRole();
        }
        let managerID;
        if(manager === "None"){
            managerID = null;
        }else{
            const [rows] = await db.query("SELECT id FROM employee WHERE first_name=? AND last_name=?;", manager.split(" "));
            managerID = rows[0].id;
        }
        const [rows] = await db.query("SELECT id FROM role WHERE title=?;", role);
        const roleID = rows[0].id;
        await db.query("INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);", [firstName, lastName, roleID, managerID]);
        console.log(`Added ${firstName} ${lastName} to database.`);
        return true;
    }catch(err){
        console.error(err);
        return false;
    }
}

async function updateEmployeeRole(){
    try{
        const employees = await listEmployees();
        const roles = await listRoles();
        questions = [
            {
                type: "list",
                name: "employee",
                message: "Which employee's role do you wish to update?",
                choices: employees
            },
            {
                type: "list",
                name: "title",
                message: "Which role do you wish to assign the selected employee?",
                choices: [...roles, "Add Role"]
            }
        ];
        let {employee, title} = await inquirer.prompt(questions);
        if(title === "Add Role"){
            title = addRole();
        }
        let [rows] = await db.query("SELECT id FROM employee WHERE first_name=? AND last_name=?", employee.split(" "));
        const employeeID = rows[0].id;
        [rows] = await db.query("SELECT id FROM role WHERE title=?", title);
        const roleID = rows[0].id;
        db.query("UPDATE employee SET role_id=? WHERE id=?", [roleID, employeeID]);
        console.log(`Updated ${employee}'s role to ${title}.`);
        return true;
    }catch(err){
        console.error(err);
        return false;
    }
}

async function viewAllRoles(){
    try{
        const [rows] = await db.query("SELECT role.title, role.id, department.name, role.salary FROM role INNER JOIN department ON role.department_id=department.id;")
        console.table(rows);
        return true;
    }catch(err){
        console.error(err);
        return false;
    }
}

async function addRole(){
    try{
        const departments = await listDepartments();
        const questions = [
            {
                name: "title",
                message: "What is the title for this role?"
            },
            {
                name: "salary",
                message: "What is the salary for this role?"
            },
            {
                type: "list",
                name: "department",
                message: "Under which department does this role operate?",
                choices: [...departments, "Add Department"]
            }
        ];
        let {title, salary, department} = await inquirer.prompt(questions);
        if(department === "Add Department"){
            department = await addDepartment();
        }
        const [rows] = await db.query("SELECT id FROM department WHERE name=?;", department);
        await db.query("INSERT INTO role(title, salary, department_id) VALUES (?, ?, ?);", [title, salary, rows[0].id]);
        console.log(`Added ${title} to the database.`);
        return title;
    }catch(err){
        console.error(err);
        return false;
    }
}

async function viewAllDepartments(){
    try{
        const [rows] = await db.query("SELECT * FROM department;")
        console.table(rows);
        return true;
    }catch(err){
        console.error(err);
        return false;
    }
}

async function addDepartment(){
    try{
        const questions = [
            {
                name: "name",
                message: "What is the name of the department?"
            }
        ];
        const {name} = await inquirer.prompt(questions);
        db.query("INSERT INTO department(name) VALUES (?);", name);
        console.log(`Added ${name} to the database.`);
        return name;
    }catch(error){
        console.error(error);
        return false;
    }
}

async function listEmployees(){
    try{
        const [rows] = await db.query("SELECT CONCAT_WS(' ', first_name, last_name) AS name FROM employee;");
        return rows.map((item) => item.name);
    }catch(err){
        console.error(err);
    }
}

async function listDepartments(){
    try{
        const [rows] = await db.query("SELECT name FROM department;");
        return rows.map((item) => item.name);
    }catch(err){
        console.error(err);
    }
}

async function listRoles(){
    try{
        const [rows] = await db.query("SELECT title FROM role;");
        return rows.map((item) => item.title);
    }catch(err){
        console.error(err);
    }
}

function quit(){
    db.end();
}

module.exports = {
    addDepartment,
    addEmployee, 
    addRole,
    quit,
    updateEmployeeRole, 
    viewAllDepartments,
    viewAllEmployees,
    viewAllRoles
};
