SOURCE schema.sql;

INSERT INTO department(name)
VALUES ("Executive");

INSERT INTO role(title, salary, department_id)
VALUES ("CEO", 69420000, 1);

INSERT INTO employee(first_name, last_name, role_id, manager_id) 
VALUES ("Cameron", "Seibel", 1, NULL);