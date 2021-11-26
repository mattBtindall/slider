import { removeTransition } from './utility.js';

export class Slider {
  constructor() {
    this.slides = document.querySelectorAll('.slide'); 
    this.slider = document.querySelector('.slider');
    this.dotNav = document.querySelector('#dot-nav');
    this.dots = [];
    this.currentSlideIndex = 0;
    this.nextSlideIndex;

    this.init();
  }

  init() {
    const slideWidth = parseInt(window.getComputedStyle(this.slides[0]).getPropertyValue('width').slice(0,-2));
    let offSets = [(slideWidth + slideWidth), (-slideWidth - slideWidth)];
    const sliderArrows = document.querySelectorAll('.slider-arrow');

    // Set height of slides so they're all the same size
    let tallest = 0;
    this.slides.forEach(slide => {
      if (slide.offsetHeight > tallest) tallest = slide.offsetHeight;
    });
    this.slides.forEach(slide => slide.style.height = tallest+'px');

    // Draw dot nav
    for (let i = 0; i < this.slides.length; i++) {
      const dot = document.createElement('div');
      dot.classList.add('slider-dot');
      dot.id = i;
      this.dotNav.appendChild(dot);
      this.dots.push(dot);
    }
    this.updateDotNav();

    // sets all slides apart from the first to move out of the center position
    for (let i = 1; i < this.slides.length; ++i) {
      this.slides[i].style.position = 'absolute';
      this.slides[i].style.top = '0';
      this.slides[i].style.left = '0';
      removeTransition(this.slides[i], () => {
        this.slides[i].style.transform = 'translate(-850px,0)';
      });
    }

    // Add click events to the slider arrows
    sliderArrows.forEach((arrow, i) => {
      arrow.addEventListener('click', (e) => {
        const arrow = e.target.getAttribute('name');

        if (arrow === 'left-arrow') { // left decrement
          this.nextSlideIndex = (this.currentSlideIndex - 1) === -1 ? this.slides.length-1 : this.currentSlideIndex - 1;
        }
        else {  // right increment (increment and wrap)
          this.nextSlideIndex = (this.currentSlideIndex + 1) % (this.slides.length);
        }

        this.animateSlider(offSets[i]);
      });
    });

    // Add click events to the dot nav using event delegation
    this.dotNav.addEventListener('click', (e) => {
      // set - transition: transform ease-in-out 300ms;
      const dot = e.target;
      if (dot.classList.contains('slider-dot')) {
        // let temp;
        let offSet = (this.nextSlideIndex - dot.id > 0) ? offSets[0] : offSets[1];
        // this.nextSlideIndex = dot.id;
        // this.animateSlider(temp);

        let temp2 = this.currentSlideIndex - dot.id;
        if (temp2 > 0) {
          console.log('positive'); // when pos needs to decrement
        } else {
          console.log('negative'); // when neg it needs to increment
          this.nextSlideIndex = this.currentSlideIndex+1;
          this.animateSlider(offSet);
          if (this.nextSlideIndex !== parseInt(dot.id)) {
            const intervalId = setInterval(() => {
              if (this.nextSlideIndex === dot.id-1) clearInterval(intervalId);
              this.nextSlideIndex = this.currentSlideIndex+1;
              this.animateSlider(offSet);
            }, 300);
          }
        }
      }
    });
  }

  animateSlider(offSet) {
    const currentSlide = this.slides[this.currentSlideIndex],
      nextSlide = this.slides[this.nextSlideIndex];

    const flipSign = (n) => n - (n * 2); 

    removeTransition(nextSlide, () => {
      nextSlide.style.transform = `translate(${flipSign(offSet)}px,0)`; 
    });

    // move previous slide to correct side (opposite of offset)
    currentSlide.style.transform = `translate(${offSet}px,0)`;
    // move next slide into middle
    nextSlide.style.transform = 'translate(0px,0)';
    // set slide no
    this.currentSlideIndex = this.nextSlideIndex;
    this.updateDotNav();
  }

  updateDotNav() {
    this.dots.forEach(dot => dot.style.background = '#A6ACAF');
    this.dots[this.currentSlideIndex].style.background = 'black';
  }
}