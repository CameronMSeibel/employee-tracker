const db = require("./config/connection");
const ctable = require("console.table");
const inquirer = require("inquirer");

/**
 * 
 * @returns 
 */
async function viewAllEmployees(){
    try{
        const [rows] = await db.query("SELECT * FROM employee;");
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
        const [rows] = await db.query("SELECT * FROM role;")
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
