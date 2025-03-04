function playMovie(url) {
    const playerContainer = document.getElementById("playerContainer");
    const videoPlayer = document.getElementById("videoPlayer");

    videoPlayer.src = url;
    videoPlayer.load(); // Ensure the new source is loaded
    videoPlayer.play(); // Start playing the movie

    playerContainer.classList.remove("hidden"); // Show the player
}
