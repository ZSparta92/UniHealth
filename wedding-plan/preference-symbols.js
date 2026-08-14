(function(){
  const style=document.createElement('style');
  style.textContent=`
    .pref-symbols{display:inline-flex;align-items:center;gap:3px;margin-left:5px;vertical-align:middle;white-space:nowrap}
    .pref-symbol{display:inline-flex;align-items:center;justify-content:center;width:19px;height:19px;border-radius:999px;font-size:12px;line-height:1;font-weight:900;box-shadow:0 1px 3px rgba(0,0,0,.10)}
    .pref-symbol.veg{background:#dff4e5;border:1px solid #9ed2ad;color:#176536}
    .pref-symbol.preg{background:#ffe3ee;border:1px solid #efa9c5;color:#a12f60}
    .seatname .pref-symbols{margin-left:4px}
    .seatname .pref-symbol{width:18px;height:18px;font-size:11px}
    .gname .pref-symbol{width:19px;height:19px;font-size:12px}
  `;
  document.head.appendChild(style);

  function symbolsFor(id){
    const p=pref(+id);
    const out=[];
    if(p.vegetarian)out.push('<span class="pref-symbol veg" title="Végétarien" aria-label="Végétarien">🌱</span>');
    if(p.pregnant)out.push('<span class="pref-symbol preg" title="Enceinte" aria-label="Enceinte">🤰</span>');
    return out.length?`<span class="pref-symbols">${out.join('')}</span>`:'';
  }

  function decorate(){
    document.querySelectorAll('.guest[data-id]').forEach(el=>{
      const id=+el.dataset.id,name=el.querySelector('.gname');
      if(!name||name.querySelector('.pref-symbols'))return;
      name.insertAdjacentHTML('beforeend',symbolsFor(id));
    });
    document.querySelectorAll('.seat[data-id]').forEach(el=>{
      const id=+el.dataset.id;
      if(!id)return;
      const name=el.querySelector('.seatname');
      if(!name||name.querySelector('.pref-symbols'))return;
      name.insertAdjacentHTML('beforeend',symbolsFor(id));
    });
  }

  const oldRenderGuests=renderGuests;
  renderGuests=function(){oldRenderGuests();decorate()};
  const oldRenderTables=renderTables;
  renderTables=function(){oldRenderTables();requestAnimationFrame(decorate)};
  requestAnimationFrame(decorate);
})();
