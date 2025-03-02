document.addEventListener("DOMContentLoaded", () => {
    const movieContainer = document.getElementById("movieContainer");
    const categoryFilter = document.getElementById("categoryFilter");
    const playerContainer = document.getElementById("playerContainer");
    const videoPlayer = document.getElementById("videoPlayer");
    const closePlayer = document.getElementById("closePlayer");

    let movies = [];

    // Fetch movies.json instead of movie.txt
    fetch("./movies.json") // Ensure correct path
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to load movies.json");
            }
            return response.json();
        })
        .then(data => {
            movies = data;
            displayMovies(movies);
        })
        .catch(error => console.error("Error loading movies:", error));
});
