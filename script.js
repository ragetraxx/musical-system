document.addEventListener("DOMContentLoaded", () => {
    const movieContainer = document.getElementById("movieContainer");
    const categoryFilter = document.getElementById("categoryFilter");
    const playerContainer = document.getElementById("playerContainer");
    const videoPlayer = document.getElementById("videoPlayer");
    const closePlayer = document.getElementById("closePlayer");

    let movies = [];

    // Fetch movies.json instead of movie.txt
    fetch("movies.json")
        .then(response => response.json())
        .then(data => {
            movies = data;
            populateMovies(movies);
            populateCategories(movies);
        })
        .catch(error => console.error("Error fetching movies:", error));

    function populateMovies(movieList) {
        movieContainer.innerHTML = ""; // Clear previous content
        movieList.forEach(movie => {
            const movieItem = document.createElement("div");
            movieItem.classList.add("movieItem");
            movieItem.innerHTML = `
                <img src="${movie.image}" alt="${movie.title}" class="movieThumbnail">
                <h3>${movie.title}</h3>
                <p>${movie.category}</p>
            `;
            movieItem.addEventListener("click", () => playMovie(movie.url));
            movieContainer.appendChild(movieItem);
        });
    }

    function populateCategories(movies) {
        const categories = new Set(movies.map(movie => movie.category));
        categoryFilter.innerHTML = '<option value="All">All Categories</option>';
        categories.forEach(category => {
            const option = document.createElement("option");
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });

        categoryFilter.addEventListener("change", () => {
            const selectedCategory = categoryFilter.value;
            if (selectedCategory === "All") {
                populateMovies(movies);
            } else {
                populateMovies(movies.filter(movie => movie.category === selectedCategory));
            }
        });
    }

    function playMovie(url) {
        videoPlayer.src = url;
        playerContainer.style.display = "flex";
    }

    closePlayer.addEventListener("click", () => {
        videoPlayer.src = "";
        playerContainer.style.display = "none";
    });
});
