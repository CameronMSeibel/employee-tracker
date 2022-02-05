const inquirer = require("inquirer");
const query = require("./query");

async function selectAction(){
    const questions = [
        {
            type: "list",
            name: "action",
            message: "What would you like to do?",
            choices: [
                "View All Employees",
                "Add Employee",
                "Update Employee Role",
                "View All Roles",
                "Add Role",
                "View All Departments",
                "Add Department",
                "Quit"
            ]
        }
    ];
    let {action} = await inquirer.prompt(questions);
    action = action[0].toLowerCase() + action.slice(1);
    action = action.replaceAll(" ", "");
    let callback = query[action];
    let response = await callback();
    if(response){
        selectAction();
    }
}

selectAction()
