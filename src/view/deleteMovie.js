pl.view.deleteMovie = {
  setupUserInterface: function () {
    var deleteButton = document.forms['Movie'].commit;
    var selectEl = document.forms['Movie'].selectMovie;
    var key="", keys=[], movie=null, optionEl=null;
    // load all movie objects
    Movie.loadAll();
    keys = Object.keys( Movie.instances);
    // populate the selection list with movies
    for (i=0; i < keys.length; i++) {
      key = keys[i];
      movie = Movie.instances[key];
      optionEl = document.createElement("option");
      optionEl.text = movie.title;
      optionEl.value = movie.released;
      selectEl.add( optionEl, null);
    }
    deleteButton.addEventListener("click",
        pl.view.deleteMovie.handleDeleteButtonClickEvent);
    window.addEventListener("beforeunload", function () {
        Movie.saveAll();
    });
  },
  handleDeleteButtonClickEvent: function () {
    var selectEl = document.forms['Movie'].selectMovie;
    var isbn = selectEl.value;
    if (isbn) {
      Movie.destroy( isbn);
      selectEl.remove( selectEl.selectedIndex);
    }
  }
};
