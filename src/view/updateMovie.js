pl.view.updateMovie = {
  setupUserInterface: function () {
    var formEl = document.forms['Movie'],
        saveButton = formEl.commit,
        selectMovieEl = formEl.selectMovie;
    var key="", keys=[], movie=null, optionEl=null;
    // load all movie objects
    Movie.loadAll();
    // populate the selection list with movies
    keys = Object.keys( Movie.instances);
    for (i=0; i < keys.length; i++) {
      key = keys[i];
      movie = Movie.instances[key];
      optionEl = document.createElement("option");
      optionEl.text = movie.title;
      optionEl.value = movie.released;
      selectMovieEl.add( optionEl, null);
    }
    // when a movie is selected, populate the form with the movie data
    selectMovieEl.addEventListener("change", function () {
        var movie=null, key = selectMovieEl.value;
        if (key) {
          movie = Movie.instances[key];
          formEl.released.value = movie.released;
          formEl.title.value = movie.title;
          formEl.genre.value = movie.genre;
        } else {
          formEl.reset();
        }
    });
    saveButton.addEventListener("click",
        pl.view.updateMovie.handleUpdateButtonClickEvent);
    window.addEventListener("beforeunload", function () {
        Movie.saveAll();
    });
  },
  handleUpdateButtonClickEvent: function () {
    var formEl = document.forms['Movie'];
    var slots = {
        title: formEl.title.value,
        summary: formEl.summary.value,
        genre: formEl.genre.value,
        poster: formEl.poster.value,
        director: formEl.director.value,
        released: formEl.released.value
      };
    Movie.update( slots);
    formEl.reset();
  }
};
