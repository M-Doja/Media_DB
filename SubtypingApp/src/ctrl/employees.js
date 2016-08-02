/**
 * @fileOverview  Contains various controller functions for managing employees
 * @author Gerd Wagner
 */
pl.ctrl.employees.manage = {
  initialize: function () {
    Employee.loadAll();
    pl.view.employees.manage.setupUserInterface();
  }
};