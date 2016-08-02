/**
 * @fileOverview  The model class Employee with attribute definitions, (class-level) check methods, 
 *                setter methods, and the special methods saveAll and loadAll
 * @author Gerd Wagner
 * @copyright Copyright © 2013-2014 Gerd Wagner, Chair of Internet Technology, Brandenburg University of Technology, Germany. 
 * @license This code is licensed under The Code Project Open License (CPOL), implying that the code is provided "as-is", 
 * can be modified to create derivative works, can be redistributed, and can be used in commercial applications.
 */

/**
 * Enumeration type
 * @global
 */
EmployeeTypeEL = Object.defineProperties( {}, {
    MANAGER: { value: 1, writable: false},
    MAX: { value: 1, writable: false},
    names: {value:["Manager"], writable: false}
});
/**
 * Constructor function for the class Employee 
 * including the incomplete disjoint segmentation {TextBook, Biography}
 * based on the Single Table Inheritance pattern.
 * @constructor
 * @param {{personId: string, name: string, empNo: number}} [slots] - A record of parameters.
 */
function Employee( slots) {
  // set the default values for the parameter-free default constructor
  Person.call( this);  // invoke the default constructor of the supertype
  this.empNo = 0;      // Number (PositiveInteger)
/*
  this.subtype            // Number? {from EmployeeTypeEL}
  this.department      // String?
 */
  // constructor invocation with arguments
  if (arguments.length > 0) {
    Person.call( this, slots);  // invoke the constructor of the supertype
    this.setEmpNo( slots.empNo);
    if (slots.subtype) this.setSubtype( slots.subtype);
    if (slots.department) this.setDepartment( slots.department);
  }
};
Employee.prototype = Object.create( Person.prototype);  // inherit from Person
Employee.prototype.constructor = Employee;  // adjust the constructor property

// ***********************************************
// *** Class-level ("static") properties *********
// ***********************************************
Employee.instances = {};

// ***********************************************
// *** Checks and Setters ************************
// ***********************************************
/**
 * @method 
 * @static
 * @param {number} n - The employee number.
 */
Employee.checkEmpNo = function (n) {
  // convert to integer in case of a string
  n = parseInt( n);
  if (isNaN( n)) {
    return new MandatoryValueConstraintViolation(
        "A value for the employee number is required!");
  } else if (!util.isPositiveInteger( n)) {
    return new RangeConstraintViolation("The employee number must be a positive integer!");
  } else if (false) {  // TODO
    return new UniquenessConstraintViolation(
        "There is already a Employee record with this employee number!");
  } else {
    return new NoConstraintViolation();
  }
};
/**
 * @method 
 * @param {number} n - The employee number.
 */
Employee.prototype.setEmpNo = function (n) {
  var constraintViolation = Employee.checkEmpNo( n);
  if (constraintViolation instanceof NoConstraintViolation) {
    this.empNo = parseInt( n);
  } else {
    throw constraintViolation;
  }
};
/**
 * Check if the given value represents a subtype as defined by EmployeeTypeEL
 * @method 
 * @static
 * @param {number} t - The subtype of an employee.
 */
Employee.checkSubtype = function (t) {
  if (!t) {
    return new NoConstraintViolation();
  } else {
    if (!util.isInteger( t) || t < 1 || t > EmployeeTypeEL.MAX) {
      return new RangeConstraintViolation(
          "The value of subtype must represent an employee type!");
    } else {
      return new NoConstraintViolation();
    }
  }
};
/**
 * @method 
 * @param {number} t - The subtype of an employee.
 */
Employee.prototype.setSubtype = function (t) {
  var constraintViolation = null;
  if (this.subtype) {  // already set/assigned
    constraintViolation = new FrozenValueConstraintViolation("The subtype cannot be changed!");
  } else {
    t = parseInt( t);
    constraintViolation = Employee.checkSubtype( t);
  }
  if (constraintViolation instanceof NoConstraintViolation) {
    this.subtype = t;
  } else {
    throw constraintViolation;
  }
};
/**
 * Check if the attribute "department" applies to the given subtype of book
 * and if the value for it is admissible
 * @method 
 * @static
 * @param {string} d - The department of a manager.
 * @param {number} t - The subtype of an employee.
 */
Employee.checkDepartment = function (d,t) {
  if (t === undefined) t = EmployeeTypeEL.MANAGER;
  if (t === EmployeeTypeEL.MANAGER && !d) {
    return new MandatoryValueConstraintViolation(
        "A department must be provided for a manager!");
  } else if (t !== EmployeeTypeEL.MANAGER && d) {
    return new OtherConstraintViolation(
        "A department must not be provided if the employee is not a manager!");
  } else if (d && (typeof(d) !== "string" || d.trim() === "")) {
    return new RangeConstraintViolation(
        "The department must be a non-empty string!");
  } else {
    return new NoConstraintViolation();
  }
};
/**
 * @method 
 * @param {string} d - The department of a manager.
 */
Employee.prototype.setDepartment = function (d) {
  var constraintViolation = Employee.checkDepartment( d, this.subtype);
  if (constraintViolation instanceof NoConstraintViolation) {
    this.department = d;
  } else {
    throw constraintViolation;
  }
};
// ***********************************************
// *** Other Instance-Level Methods **************
// ***********************************************
/**
 * Serialize Employee object
 * @method 
 */
Employee.prototype.toString = function () {
  return "Employee{ persID: " + this.personId +", name: " + this.name +", empNo:" + this.empNo +"}";
};
/**
 * Convert Employee object to row
 * @method 
 * @returns {{personId: string, name: string, empNo: number}}
 */
Employee.prototype.convertObj2Row = function () {
  var row = util.cloneObject(this);
  return row; 
};
// *****************************************************
// *** Class-level ("static") methods ***
// *****************************************************
/**
 * Create a new Employee row
 * @method 
 * @static
 * @param {{personId: string, name: string, empNo: number}} slots - A record of parameters.
 */
Employee.create = function (slots) {
  var emp = null;
  try {
	  emp = new Employee( slots);
  } catch (e) {
    console.log( e.constructor.name + ": " + e.message);
    emp = null;
  }
  if (emp) {
    Employee.instances[emp.personId] = emp;
    console.log( Employee.toString() + " created!");
  }
};
/**
 * Update an existing Employee row
 * @method 
 * @static
 * @param {{personId: string, name: string, empNo: number}} slots - A record of parameters.
 */
Employee.update = function (slots) {
  var emp = Employee.instances[slots.personId],
      noConstraintViolated = true,
      ending = "",
      updatedProperties = [],
      // save the current state of book
      objectBeforeUpdate = util.cloneObject( emp);
  try {
    if ("name" in slots && emp.name !== slots.name) {
    	emp.setName( slots.name);
        updatedProperties.push("name");
    }
    if ("empNo" in slots && emp.empNo !== slots.empNo) {
      emp.setEmpNo( slots.empNo);
      updatedProperties.push("empNo");
    }
    if ("subtype" in slots && "subtype" in emp && emp.subtype !== slots.subtype ||
    		"subtype" in slots && !("subtype" in emp)) {
      emp.setSubtype( slots.subtype);
      updatedProperties.push("subtype");
    } else if (!("subtype" in slots) && "subtype" in emp) {
      delete emp.subtype;  // drop subtype slot
      delete emp.department;  
      updatedProperties.push("subtype");
    }
    if ("department" in slots && emp.department !== slots.department) {
  	  emp.setDepartment( slots.department);
      updatedProperties.push("department");
    }
  } catch (e) {
    console.log( e.constructor.name + ": " + e.message);
    noConstraintViolated = false;
    // restore object to its state before updating
    Employee.instances[slots.personId] = objectBeforeUpdate;
  }
  if (noConstraintViolated) {
    if (updatedProperties.length > 0) {
      ending = updatedProperties.length > 1 ? "ies" : "y";
      console.log("Propert"+ending+" " + updatedProperties.toString() + 
          " modified for Employee " + emp.name);
    } else {
      console.log("No property value changed for Employee " + emp.name + " !");
    }
  }
};
/**
 * Delete an existing Employee row
 * @method 
 * @static
 * @param {string} personId - The ID of a person.
 */
Employee.destroy = function (personId) {
  var name = Employee.instances[personId].name;
  delete Employee.instances[personId];
  console.log("Employee " + name + " deleted.");
};
/**
 * Load all Employee rows and convert them to objects
 * @method 
 * @static
 */
Employee.loadAll = function () {
  var key="", keys=[], persons={}, employees={}, employeeRow={}, i=0;
  if (!localStorage["employees"]) {
    localStorage.setItem("employees", JSON.stringify({}));
  }  
  try {
    persons = JSON.parse( localStorage["persons"]);
    employees = JSON.parse( localStorage["employees"]);
  } catch (e) {
    console.log("Error when reading from Local Storage\n" + e);        
  }
  keys = Object.keys( employees);
  console.log( keys.length +" employees loaded.");
  for (i=0; i < keys.length; i++) {
    key = keys[i];
    employeeRow = employees[key];
    // complete record by adding slots ("name") from supertable
    employeeRow.name = persons[key].name;
    Employee.instances[key] = Employee.convertRow2Obj( employeeRow);
  }
};
/**
 * Convert Employee row to Employee object
 * @method 
 * @static
 * @param {{personId: string, name: string, empNo: number}} slots - A record of parameters.
 * @returns {object}
 */
Employee.convertRow2Obj = function (slots) {
  var emp={};
  try {
    emp = new Employee( slots);
  } catch (e) {
    console.log( e.constructor.name + " while deserializing a Employee row: " + e.message);
    emp = null;
  }
  return emp;
};
/**
 * Save all Employee objects as rows
 * @method 
 * @static
 */
Employee.saveAll = function () {
  var key="", employees={}, emp={}, empRow={}, i=0;  
  var keys = Object.keys( Employee.instances);
  for (i=0; i < keys.length; i++) {
    key = keys[i];
    emp = Employee.instances[key];
    empRow = emp.convertObj2Row();
    // remove "name" slot as a supertype slot
    delete empRow.name;
    employees[key] = empRow;
  }
  try {
    localStorage["employees"] = JSON.stringify( employees);
    console.log( keys.length +" employees saved.");
  } catch (e) {
    alert("Error when writing to Local Storage\n" + e);
  }
};
