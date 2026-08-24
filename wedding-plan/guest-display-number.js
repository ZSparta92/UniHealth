(function(){
  function displayNumber(id){
    const x=g(id);
    return x?.sheetNumber ?? x?.id ?? id;
  }

  function fixNumbers(){
    document.querySelectorAll('.guest[data-id]').forEach(el=>{
      const id=+el.dataset.id;
      const x=g(id);
      if(!x?.sheetNumber)return;
      const meta=el.querySelector('.gmeta');
      if(meta)meta.textContent=meta.textContent.replace(/^#\d+/,`#${x.sheetNumber}`);
    });
  }

  const oldRenderGuests=renderGuests;
  renderGuests=function(){oldRenderGuests();fixNumbers()};

  const oldOpenGuest=openGuest;
  openGuest=function(id){
    oldOpenGuest(id);
    const x=g(id);
    if(x?.sheetNumber){
      const meta=$('gMeta');
      if(meta)meta.textContent=meta.textContent.replace(/^#\d+/,`#${x.sheetNumber}`);
    }
  };

  requestAnimationFrame(fixNumbers);
})();
