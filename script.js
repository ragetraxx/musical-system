document.addEventListener("DOMContentLoaded", () => {
    const movieContainer = document.getElementById("movieContainer");
    const categoryFilter = document.getElementById("categoryFilter");
    const playerContainer = document.getElementById("playerContainer");
    const videoPlayer = document.getElementById("videoPlayer");
    const closePlayer = document.getElementById("closePlayer");

    let movies = [];

    // Fetch movies.json
    fetch("./movies.json")
        .then(response => response.json())
        .then(data => {
            movies = data;
            displayMovies(movies);
            populateCategories(movies);
        });

    function displayMovies(movies) {
        movieContainer.innerHTML = "";
        movies.forEach(movie => {
            const movieItem = document.createElement("div");
            movieItem.classList.add("movie-item");
            movieItem.innerHTML = `
                <img src="${movie.image}" alt="${movie.title}" class="movie-image">
                <h3 class="movie-title">${movie.title}</h3>
                <button onclick="playMovie('${movie.url}')">Play</button>
            `;
            movieContainer.appendChild(movieItem);
        });
    }

    function populateCategories(movies) {
        const categories = [...new Set(movies.map(movie => movie.category))];
        categoryFilter.innerHTML = `<option value="all">All</option>`;
        categories.forEach(category => {
            const option = document.createElement("option");
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
    }

    categoryFilter.addEventListener("change", () => {
        const selectedCategory = categoryFilter.value;
        const filteredMovies = selectedCategory === "all" 
            ? movies 
            : movies.filter(movie => movie.category === selectedCategory);
        displayMovies(filteredMovies);
    });

    closePlayer.addEventListener("click", () => {
        playerContainer.classList.add("hidden");
        videoPlayer.pause();
        videoPlayer.src = ""; // Stop and reset video source
    });
});

// Fixed playMovie function with debugging
function playMovie(url) {
    const playerContainer = document.getElementById("playerContainer");
    const videoPlayer = document.getElementById("videoPlayer");

    console.log("Playing movie:", url); // Debugging: Check if URL is valid

    videoPlayer.src = url;
    videoPlayer.load(); // Ensure the new source is loaded
    videoPlayer.play(); // Start playing the movie

    playerContainer.classList.remove("hidden"); // Show the player
}

// Search function
function searchMovies() {
    let input = document.getElementById("searchBar").value.toLowerCase();
    let movies = document.querySelectorAll("#movieContainer .movie-item");

    movies.forEach(movie => {
        let title = movie.querySelector(".movie-title").textContent.toLowerCase();
        movie.style.display = title.includes(input) ? "block" : "none";
    });
}
