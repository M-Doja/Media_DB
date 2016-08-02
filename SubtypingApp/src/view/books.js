/**
 * @fileOverview  Contains various view functions for managing books
 * @author Gerd Wagner
 * @copyright Copyright © 2013-2014 Gerd Wagner, Chair of Internet Technology, Brandenburg University of Technology, Germany. 
 * @license This code is licensed under The Code Project Open License (CPOL), implying that the code is provided "as-is", 
 * can be modified to create derivative works, can be redistributed, and can be used in commercial applications.
 */
/**
 * event handler for book subtype selection events
 * used both in create and update
 */
pl.view.books.handleSubtypeSelectChangeEvent = function (e) {
  var formEl = e.currentTarget.form,
      typeIndexStr = formEl.subtype.value,  // the array index of BookTypeEL.names
      subtype=0;
  if (typeIndexStr) {
    subtype = parseInt( typeIndexStr) + 1;
    switch (subtype) {
    case BookTypeEL.TEXTBOOK:
      formEl.subjectArea.addEventListener("input", function () {
        formEl.subjectArea.setCustomValidity( 
            Book.checkSubjectArea( formEl.subjectArea.value).message);
      });
      break;
    case BookTypeEL.BIOGRAPHY: 
      formEl.about.addEventListener("input", function () {
        formEl.about.setCustomValidity( 
            Book.checkAbout( formEl.about.value).message);
      });
      break;
    }
    pl.view.app.displaySegmentFields( formEl, BookTypeEL.names, subtype);
  } else {
    pl.view.app.undisplayAllSegmentFields( formEl, BookTypeEL.names);
  }
};
pl.view.books.manage = {
  /**
   * Set up the book data management UI
   */
  setupUserInterface: function () {
    window.addEventListener("beforeunload", pl.view.books.manage.exit);
  },
  /**
   * exit the Manage Books UI page
   */
  exit: function () {
    Book.saveAll(); 
  },
  /**
   * refresh the Manage Books UI
   */
  refreshUI: function () {
    // show the manage book UI and hide the other UIs
    document.getElementById("manageBooks").style.display = "block";
    document.getElementById("listBooks").style.display = "none";
    document.getElementById("createBook").style.display = "none";
    document.getElementById("updateBook").style.display = "none";
    document.getElementById("deleteBook").style.display = "none";
  }
};
/**********************************************
 * Use case List Books
**********************************************/
pl.view.books.list = {
  setupUserInterface: function () {
    var tableBodyEl = document.querySelector("div#listBooks>table>tbody");
    var i=0, row=null, book=null, keys = Object.keys( Book.instances);
    tableBodyEl.innerHTML = "";  // drop old contents
    for (i=0; i < keys.length; i++) {
      book = Book.instances[keys[i]];
      row = tableBodyEl.insertRow(-1);
      row.insertCell(-1).textContent = book.isbn;
      row.insertCell(-1).textContent = book.title;
      row.insertCell(-1).textContent = book.year;
      if (book.subtype) {
        switch (book.subtype) {
        case BookTypeEL.TEXTBOOK:
          row.insertCell(-1).textContent = book.subjectArea + " textbook";
          break;
        case BookTypeEL.BIOGRAPHY: 
          row.insertCell(-1).textContent = "Biography about "+ book.about;
          break;
        }
      }
    }
    document.getElementById("manageBooks").style.display = "none";
    document.getElementById("listBooks").style.display = "block";
  }
};
/**********************************************
 * Use case Create Book
**********************************************/
pl.view.books.create = {
  /**
   * initialize the books.create form
   */
  setupUserInterface: function () {
    var formEl = document.forms['createBookForm'],
        typeSelectEl = formEl.subtype,
        submitButton = formEl.commit;
    pl.view.app.undisplayAllSegmentFields( formEl, BookTypeEL.names);
    formEl.isbn.addEventListener("input", function () {
      formEl.isbn.setCustomValidity( 
          Book.checkIsbnAsId( formEl.isbn.value).message);
    });
    formEl.title.addEventListener("input", function () { 
      formEl.title.setCustomValidity( 
          Book.checkTitle( formEl.title.value).message);
    });
    formEl.year.addEventListener("input", function () { 
      formEl.year.setCustomValidity( 
          Book.checkYear( formEl.year.value).message);
    });
    // set up the book subtype selection list
    util.fillSelectWithOptions( typeSelectEl, BookTypeEL.names);
    typeSelectEl.addEventListener("change", 
        pl.view.books.handleSubtypeSelectChangeEvent);
    // define event handler for submitButton click events    
    submitButton.addEventListener("click", this.handleSubmitButtonClickEvent);
    // define event handler for neutralizing the submit event
    formEl.addEventListener( 'submit', function (e) { 
      e.preventDefault();
      formEl.reset();
    });
    // replace the manageBooks form with the createBook form
    document.getElementById("manageBooks").style.display = "none";
    document.getElementById("createBook").style.display = "block";
    formEl.reset();
  },
  handleSubmitButtonClickEvent: function () {
    var formEl = document.forms['createBookForm'],
        typeStr = formEl.subtype.value;
    var slots = {
        isbn: formEl.isbn.value, 
        title: formEl.title.value,
        year: formEl.year.value
    };
    if (typeStr) {
      slots.subtype = parseInt( typeStr) + 1;
      switch (slots.subtype) {
      case BookTypeEL.TEXTBOOK:
        slots.subjectArea = formEl.subjectArea.value;
        formEl.subjectArea.setCustomValidity( 
            Book.checkSubjectArea( formEl.subjectArea.value).message);
        break;
      case BookTypeEL.BIOGRAPHY:
        slots.about = formEl.about.value;
        formEl.about.setCustomValidity( 
            Book.checkAbout( formEl.about.value).message);
        break;
      }
    }
    // check all input fields and provide error messages 
    // in case of constraint violations
    formEl.isbn.setCustomValidity( Book.checkIsbnAsId( slots.isbn).message);
    formEl.title.setCustomValidity( Book.checkTitle( slots.title).message);
    formEl.year.setCustomValidity( Book.checkYear( slots.year).message);
    // save the input data only if all of the form fields are valid
    if (formEl.checkValidity()) {
      Book.create( slots);
      pl.view.app.undisplayAllSegmentFields( formEl, BookTypeEL.names);
    }
  }
};
/**********************************************
 * Use case Update Book
**********************************************/
pl.view.books.update = {
  /**
   * initialize the update books UI/form
   * Notice that the Association List Widget for associated authors is left empty initially.
   * It is only set up on book selection
   */
  setupUserInterface: function () {
    var formEl = document.forms['updateBookForm'],
        bookSelectEl = formEl.selectBook,
        typeSelectEl = formEl.subtype,
        submitButton = formEl.commit;
    pl.view.app.undisplayAllSegmentFields( formEl, BookTypeEL.names);
    // set up the book selection list
    util.fillSelectWithOptions( bookSelectEl, Book.instances, 
        "isbn", {displayProp:"title"});
    bookSelectEl.addEventListener("change", this.handleBookSelectChangeEvent);
    // validate constraints on new user input
    formEl.title.addEventListener("input", function () { 
      formEl.title.setCustomValidity( Book.checkTitle( formEl.title.value).message);
    });
    formEl.year.addEventListener("input", function () { 
      formEl.year.setCustomValidity( Book.checkYear( formEl.year.value).message);
    });
    // set up the book subtype selection list
    util.fillSelectWithOptions( typeSelectEl, BookTypeEL.names);
    typeSelectEl.addEventListener("change", 
    		pl.view.books.handleSubtypeSelectChangeEvent);
    // define event handler for submitButton click events    
    submitButton.addEventListener("click", this.handleSubmitButtonClickEvent);
    // define event handler for neutralizing the submit event and reseting the form
    formEl.addEventListener( 'submit', function (e) {
      e.preventDefault();
      formEl.reset();
    });
    document.getElementById("manageBooks").style.display = "none";
    document.getElementById("updateBook").style.display = "block";
    formEl.reset();
  },
  /**
   * handle book selection events
   * when a book is selected, populate the form with the data of the selected book
   */
  handleBookSelectChangeEvent: function () {
    var formEl = document.forms['updateBookForm'],
        key = formEl.selectBook.value,
        book=null;
    if (key !== "") {
      book = Book.instances[key];
      formEl.isbn.value = book.isbn;
      formEl.title.value = book.title;
      formEl.year.value = book.year;
      if (book.subtype) {
        formEl.subtype.selectedIndex = book.subtype;
        formEl.subtype.disabled = "disabled";
        pl.view.app.displaySegmentFields( formEl, BookTypeEL.names, book.subtype);
        switch (book.subtype) {
        case BookTypeEL.TEXTBOOK:
          formEl.subjectArea.value = book.subjectArea;
          formEl.about.value = "";
          break;
        case BookTypeEL.BIOGRAPHY:
          formEl.about.value = book.about;
          formEl.subjectArea.value = "";
          break;
        }
      } else {  // no book.subtype
        formEl.subtype.value = "";
        formEl.subtype.disabled = "";
        formEl.subjectArea.value = ""; 
        formEl.about.value = ""; 
        pl.view.app.undisplayAllSegmentFields( formEl, BookTypeEL.names);
      }
    } else {
      formEl.isbn.value = "";
      formEl.title.value = "";
      formEl.year.value = "";
    }
  },
  /**
   * handle form submission events
   */
  handleSubmitButtonClickEvent: function () {
    var formEl = document.forms['updateBookForm'],
        typeStr = formEl.subtype.value;
    var slots = { 
        isbn: formEl.isbn.value, 
        title: formEl.title.value,
        year: parseInt( formEl.year.value)
    };
    if (typeStr) {
      slots.subtype = parseInt( typeStr) + 1;
      switch (slots.subtype) {
      case BookTypeEL.TEXTBOOK:
        slots.subjectArea = formEl.subjectArea.value;
        formEl.subjectArea.setCustomValidity( 
            Book.checkSubjectArea( formEl.subjectArea.value).message);
        break;
      case BookTypeEL.BIOGRAPHY:
        slots.about = formEl.about.value;
        formEl.about.setCustomValidity( 
            Book.checkAbout( formEl.about.value).message);
        break;
      }
    }
    // check all input fields and provide error messages in case of constraint violations
    formEl.isbn.setCustomValidity( Book.checkIsbn( slots.isbn).message);
    formEl.title.setCustomValidity( Book.checkTitle( slots.title).message);
    formEl.year.setCustomValidity( Book.checkYear( slots.year).message);
    // commit the update only if all of the form fields values are valid
    if (formEl.checkValidity()) {
      Book.update( slots);
      pl.view.app.undisplayAllSegmentFields( formEl, BookTypeEL.names);
    }
  }
};
/**********************************************
 * Use case Delete Book
**********************************************/
pl.view.books.destroy = {
  /**
   * initialize the books.destroy form
   */
  setupUserInterface: function () {
    var formEl = document.forms['deleteBookForm'];
    var bookSelectEl = formEl.selectBook;
    var deleteButton = formEl.commit;
    // set up the book selection list
    util.fillAssocListWidgetSelectWithOptions( bookSelectEl, Book.instances, "isbn", {displayProp:"title"});
    deleteButton.addEventListener("click", function () {
      var formEl = document.forms['deleteBookForm'];
      if (formEl.selectBook.value) {
        Book.destroy( formEl.selectBook.value);
        // remove deleted book from select options
        formEl.selectBook.remove( formEl.selectBook.selectedIndex);
        formEl.reset();
      }
    });
    document.getElementById("manageBooks").style.display = "none";
    document.getElementById("deleteBook").style.display = "block";
    formEl.reset();
  }
};