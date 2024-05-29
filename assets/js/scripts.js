const NEXT = 1;
const PREV = -1;

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

        this.nextDom.onclick = () => this.showSlider(NEXT);
        this.prevDom.onclick = () => this.showSlider(PREV);

        this.startAutoSlide();

        this.resetTimeBar();
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

        clearTimeout(this.runTimeout);
        this.runTimeout = setTimeout(() => {
            this.clearSliderClasses();
            this.enableButtons();
        }, this.timeRunning);

        this.resetAutoSlide();

        this.resetTimeBar();
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

    clearSliderClasses() {
        this.carouselDom.classList.remove('next');
        this.carouselDom.classList.remove('prev');
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

    startAutoSlide() {
        this.runNextAuto = setTimeout(() => {
            this.nextDom.click();
        }, this.timeAutoNext);
    }

    resetAutoSlide() {
        clearTimeout(this.runNextAuto);
        this.startAutoSlide();
    }
}

// Initialize the carousel
document.addEventListener('DOMContentLoaded', () => {
    new Carousel('.carousel');
});
