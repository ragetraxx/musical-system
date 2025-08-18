document.addEventListener("DOMContentLoaded", () => {
  const movieContainer = document.getElementById("movie-container");
  const videoPlayer = document.getElementById("videoPlayer");
  const videoTitle = document.getElementById("videoTitle");
  const videoDescription = document.getElementById("videoDescription");
  const searchBar = document.getElementById("searchBar");

  let allMovies = [];

  fetch("movie.json")
    .then(res => res.json())
    .then(data => {
      allMovies = data;
      renderMovies(allMovies);
      if (allMovies.length > 0) loadMovie(allMovies[0]);
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
          <div class="movie-category">${movie.category || ""}</div>
        </div>
      `;
      card.addEventListener("click", () => loadMovie(movie));
      movieContainer.appendChild(card);
    });
  }

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

  async function loadMovie(movie) {
    videoTitle.textContent = movie.title;
    videoDescription.textContent = "Loading description...";
    videoDescription.textContent = await fetchDescription(movie.title);

    const proxied = `/api/proxy?url=${encodeURIComponent(movie.url)}`;

    // HLS
    if (movie.url.toLowerCase().includes(".m3u8") && window.Hls && Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(proxied);
      hls.attachMedia(videoPlayer);
      hls.on(Hls.Events.MANIFEST_PARSED, () => videoPlayer.play());
      hls.on(Hls.Events.ERROR, (e, data) => console.error("HLS error:", data));
      return;
    }

    // MP4/MKV/others via proxy
    videoPlayer.src = proxied;
    videoPlayer.play().catch(() => {/* autoplay block */});
  }

  // Search
  searchBar.addEventListener("input", (e) => {
    const q = e.target.value.toLowerCase();
    const filtered = allMovies.filter(m => m.title.toLowerCase().includes(q));
    renderMovies(filtered, q);
  });
});
