document.addEventListener("DOMContentLoaded", () => {
  const movieContainer = document.getElementById("movie-container");
  const videoTitle = document.getElementById("videoTitle");
  const videoDescription = document.getElementById("videoDescription");
  const searchBar = document.getElementById("searchBar");

  let allMovies = [];
  let player; // JW Player instance

  // ✅ Load movie.json
  fetch("movie.json")
    .then(res => res.json())
    .then(data => {
      allMovies = data;
      renderMovies(allMovies);
      if (allMovies.length > 0) loadMovie(allMovies[0]); // autoplay first movie
    });

  // ✅ Render Sidebar
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
          <div class="movie-category">${movie.category || ""}</div>
        </div>
      `;
      card.addEventListener("click", () => loadMovie(movie));
      movieContainer.appendChild(card);
    });
  }

  // ✅ Get description from TMDB API relay
  async function fetchDescription(title) {
    try {
      const r = await fetch(`/api/tmdb?query=${encodeURIComponent(title)}`);
      if (!r.ok) throw new Error("tmdb relay failed");
      const data = await r.json();
      if (data && data.results && data.results.length) {
        return data.results[0].overview || "No description available.";
      }
      return "No description found.";
    } catch {
      return "Description unavailable.";
    }
  }

  // ✅ Load into JW Player
  async function loadMovie(movie) {
    videoTitle.textContent = movie.title;
    videoDescription.textContent = "Loading description...";
    videoDescription.textContent = await fetchDescription(movie.title);

    const proxied = `/api/proxy?url=${encodeURIComponent(movie.url)}`;

    if (!player) {
      // Initialize JW Player once
      player = jwplayer("videoPlayer").setup({
        file: proxied,
        image: movie.image || "",
        width: "100%",
        aspectratio: "16:9",
        autostart: true,
        controls: true
      });
    } else {
      // Load new movie
      player.load([{
        file: proxied,
        image: movie.image || ""
      }]);
      player.play();
    }
  }

  // ✅ Search
  searchBar.addEventListener("input", (e) => {
    const q = e.target.value.toLowerCase();
    const filtered = allMovies.filter(m => m.title.toLowerCase().includes(q));
    renderMovies(filtered, q);
  });
});
