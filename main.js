document.addEventListener('DOMContentLoaded', () => {

    // Header Scroll Effect
    const mainLogo = document.querySelector('.main-logo');
    const siteHeader = document.querySelector('.site-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            mainLogo.style.opacity = '0';
            siteHeader.classList.add('scrolled');
        } else {
            mainLogo.style.opacity = '1';
            siteHeader.classList.remove('scrolled');
        }
    });

    // Preloader
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    });

    // Playlist Player
    const tracks = [
        {
            title: 'Broken Dreams',
            artist: 'Social Gore',
            src: 'BrokenDreams.mp3',
            artwork: 'image1.jpg'
        },
        // Add more tracks here
    ];

    const playerCard = document.querySelector('.player-card');
    if (playerCard) {
        const albumArt = playerCard.querySelector('.album-art');
        const trackTitle = playerCard.querySelector('.track-title');
        const trackArtist = playerCard.querySelector('.track-artist');
        const audio = playerCard.querySelector('.audio-source');
        const playBtn = playerCard.querySelector('.play-btn');
        const prevBtn = playerCard.querySelector('.prev-btn');
        const nextBtn = playerCard.querySelector('.next-btn');
        const progressContainer = playerCard.querySelector('.progress-container');
        const progress = playerCard.querySelector('.progress');
        const playlist = document.querySelector('.playlist');

        let trackIndex = 0;

        function loadTrack(index) {
            const track = tracks[index];
            albumArt.src = track.artwork;
            trackTitle.textContent = track.title;
            trackArtist.textContent = track.artist;
            audio.src = track.src;
        }

        function renderPlaylist() {
            playlist.innerHTML = '';
            tracks.forEach((track, index) => {
                const item = document.createElement('div');
                item.classList.add('playlist-item');
                if (index === trackIndex) {
                    item.classList.add('active');
                }
                item.innerHTML = `
                    <img src="${track.artwork}" alt="${track.title}">
                    <div>
                        <h3>${track.title}</h3>
                        <p>${track.artist}</p>
                    </div>
                `;
                item.addEventListener('click', () => {
                    trackIndex = index;
                    loadTrack(trackIndex);
                    playTrack();
                    renderPlaylist();
                });
                playlist.appendChild(item);
            });
        }

        function playTrack() {
            playerCard.classList.add('playing');
            playBtn.querySelector('i.fas').classList.remove('fa-play');
            playBtn.querySelector('i.fas').classList.add('fa-pause');
            audio.play();
        }

        function pauseTrack() {
            playerCard.classList.remove('playing');
            playBtn.querySelector('i.fas').classList.add('fa-play');
            playBtn.querySelector('i.fas').classList.remove('fa-pause');
            audio.pause();
        }

        function prevTrack() {
            trackIndex--;
            if (trackIndex < 0) {
                trackIndex = tracks.length - 1;
            }
            loadTrack(trackIndex);
            playTrack();
            renderPlaylist();
        }

        function nextTrack() {
            trackIndex++;
            if (trackIndex > tracks.length - 1) {
                trackIndex = 0;
            }
            loadTrack(trackIndex);
            playTrack();
            renderPlaylist();
        }

        function updateProgress(e) {
            const { duration, currentTime } = e.srcElement;
            const progressPercent = (currentTime / duration) * 100;
            progress.style.width = `${progressPercent}%`;
        }

        function setProgress(e) {
            const width = this.clientWidth;
            const clickX = e.offsetX;
            const duration = audio.duration;
            audio.currentTime = (clickX / width) * duration;
        }

        playBtn.addEventListener('click', () => {
            const isPlaying = playerCard.classList.contains('playing');
            if (isPlaying) {
                pauseTrack();
            } else {
                playTrack();
            }
        });

        prevBtn.addEventListener('click', prevTrack);
        nextBtn.addEventListener('click', nextTrack);

        audio.addEventListener('timeupdate', updateProgress);
        progressContainer.addEventListener('click', setProgress);

        audio.addEventListener('ended', nextTrack);

        loadTrack(trackIndex);
        renderPlaylist();
    }

    // Gear Slider
    let slideIndex = 0;
    showSlides();

    function showSlides() {
        let i;
        const slides = document.querySelectorAll(".gear-slider .slide");
        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
            slides[i].classList.remove("active");
        }
        slideIndex++;
        if (slideIndex > slides.length) {slideIndex = 1}
        slides[slideIndex-1].style.display = "block";
        slides[slideIndex-1].classList.add("active");
        setTimeout(showSlides, 4000); // Change image every 4 seconds
    }
});