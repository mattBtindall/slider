export function getAbsoluteHeight(el) {
  if (typeof el === 'string') el = document.querySelector(el);

  const styles = window.getComputedStyle(el);
  const margins = styles.getPropertyValue('margin-top') + styles.getPropertyValue('marign-bottom');
  
  return el.offsetHeight + margins;
}