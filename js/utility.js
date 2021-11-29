export function getAbsoluteHeight(el) {
  el = (typeof el === 'string') ? document.querySelector(el) : el;
  console.log(el);

  const styles = window.getComputedStyle(el);
  const margins = styles.getPropertyValue('margin-top') + styles.getPropertyValue('marign-bottom');
  
  return el.offsetHeight + margins;
}

export function removeTransition(el, task) {
  el.classList.add('no-transition');
  task();
  el.offsetHeight;
  el.classList.remove('no-transition');
}

export const flipSign = (n) => n - (n * 2); 