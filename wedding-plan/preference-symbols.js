(function(){
  const style=document.createElement('style');
  style.textContent=`
    /* Indicateurs très visibles : aucun changement de taille des sièges/tables */
    .pref-symbols{display:inline-flex;align-items:center;gap:5px;vertical-align:middle;white-space:nowrap;flex:0 0 auto}
    .pref-flag{display:inline-flex;align-items:center;justify-content:center;font-weight:950;line-height:1;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,.20)}
    .pref-flag.veg{background:#168447;color:#fff;border:2px solid #0b5c2d}
    .pref-flag.preg{background:#df2d7a;color:#fff;border:2px solid #a81757}

    /* Sur les tables : gros pictogramme coloré juste à côté du prénom */
    .seatbody{width:100%}
    .seat-name-line{display:flex;align-items:center;justify-content:center;gap:5px;width:100%;min-width:0}
    .seat-name-line .seatname{flex:1 1 auto;min-width:0;max-width:none!important;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .seat-name-line .pref-symbols{margin-left:2px}
    .seat-name-line .pref-flag{width:27px;height:27px;border-radius:8px;font-size:17px;padding:0}
    .seatbadges{display:none!important}

    /* Dans la liste : gros badge texte + symbole */
    .gname{display:flex;align-items:center;gap:7px;flex-wrap:wrap}
    .gname .pref-symbols{margin-left:2px}
    .gname .pref-flag{min-height:27px;border-radius:8px;padding:5px 8px;font-size:12px;letter-spacing:.03em;gap:4px}
    .gname .pref-flag .ico{font-size:16px}
    .gname .pref-flag .label{font-size:11px;font-weight:950}
    .guest .badges{display:none!important}
  `;
  document.head.appendChild(style);

  function symbolsFor(id,context){
    const p=pref(+id);
    const out=[];
    if(p.vegetarian){
      out.push(context==='seat'
        ? '<span class="pref-flag veg" title="Végétarien" aria-label="Végétarien">🌱</span>'
        : '<span class="pref-flag veg" title="Végétarien"><span class="ico">🌱</span><span class="label">VEG</span></span>');
    }
    if(p.pregnant){
      out.push(context==='seat'
        ? '<span class="pref-flag preg" title="Enceinte" aria-label="Enceinte">🤰</span>'
        : '<span class="pref-flag preg" title="Enceinte"><span class="ico">🤰</span><span class="label">ENCEINTE</span></span>');
    }
    return out.length?`<span class="pref-symbols">${out.join('')}</span>`:'';
  }

  function decorateGuests(){
    document.querySelectorAll('.guest[data-id]').forEach(el=>{
      const id=+el.dataset.id,name=el.querySelector('.gname');
      if(!name)return;
      name.querySelector('.pref-symbols')?.remove();
      const html=symbolsFor(id,'list');
      if(html)name.insertAdjacentHTML('beforeend',html);
    });
  }

  function decorateSeats(){
    document.querySelectorAll('.seat[data-id]').forEach(el=>{
      const id=+el.dataset.id;
      if(!id)return;
      const body=el.querySelector('.seatbody'),name=el.querySelector('.seatname');
      if(!body||!name)return;
      let line=body.querySelector('.seat-name-line');
      if(!line){
        line=document.createElement('span');
        line.className='seat-name-line';
        body.insertBefore(line,name);
        line.appendChild(name);
      }
      line.querySelector('.pref-symbols')?.remove();
      const html=symbolsFor(id,'seat');
      if(html)line.insertAdjacentHTML('beforeend',html);
    });
  }

  function decorate(){decorateGuests();decorateSeats()}

  const oldRenderGuests=renderGuests;
  renderGuests=function(){oldRenderGuests();decorateGuests()};
  const oldRenderTables=renderTables;
  renderTables=function(){oldRenderTables();requestAnimationFrame(decorateSeats)};
  requestAnimationFrame(decorate);
})();
