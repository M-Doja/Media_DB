/**
 * @fileOverview  Contains various view functions for managing employees
 * @author Gerd Wagner
 * @copyright Copyright © 2013-2014 Gerd Wagner, Chair of Internet Technology, Brandenburg University of Technology, Germany. 
 * @license This code is licensed under The Code Project Open License (CPOL), implying that the code is provided "as-is", 
 * can be modified to create derivative works, can be redistributed, and can be used in commercial applications.
 */
/**
 * event handler for employee type selection events
 * used both in create and update
 */
pl.view.employees.handleSubtypeSelectChangeEvent = function (e) {
  var formEl = e.currentTarget.form,
      subtypeIndexStr = formEl.subtype.value,  // the array index of EmployeeTypeEL.names
      subtype=0;
  if (subtypeIndexStr) {
    subtype = parseInt( subtypeIndexStr) + 1;
    switch (subtype) {
    case EmployeeTypeEL.MANAGER:
      formEl.department.addEventListener("input", function () {
        formEl.department.setCustomValidity( 
            Employee.checkDepartment( formEl.department.value).message);
      });
      break;
    }
    pl.view.app.displaySegmentFields( formEl, EmployeeTypeEL.names, subtype);
  } else {
    pl.view.app.undisplayAllSegmentFields( formEl, EmployeeTypeEL.names);
  }
};
pl.view.employees.manage = {
  /**
   * Set up the employee management UI
   */
  setupUserInterface: function () {
    window.addEventListener("beforeunload", pl.view.employees.manage.exit);
  },
  /**
   * Exit the Manage Employees UI page
   * Save the current population of Employee and generate the population of Person 
   * from Employee and Employee
   */
  exit: function () {
    Employee.saveAll();
    Person.saveAll();
  },
  /**
   * Refresh the Manage Employees UI
   */
  refreshUI: function () {
    // show the manage employee UI and hide the other UIs
    document.getElementById("manageEmployees").style.display = "block";
    document.getElementById("listEmployees").style.display = "none";
    document.getElementById("createEmployee").style.display = "none";
    document.getElementById("updateEmployee").style.display = "none";
    document.getElementById("deleteEmployee").style.display = "none";
  }
};
/**********************************************
 * Use case List Employees
**********************************************/
pl.view.employees.list = {
  setupUserInterface: function () {
    var tableBodyEl = document.querySelector("div#listEmployees>table>tbody");
    var keys = Object.keys( Employee.instances);
    var row=null, employee=null, i=0;
    tableBodyEl.innerHTML = "";
    for (i=0; i < keys.length; i++) {
      employee = Employee.instances[keys[i]];
      row = tableBodyEl.insertRow(-1);
      row.insertCell(-1).textContent = employee.personId;
      row.insertCell(-1).textContent = employee.name;
      row.insertCell(-1).textContent = employee.empNo;
      if (employee.subtype) {
        switch (employee.subtype) {
        case EmployeeTypeEL.MANAGER:
          row.insertCell(-1).textContent = "Manager of "+ employee.department + " department";
          break;
        }
      }
    }
    document.getElementById("manageEmployees").style.display = "none";
    document.getElementById("listEmployees").style.display = "block";
  }
};
/**********************************************
 * Use case Create Employee
**********************************************/
pl.view.employees.create = {
  /**
   * initialize the createEmployeeForm
   */
  setupUserInterface: function () {
    var formEl = document.forms['createEmployeeForm'],
        typeSelectEl = formEl.subtype,
        submitButton = formEl.commit;
    formEl.personId.addEventListener("input", function () { 
      formEl.personId.setCustomValidity( 
          Person.checkPersonIdAsId( formEl.personId.value, Employee).message);
    });
    formEl.name.addEventListener("input", function () { 
      formEl.name.setCustomValidity(
          Person.checkName( formEl.name.value).message);
    });
    formEl.empNo.addEventListener("input", function () { 
      formEl.empNo.setCustomValidity( 
          Employee.checkEmpNo( formEl.empNo.value).message);
    });
    // set up the employee type selection list
    util.fillSelectWithOptions( typeSelectEl, EmployeeTypeEL.names);
    typeSelectEl.addEventListener("change", 
        pl.view.employees.handleSubtypeSelectChangeEvent);
    // set up the submit button
    submitButton.addEventListener("click", function (e) {
      var formEl = document.forms['createEmployeeForm'],
          typeStr = formEl.subtype.value;
      var slots = {
          personId: formEl.personId.value, 
          name: formEl.name.value,
          empNo: formEl.empNo.value
      };
      if (typeStr) {
        slots.subtype = parseInt( typeStr) + 1;
        switch (slots.subtype) {
        case EmployeeTypeEL.MANAGER:
          slots.department = formEl.department.value;
          formEl.department.setCustomValidity( 
              Employee.checkDepartment( formEl.department.value).message);
          break;
        }
      }
      // check all input fields and provide error messages in case of constraint violations
      formEl.personId.setCustomValidity( 
          Person.checkPersonIdAsId( slots.personId, Employee).message);
      formEl.name.setCustomValidity( Person.checkName( slots.name).message);
      formEl.empNo.setCustomValidity( 
          Employee.checkEmpNo( formEl.empNo.value).message);
      // save the input data only if all of the form fields are valid
      if (formEl.checkValidity()) {
        Employee.create( slots);
        formEl.reset();
      }
    });
    document.getElementById("manageEmployees").style.display = "none";
    document.getElementById("createEmployee").style.display = "block";
    formEl.reset();
  }
};
/**********************************************
 * Use case Update Employee
**********************************************/
pl.view.employees.update = {
  /**
   * initialize the update employees UI/form
   */
  setupUserInterface: function () {
    var formEl = document.forms['updateEmployeeForm'],
        submitButton = formEl.commit,
        typeSelectEl = formEl.subtype,
        employeeSelectEl = formEl.selectEmployee;
    // set up the employee selection list
    util.fillAssocListWidgetSelectWithOptions( employeeSelectEl, Employee.instances, 
        "personId", {displayProp:"name"});
    employeeSelectEl.addEventListener("change", 
        pl.view.employees.update.handleEmployeeSelectChangeEvent);
    // validate constraints on new user input
    formEl.name.addEventListener("input", function () { 
      formEl.name.setCustomValidity(
          Person.checkName( formEl.name.value).message);
      });
    formEl.empNo.addEventListener("input", function () { 
      formEl.empNo.setCustomValidity( 
          Employee.checkEmpNo( formEl.empNo.value).message);
      });
    // set up the employee type selection list
    util.fillSelectWithOptions( typeSelectEl, EmployeeTypeEL.names);
    typeSelectEl.addEventListener("change", 
    		pl.view.employees.handleSubtypeSelectChangeEvent);
    // set up the submit button
    submitButton.addEventListener("click", function (e) {
      var formEl = document.forms['updateEmployeeForm'],
          typeStr = formEl.subtype.value;
      var slots = {
          personId: formEl.personId.value, 
          name: formEl.name.value,
          empNo: parseInt( formEl.empNo.value)
      };
      if (typeStr) {
        slots.subtype = parseInt( typeStr) + 1;
        switch (slots.subtype) {
        case EmployeeTypeEL.MANAGER:
          slots.department = formEl.department.value;
          formEl.department.setCustomValidity( 
              Employee.checkDepartment( formEl.department.value).message);
          break;
        }
      }
      // check all relevant input fields and provide error messages 
      // in case of constraint violations
      formEl.name.setCustomValidity( Person.checkName( slots.name).message);
      formEl.empNo.setCustomValidity( 
          Employee.checkEmpNo( formEl.empNo.value).message);
      // save the input data only if all of the form fields are valid
      if (formEl.checkValidity()) {
        Employee.update( slots);
        formEl.reset();
      }
    });
    document.getElementById("manageEmployees").style.display = "none";
    document.getElementById("updateEmployee").style.display = "block";
    formEl.reset();
  },
  /**
   * handle employee selection events
   * on selection, populate the form with the data of the selected employee
   */
  handleEmployeeSelectChangeEvent: function () {
    var formEl = document.forms['updateEmployeeForm'];
    var key="", emp=null;
    key = formEl.selectEmployee.value;
    if (key !== "") {
      emp = Employee.instances[key];
      formEl.personId.value = emp.personId;
      formEl.name.value = emp.name;
      formEl.empNo.value = emp.empNo;
      if (emp.subtype) {
        formEl.subtype.selectedIndex = parseInt( emp.subtype);
        pl.view.app.displaySegmentFields( formEl, EmployeeTypeEL.names, emp.subtype);
        switch (emp.subtype) {
        case EmployeeTypeEL.MANAGER:
          formEl.department.value = emp.department;
          break;
        }
      } else {  // no emp.subtype
        formEl.subtype.value = "";
        formEl.department.value = ""; 
        pl.view.app.undisplayAllSegmentFields( formEl, EmployeeTypeEL.names);
      }
    } else {
      formEl.personId.value = "";
      formEl.name.value = "";
      formEl.empNo.value = "";
    }
  }
};
/**********************************************
 * Use case Delete Employee
**********************************************/
pl.view.employees.destroy = {
  /**
   * initialize the deleteEmployeeForm
   */
  setupUserInterface: function () {
    var formEl = document.forms['deleteEmployeeForm'],
        deleteButton = formEl.commit,
        employeeSelectEl = formEl.selectEmployee;
    var msgAddendum="";
    // set up the employee selection list
    util.fillAssocListWidgetSelectWithOptions( employeeSelectEl, Employee.instances, 
        "personId", {displayProp:"name"});
    deleteButton.addEventListener("click", function () {
        var formEl = document.forms['deleteEmployeeForm'],
            personIdRef = formEl.selectEmployee.value;
        if (confirm("Do you really want to delete this employee"+ msgAddendum +"?")) {
          Employee.destroy( personIdRef);
          formEl.selectEmployee.remove( formEl.selectEmployee.selectedIndex);
          formEl.reset();
        };
    });
    document.getElementById("manageEmployees").style.display = "none";
    document.getElementById("deleteEmployee").style.display = "block";
  }
};