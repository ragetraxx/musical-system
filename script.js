document.addEventListener("DOMContentLoaded", () => {
  const movieContainer = document.getElementById("movie-container");
  const videoPlayer = document.getElementById("videoPlayer");
  const videoTitle = document.getElementById("videoTitle");
  const videoCategory = document.getElementById("videoCategory");
  const searchBar = document.getElementById("searchBar");

  const VLC_UA = "VLC/3.0.18 LibVLC/3.0.18";
  let allMovies = [];

  fetch("movie.json")
    .then(res => res.json())
    .then(data => {
      allMovies = data;
      renderMovies(allMovies);

      // Load first movie by default
      if (allMovies.length > 0) {
        loadMovie(allMovies[0]);
      }
    });

  function renderMovies(movies, searchTerm = "") {
    movieContainer.innerHTML = "";

    movies.forEach(movie => {
      let displayTitle = movie.title;
      if (searchTerm) {
        const regex = new RegExp(`(${searchTerm})`, "gi");
        displayTitle = movie.title.replace(regex, `<span class="highlight">$1</span>`);
      }

      const card = document.createElement("div");
      card.className = "movie-card";
      card.innerHTML = `
        <img src="${movie.image}" alt="${movie.title}" />
        <div class="movie-info">
          <div class="movie-title">${displayTitle}</div>
          <div class="movie-category">${movie.category}</div>
        </div>
      `;

      card.addEventListener("click", () => loadMovie(movie));
      movieContainer.appendChild(card);
    });
  }

  function loadMovie(movie) {
    videoTitle.textContent = movie.title;
    videoCategory.textContent = movie.category;

    const url = movie.url;

    if (url.endsWith(".m3u8") && Hls.isSupported()) {
      const hls = new Hls({
        xhrSetup: function (xhr, url) {
          xhr.setRequestHeader("User-Agent", VLC_UA);
        }
      });
      hls.loadSource(url);
      hls.attachMedia(videoPlayer);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        videoPlayer.play();
      });
    } else {
      fetch(url, { headers: { "User-Agent": VLC_UA } })
        .then(res => {
          if (!res.ok) throw new Error("Failed to load video");
          return res.blob();
        })
        .then(blob => {
          videoPlayer.src = URL.createObjectURL(blob);
          videoPlayer.play();
        })
        .catch(err => console.error("Playback error:", err));
    }
  }

  // Search
  searchBar.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = allMovies.filter(movie =>
      movie.title.toLowerCase().includes(searchTerm)
    );
    renderMovies(filtered, searchTerm);
  });
});
