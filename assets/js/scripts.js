const NEXT = 1;
const PREV = -1;

class Carousel {
    constructor(carouselSelector, timeRunning = 700, timeAutoNext = 6000) {
        this.carouselDom = document.querySelector(carouselSelector);
        if (!this.carouselDom) return; // Exit if the carousel is not found

        this.nextDom = this.carouselDom.querySelector('#next');
        this.prevDom = this.carouselDom.querySelector('#prev');
        this.sliderDom = this.carouselDom.querySelector('.list');
        this.thumbnailBorderDom = this.carouselDom.querySelector('.thumbnail-container .thumbnail');
        this.timeDom = this.carouselDom.querySelector('.time');
        this.timeRunning = timeRunning;
        this.timeAutoNext = timeAutoNext;

        this.init();
    }

    init() {
        this.initThumbnails();
        this.initNavigation();
        this.startAutoSlide();
        this.resetTimeBar();

        // Show the carousel once everything is initialized
        this.carouselDom.classList.add('loaded');
    }

    initThumbnails() {
        this.thumbnailItemsDom = this.thumbnailBorderDom.querySelectorAll('.item');
        if (this.thumbnailItemsDom.length > 0) {
            this.thumbnailBorderDom.appendChild(this.thumbnailItemsDom[0]);
        }
    }

    initNavigation() {
        if (this.nextDom && this.prevDom) {
            this.nextDom.onclick = () => this.showSlider(NEXT);
            this.prevDom.onclick = () => this.showSlider(PREV);
        }
    }

    showSlider(direction) {
        this.disableButtons();

        const sliderItemsDom = this.sliderDom.querySelectorAll('.item');
        const thumbnailItemsDom = this.thumbnailBorderDom.querySelectorAll('.item');

        if (direction === NEXT) {
            this.moveSliderItemToEnd(sliderItemsDom);
            this.moveThumbnailItemToEnd(thumbnailItemsDom);
            this.carouselDom.classList.add('next');
        } else if (direction === PREV) {
            this.moveSliderItemToStart(sliderItemsDom);
            this.moveThumbnailItemToStart(thumbnailItemsDom);
            this.carouselDom.classList.add('prev');
        }

        this.resetSliderState();
    }

    moveSliderItemToEnd(items) {
        this.sliderDom.appendChild(items[0]);
    }

    moveSliderItemToStart(items) {
        this.sliderDom.prepend(items[items.length - 1]);
    }

    moveThumbnailItemToEnd(items) {
        this.thumbnailBorderDom.appendChild(items[0]);
    }

    moveThumbnailItemToStart(items) {
        this.thumbnailBorderDom.prepend(items[items.length - 1]);
    }

    resetSliderState() {
        clearTimeout(this.runTimeout);
        this.runTimeout = setTimeout(() => {
            this.clearSliderClasses();
            this.enableButtons();
        }, this.timeRunning);

        this.resetAutoSlide();
        this.resetTimeBar();
    }

    clearSliderClasses() {
        this.carouselDom.classList.remove('next', 'prev');
    }

    disableButtons() {
        this.nextDom.disabled = true;
        this.prevDom.disabled = true;
    }

    enableButtons() {
        this.nextDom.disabled = false;
        this.prevDom.disabled = false;
    }

    resetTimeBar() {
        if (!this.timeDom) return;

        this.timeDom.style.animation = 'none';
        this.timeDom.offsetHeight; // Trigger reflow to restart the animation
        this.timeDom.style.animation = `runningTime ${this.timeAutoNext / 1000}s linear 1 forwards`;
    }

    startAutoSlide() {
        this.runNextAuto = setTimeout(() => {
            if (this.nextDom) {
                this.nextDom.click();
            }
        }, this.timeAutoNext);
    }

    resetAutoSlide() {
        clearTimeout(this.runNextAuto);
        this.startAutoSlide();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initGameDetails();
    initCarousel();
    initModals();
});

function initGameDetails() {
    const gameDetailSection = document.querySelector('.game-detail');
    if (!gameDetailSection) return;

    const pageTitle = document.title;
    fetch('assets/data/games.json')
        .then(response => response.json())
        .then(data => {
            const game = data.games.find(game => game.title === pageTitle);
            if (game) {
                populateGameDetails(gameDetailSection, game);
            }
        });
}

function populateGameDetails(section, game) {
    section.querySelector('h2').innerText = game.title;
    section.querySelector('p').innerText = game.details;

    const trailerIframe = createTrailerIframe(game.trailer);
    section.appendChild(trailerIframe);

    const tableContainer = createRequirementsTable(game.requirements);
    section.appendChild(tableContainer);
}

function createTrailerIframe(trailerUrl) {
    const iframe = document.createElement('iframe');
    iframe.src = `${trailerUrl}?autoplay=1&mute=1`;
    iframe.width = "100%";
    iframe.height = "315";
    iframe.frameBorder = "0";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;
    return iframe;
}

function createRequirementsTable(requirements) {
    const tableContainer = document.createElement('div');
    tableContainer.classList.add('table-container');
    const table = document.createElement('table');

    const thead = createTableHeader(['Requirements', 'Minimum', 'Recommended']);
    table.appendChild(thead);

    const tbody = createTableBody(requirements);
    table.appendChild(tbody);

    tableContainer.appendChild(table);
    return tableContainer;
}

function createTableHeader(headers) {
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.innerText = headerText;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    return thead;
}

function createTableBody(requirements) {
    const tbody = document.createElement('tbody');
    for (const key in requirements.minimum) {
        const row = document.createElement('tr');
        const cellKey = document.createElement('td');
        cellKey.innerText = key;
        const cellMinimum = document.createElement('td');
        cellMinimum.innerText = requirements.minimum[key];
        const cellRecommended = document.createElement('td');
        cellRecommended.innerText = requirements.recommended[key];
        row.appendChild(cellKey);
        row.appendChild(cellMinimum);
        row.appendChild(cellRecommended);
        tbody.appendChild(row);
    }
    return tbody;
}

function initCarousel() {
    const carouselElement = document.querySelector('.carousel');
    if (!carouselElement) return;

    fetch('assets/data/games.json')
        .then(response => response.json())
        .then(data => {
            populateCarousel(carouselElement, data.games);
            new Carousel('.carousel');
        });
}

function populateCarousel(carouselElement, games) {
    const carouselList = carouselElement.querySelector('.list');
    const thumbnailContainer = carouselElement.querySelector('.thumbnail-container .thumbnail');

    games.forEach(game => {
        const carouselItem = createCarouselItem(game);
        carouselList.appendChild(carouselItem);

        const thumbItem = createThumbnailItem(game);
        thumbnailContainer.appendChild(thumbItem);
    });
}

function createCarouselItem(game) {
    const item = document.createElement('div');
    item.classList.add('item');
    item.innerHTML = `
        <img src="${game.image}" alt="${game.title}">
        <div class="content">
            <div class="title">${game.title}</div>
            <div class="des">${game.description}</div>
            <div class="buttons">
                <a href="${game.page}"><button>SEE MORE</button></a>
            </div>
        </div>
    `;
    return item;
}

function createThumbnailItem(game) {
    const item = document.createElement('div');
    item.classList.add('item');
    item.innerHTML = `
        <img src="${game.image}" alt="${game.title} Thumbnail">
        <div class="content">
            <div class="title">${game.title}</div>
        </div>
    `;
    return item;
}

function initModals() {
    const openRegister = document.getElementById('open-register');
    const closeRegister = document.getElementById('close-register');
    const registerModal = document.getElementById('register-modal');

    const openLogin = document.getElementById('open-login');
    const closeLogin = document.getElementById('close-login');
    const loginModal = document.getElementById('login-modal');

    if (openRegister && registerModal && closeRegister) {
        openRegister.onclick = () => registerModal.style.display = "block";
        closeRegister.onclick = () => registerModal.style.display = "none";
        window.onclick = event => {
            if (event.target === registerModal) {
                registerModal.style.display = "none";
            }
        };
    }

    if (openLogin && loginModal && closeLogin) {
        openLogin.onclick = () => loginModal.style.display = "block";
        closeLogin.onclick = () => loginModal.style.display = "none";
        window.onclick = event => {
            if (event.target === loginModal) {
                loginModal.style.display = "none";
            }
        };
    }
}
