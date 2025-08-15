document.addEventListener("DOMContentLoaded", () => {
    const movieContainer = document.getElementById("movie-container");
    const modal = document.getElementById("videoModal");
    const closeModal = document.getElementById("closeModal");
    const videoPlayer = document.getElementById("videoPlayer");

    fetch("movie.json")
        .then(res => res.json())
        .then(data => {
            const categories = {};

            // Group by category
            data.forEach(movie => {
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
                    card.innerHTML = `<img src="${movie.image}" alt="${movie.title}" title="${movie.title}">`;
                    
                    card.addEventListener("click", () => {
                        const match = movie.url.match(/streamsvr\/([^/]+)/);
                        if (match && match[1]) {
                            videoPlayer.src = `https://pkaystream.cc/embed/${match[1]}`;
                            modal.style.display = "block";
                        }
                    });

                    row.appendChild(card);
                });

                movieContainer.appendChild(row);
            }
        });

    // Close modal
    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
        videoPlayer.src = "";
    });

    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
            videoPlayer.src = "";
        }
    });
});
