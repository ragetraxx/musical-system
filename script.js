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
            populateCategories(movies);
            displayMovies(movies);
        })
        .catch(error => console.error("Error loading movies:", error));

    function populateCategories(movies) {
        const categories = new Set(["All"]); // Default category "All"
        movies.forEach(movie => categories.add(movie.category));
        
        categoryFilter.innerHTML = ""; // Clear existing options

        categories.forEach(category => {
            const option = document.createElement("option");
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
    }

    function displayMovies(filteredMovies) {
        movieContainer.innerHTML = ""; // Clear previous content

        filteredMovies.forEach(movie => {
            const movieElement = document.createElement("div");
            movieElement.classList.add("movie-item");
            movieElement.innerHTML = `
                <img src="${movie.image}" alt="${movie.title}" class="movie-img" onclick="playMovie('${movie.url}')">
                <h3>${movie.title}</h3>
                <button onclick="playMovie('${movie.url}')">Watch</button>
            `;
            movieContainer.appendChild(movieElement);
        });
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


    window.playMovie = function(url) {
        videoPlayer.src = url;
        playerContainer.classList.add("active");
        videoPlayer.play();
    }

    closePlayer.addEventListener("click", () => {
        playerContainer.classList.remove("active");
        videoPlayer.pause();
        videoPlayer.src = "";
    });

    // Filter movies when category changes
    categoryFilter.addEventListener("change", () => {
        const selectedCategory = categoryFilter.value;
        if (selectedCategory === "All") {
            displayMovies(movies);
        } else {
            const filteredMovies = movies.filter(movie => movie.category === selectedCategory);
            displayMovies(filteredMovies);
        }
    });
});
