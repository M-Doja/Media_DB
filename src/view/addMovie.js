pl.view.createMovie = {
  setupUserInterface: function () {
    var saveButton = document.forms['Movie'].commit;
    // load all book objects
    Movie.loadAll();
    // Set an event handler for the save/submit button
    saveButton.addEventListener("click",
        pl.view.createMovie.handleSaveButtonClickEvent);
    window.addEventListener("beforeunload", function () {
        Movie.saveAll();
    });
  },
  // save user input data
  handleSaveButtonClickEvent: function () {
    var formEl = document.forms['Movie'];
    var slots = {
        title: formEl.title.value,
        summary: formEl.summary.value,
        genre: formEl.genre.value,
        poster: formEl.poster.value,
        director: formEl.director.value,
        released: formEl.released.value
      };
    Movie.add( slots);
    formEl.reset();
  }
};
