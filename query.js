const db = require("./config/connection");
const ctable = require("console.table");
const inquirer = require("inquirer");

/**
 * 
 * @returns 
 */
async function viewAllEmployees(){
    try{
        const [rows] = await db.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name as department, role.salary,
        (SELECT employee.first_name + " " + employee.last_name WHERE employee.id=employee.manager_id) AS manager
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
        const roles = [];
        const employees = [];
        const questions = [
            {
                message: "What is the employee's first name?",
                name: "first_name"
            },
            {
                message: "What is the employee's last name?",
                name: "last_name"
            },
            {
                type: "list",
                message: "What is the employee's role?",
                name: "role",
                choices: [...roles]
            },
            {
                type: "list",
                message: "Who is the employee's manager?",
                name: "manager",
                choices: ["None", ...employees]
            }
        ];
        const response = await inquirer.prompt(questions);
    }catch(err){
        console.error(err);
        return false;
    }
}

async function updateEmployeeRole(){

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
        ]
        const response = await inquirer.prompt(questions);
        db.query("INSERT INTO department(name) VALUES (?);", response.name);
        return true;
    }catch(error){
        console.error(error);
        return false;
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
