document.addEventListener("DOMContentLoaded", () => {
    const movieContainer = document.getElementById("movieContainer");
    const categoryFilter = document.getElementById("categoryFilter");
    const playerContainer = document.getElementById("playerContainer");
    const videoPlayer = document.getElementById("videoPlayer");
    const closePlayer = document.getElementById("closePlayer");

    let movies = [];

    // Fetch movies.json
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
        const categories = [...new Set(movies.map(movie => movie.category))];
        categoryFilter.innerHTML = '<option value="All">All Categories</option>';
        categories.forEach(category => {
            const option = document.createElement("option");
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });

        categoryFilter.addEventListener("change", () => {
            const selectedCategory = categoryFilter.value;
            const filteredMovies = selectedCategory === "All" ? movies : movies.filter(movie => movie.category === selectedCategory);
            populateMovies(filteredMovies);
        });
    }

    function playMovie(url) {
        videoPlayer.src = url;
        playerContainer.classList.add("show"); // Use CSS transition
    }

    closePlayer.addEventListener("click", () => {
        videoPlayer.pause(); // Stop video playback
        videoPlayer.src = "";
        playerContainer.classList.remove("show");
    });

    // Close video on background click
    playerContainer.addEventListener("click", (event) => {
        if (event.target === playerContainer) {
            closePlayer.click();
        }
    });
});
