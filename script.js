document.addEventListener("DOMContentLoaded", () => {
  const movieContainer = document.getElementById("movieContainer");
  const categoryFilter = document.getElementById("categoryFilter");
  const videoPlayer = document.getElementById("videoPlayer");
  const playerContainer = document.getElementById("playerContainer");
  const closePlayer = document.getElementById("closePlayer");

  let movies = [];

  fetch("movies.json")
    .then((response) => response.json())
    .then((data) => {
      movies = data;
      populateCategories(movies);
      displayMovies(movies);
    })
    .catch((error) => console.error("Error loading movies:", error));

  function populateCategories(movies) {
    const categories = new Set(["All"]);
    movies.forEach((movie) => categories.add(movie.category));
    categoryFilter.innerHTML = "";
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
    });
  }

  function displayMovies(movieList) {
    movieContainer.innerHTML = "";
    movieList.forEach((movie) => {
      const movieItem = document.createElement("div");
      movieItem.classList.add("movie-item");

      const img = document.createElement("img");
      img.src = movie.image;
      img.alt = movie.title;
      img.classList.add("movie-img");
      img.addEventListener("click", () => playMovie(movie.url));

      const title = document.createElement("div");
      title.textContent = movie.title;
      title.classList.add("movie-title");

      movieItem.appendChild(img);
      movieItem.appendChild(title);
      movieContainer.appendChild(movieItem);
    });
  }

  categoryFilter.addEventListener("change", () => {
    const selected = categoryFilter.value;
    if (selected === "All") {
      displayMovies(movies);
    } else {
      const filtered = movies.filter((m) => m.category === selected);
      displayMovies(filtered);
    }
  });

  window.searchMovies = function () {
    const query = document.getElementById("searchBar").value.toLowerCase();
    const items = document.querySelectorAll(".movie-item");
    items.forEach((item) => {
      const title = item.querySelector(".movie-title")?.textContent.toLowerCase() || "";
      item.style.display = title.includes(query) ? "block" : "none";
    });
  };

  window.playMovie = function (url) {
    videoPlayer.src = url;
    playerContainer.classList.add("active");
    videoPlayer.play();
  };

  closePlayer.addEventListener("click", () => {
    playerContainer.classList.remove("active");
    videoPlayer.pause();
    videoPlayer.src = "";
  });
});
