// Scrollt NUR den nächsten scrollbaren Container – nie die ganze Seite.
// (element.scrollIntoView würde auch Container mit overflow:hidden verschieben.)
export function scrollWithin(el: HTMLElement | null, mode: 'nearest' | 'center' = 'nearest', smooth = true) {
  if (!el) return;
  let p = el.parentElement;
  while (p) {
    const oy = getComputedStyle(p).overflowY;
    if ((oy === 'auto' || oy === 'scroll') && p.scrollHeight > p.clientHeight) break;
    p = p.parentElement;
  }
  if (!p) return;
  const er = el.getBoundingClientRect();
  const pr = p.getBoundingClientRect();
  let top = p.scrollTop;
  if (mode === 'center') top += er.top - pr.top - (pr.height - er.height) / 2;
  else if (er.top < pr.top) top -= pr.top - er.top + 8;
  else if (er.bottom > pr.bottom) top += er.bottom - pr.bottom + 8;
  else return;
  p.scrollTo({ top, behavior: smooth ? 'smooth' : 'auto' });
}
