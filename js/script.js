/* ==========================================================
   Bredowtreff – kleine Helfer. Im Alltag NICHT ändern.
   Ohne JavaScript funktioniert die Seite trotzdem vollständig.
   ========================================================== */
(() => {
  'use strict';

  /* Archiv: Fotos groß anzeigen */
  const galerien = document.querySelectorAll('.galerie');
  if (!galerien.length || !window.HTMLDialogElement) return;

  const dlg = document.createElement('dialog');
  dlg.className = 'lightbox';
  dlg.setAttribute('aria-label', 'Fotoansicht');
  dlg.innerHTML = `
    <figure><img alt=""><figcaption></figcaption></figure>
    <button type="button" class="lb-zu" aria-label="Schließen">✕</button>
    <button type="button" class="lb-zurueck" aria-label="Vorheriges Foto">‹</button>
    <button type="button" class="lb-weiter" aria-label="Nächstes Foto">›</button>`;
  document.body.append(dlg);
  const bild = dlg.querySelector('img');
  const text = dlg.querySelector('figcaption');
  let fotos = [], index = 0, ausloeser = null;

  const zeige = i => {
    index = (i + fotos.length) % fotos.length;
    const alt = fotos[index].querySelector('img').alt;
    bild.src = fotos[index].href;
    bild.alt = alt;
    text.textContent = `${alt} (${index + 1}/${fotos.length})`;
  };

  galerien.forEach(g => {
    const links = [...g.querySelectorAll('a')];
    links.forEach((a, i) => a.addEventListener('click', e => {
      e.preventDefault();
      fotos = links;
      ausloeser = a;
      zeige(i);
      dlg.showModal();
    }));
  });

  dlg.querySelector('.lb-zu').addEventListener('click', () => dlg.close());
  dlg.querySelector('.lb-zurueck').addEventListener('click', () => zeige(index - 1));
  dlg.querySelector('.lb-weiter').addEventListener('click', () => zeige(index + 1));
  dlg.addEventListener('click', e => { if (e.target === dlg || e.target.tagName === 'FIGURE') dlg.close(); });
  dlg.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') zeige(index - 1);
    if (e.key === 'ArrowRight') zeige(index + 1);
  });
  dlg.addEventListener('close', () => { bild.removeAttribute('src'); ausloeser?.focus(); });

  let startX = null;
  dlg.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  dlg.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - (startX ?? e.changedTouches[0].clientX);
    if (Math.abs(dx) > 50) zeige(index + (dx < 0 ? 1 : -1));
    startX = null;
  });
})();
