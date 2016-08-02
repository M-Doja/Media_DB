/**
 * @fileOverview  Contains various controller functions for managing books
 * @author Gerd Wagner
 */
pl.ctrl.books.manage = {
  initialize: function () {
    Book.loadAll();
    pl.view.books.manage.setupUserInterface();
  }
};