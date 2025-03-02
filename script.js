document.addEventListener("DOMContentLoaded", () => {
    const movieContainer = document.getElementById("movieContainer");
    const categoryFilter = document.getElementById("categoryFilter");
    const playerContainer = document.getElementById("playerContainer");
    const videoPlayer = document.getElementById("videoPlayer");
    const closePlayer = document.getElementById("closePlayer");

    let movies = [];

    // Fetch movies.json and log errors if any
    fetch("./movies.json")
        .then(response => response.json())
        .then(data => {
            console.log("Movies loaded:", data); // Debugging log
            movies = data;
            displayMovies(movies);
        })
        .catch(error => console.error("Error loading movies:", error));

    function displayMovies(movies) {
        movieContainer.innerHTML = ""; // Clear previous content

        movies.forEach(movie => {
            const movieElement = document.createElement("div");
            movieElement.classList.add("movie-item");
            movieElement.innerHTML = `
                <img src="${movie.image}" alt="${movie.title}">
                <h3>${movie.title}</h3>
                <button onclick="playMovie('${movie.url}')">Watch</button>
            `;
            movieContainer.appendChild(movieElement);
        });
    }

    function playMovie(url) {
        videoPlayer.src = url;
        playerContainer.classList.remove("hidden");
    }

    closePlayer.addEventListener("click", () => {
        playerContainer.classList.add("hidden");
        videoPlayer.src = "";
    });
});
