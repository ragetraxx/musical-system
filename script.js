document.addEventListener("DOMContentLoaded", () => {
    const movieContainer = document.getElementById("movie-container");
    const videoPlayer = document.getElementById("videoPlayer");
    const searchBar = document.getElementById("searchBar");

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
        const categories = {};

        // Group by category
        movies.forEach(movie => {
            if (!categories[movie.category]) {
                categories[movie.category] = [];
            }
            categories[movie.category].push(movie);
        });

        // Create rows
        for (let category in categories) {
            const categoryTitle = document.createElement("h2");
            categoryTitle.className = "category-title";
            categoryTitle.textContent = category;
            movieContainer.appendChild(categoryTitle);

            const row = document.createElement("div");
            row.className = "movie-row";

            categories[category].forEach(movie => {
                const card = document.createElement("div");
                card.className = "movie-card";

                // Highlight search term in title
                let displayTitle = movie.title;
                if (searchTerm) {
                    const regex = new RegExp(`(${searchTerm})`, "gi");
                    displayTitle = movie.title.replace(regex, `<span class="highlight">$1</span>`);
                }

                card.innerHTML = `
                    <img src="${movie.image}" alt="${movie.title}" title="${movie.title}">
                    <div class="movie-title">${displayTitle}</div>
                `;

                card.addEventListener("click", () => loadMovie(movie));
                row.appendChild(card);
            });

            movieContainer.appendChild(row);
        }
    }

    function loadMovie(movie) {
        const match = movie.url.match(/streamsvr\/([^/]+)/);
        if (match && match[1]) {
            videoPlayer.src = `https://pkaystream.cc/embed/${match[1]}`;
        }
    }

    // Live Search
    searchBar.addEventListener("input", (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredMovies = allMovies.filter(movie =>
            movie.title.toLowerCase().includes(searchTerm)
        );
        renderMovies(filteredMovies, searchTerm);
    });
});
