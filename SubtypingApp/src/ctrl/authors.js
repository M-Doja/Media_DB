/**
 * @fileOverview  Contains various controller functions for managing books
 * @author Gerd Wagner
 */
pl.ctrl.authors.manage = {
  initialize: function () {
    Author.loadAll();
    pl.view.authors.manage.setupUserInterface();
  }
};