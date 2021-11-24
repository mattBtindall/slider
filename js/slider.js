import { getAbsoluteHeight } from './utility.js';

let slides, 
    slider,
    dotNav,
    dots,
    currentSlideIndex = 0,
    nextSlideIndex;

function removeTransition(el, task) {
    el.classList.add('no-transition');
    task();
    el.offsetHeight;
    el.classList.remove('no-transition');
}

function initSlider() {
    slides = document.querySelectorAll('.slide');
    slider = document.querySelector('.slider');
    dotNav = document.querySelector('#dot-nav');

    const slideWidth = parseInt(window.getComputedStyle(slides[0]).getPropertyValue('width').slice(0,-2));
    let offSets = [(slideWidth + slideWidth), (-slideWidth - slideWidth)];
    const sliderArrows = document.querySelectorAll('.slider-arrow');

    drawDotNav();
    setSliderHeight();
    
    
    // sets all slides apart from the first to move out of the center position
    for (let i = 1; i < slides.length; ++i) {
        slides[i].style.position = 'absolute';
        slides[i].style.top = '0';
        slides[i].style.left = '0';
        removeTransition(slides[i], function() {
            slides[i].style.transform =  'translate(-850px,0)';
        });
    }

    // Add click events to the slider arrows
    sliderArrows.forEach((arrow, i) => {
        arrow.addEventListener('click', (e) => {
            const arrow = e.target.getAttribute('name');

            if (arrow === 'left-arrow') { // left decrement
                nextSlideIndex = (currentSlideIndex - 1) === -1 ? slides.length-1 : currentSlideIndex - 1;
            }
            else {  // right increment (increment and wrap)
                nextSlideIndex = (currentSlideIndex + 1) % (slides.length);
            }

            animateSlider(offSets[i]);
        });
    });

    // Add click events to the dot nav using event delegation
    dotNav.addEventListener('click', (e) => {
        const dot = e.target;
        if (dot.classList.contains('circle')) {
            let temp;
            (nextSlideIndex - dot.id > 0) ? temp = offSets[0] : temp = offSets[1];
            nextSlideIndex = dot.id;
            animateSlider(temp);
        }
    });

    // Add click events to the dot nav
    // dots.forEach((dot, i) => {
    //     dot.addEventListener('click', () => {
    //         let temp;
    //         (nextSlideIndex - i > 0) ? temp = offSets[0] : temp = offSets[1];
    //         nextSlideIndex = i;
    //         animateSlider(temp);
    //     });
    // });
}

function setSliderHeight() {
    let tallest = 0,
        tallestAbsolute;

    slides.forEach(slide => {
        if (slide.offsetHeight > tallest) {
            tallest = slide.offsetHeight;
            tallestAbsolute = getAbsoluteHeight(slide);
        }
    });
    console.log(tallest)
    console.log(tallestAbsolute)

    slides.forEach(slide => slide.style.height = tallest+'px');
    slider.style.height = tallestAbsolute+'px';
}

function drawDotNav() {
    for (let i = 0; i < slides.length; i++) {
        const dot = document.createElement('div');
        dot.classList.add('circle');
        dot.id = i;
        dotNav.appendChild(dot);
    }

    dots = document.querySelectorAll('.circle');
    updateDotNav();
}

function updateDotNav() {
    dots.forEach(dot => dot.style.background = '#A6ACAF');
    dots[currentSlideIndex].style.background = 'black';
}

function animateSlider(offSet) {
    const currentSlide = slides[currentSlideIndex],
        nextSlide = slides[nextSlideIndex];

    const flipSign = (n) => n - (n * 2); 

    removeTransition(nextSlide, () => {
        nextSlide.style.transform = `translate(${flipSign(offSet)}px,0)`; 
    });

    // move previous slide to correct side (opposite of offset)
    currentSlide.style.transform = `translate(${offSet}px,0)`;
    // move next slide into middle
    nextSlide.style.transform = 'translate(0px,0)';
    // set slide no
    currentSlideIndex = nextSlideIndex;
    updateDotNav();
}

setTimeout(() => {
    initSlider();
}, 100);
window.onload = () => {
    initSlider();
}