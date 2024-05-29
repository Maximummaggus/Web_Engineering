class Carousel {
    constructor(carouselSelector, timeRunning = 700, timeAutoNext = 6000) {
        this.carouselDom = document.querySelector(carouselSelector);
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
        this.thumbnailItemsDom = this.thumbnailBorderDom.querySelectorAll('.item');
        this.thumbnailBorderDom.appendChild(this.thumbnailItemsDom[0]);

        this.nextDom.onclick = () => this.showSlider('next');
        this.prevDom.onclick = () => this.showSlider('prev');

        this.runNextAuto = setTimeout(() => {
            this.nextDom.click();
        }, this.timeAutoNext);

        this.resetTimeBar();
    }

    showSlider(type) {
        this.disableButtons();

        const sliderItemsDom = this.sliderDom.querySelectorAll('.item');
        const thumbnailItemsDom = this.thumbnailBorderDom.querySelectorAll('.item');

        if (type === 'next') {
            this.sliderDom.appendChild(sliderItemsDom[0]);
            this.thumbnailBorderDom.appendChild(thumbnailItemsDom[0]);
            this.carouselDom.classList.add('next');
        } else {
            this.sliderDom.prepend(sliderItemsDom[sliderItemsDom.length - 1]);
            this.thumbnailBorderDom.prepend(thumbnailItemsDom[thumbnailItemsDom.length - 1]);
            this.carouselDom.classList.add('prev');
        }

        clearTimeout(this.runTimeout);
        this.runTimeout = setTimeout(() => {
            this.carouselDom.classList.remove('next');
            this.carouselDom.classList.remove('prev');
            this.enableButtons();
        }, this.timeRunning);

        clearTimeout(this.runNextAuto);
        this.runNextAuto = setTimeout(() => {
            this.nextDom.click();
        }, this.timeAutoNext);

        this.resetTimeBar();
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
        this.timeDom.style.animation = 'none';
        this.timeDom.offsetHeight; // Trigger reflow to restart the animation
        this.timeDom.style.animation = `runningTime ${this.timeAutoNext / 1000}s linear 1 forwards`;
    }
}

// Initialize the carousel
document.addEventListener('DOMContentLoaded', () => {
    new Carousel('.carousel');
});
