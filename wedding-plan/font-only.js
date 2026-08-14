const FIXED_LAYOUT_SCALE=1.2;
(function(){
  const style=document.createElement('style');
  style.textContent='.seatname.editable{font-size:var(--guestNameFont,13.5px)!important;line-height:1.05}.seatname:not(.editable){font-size:13.5px!important}';
  document.head.appendChild(style);
})();
function fixedLayoutVars(){
  const r=document.documentElement;
  r.style.setProperty('--seatW','146px');
  r.style.setProperty('--seatH','56px');
  r.style.setProperty('--seatFont','13.5px');
  r.style.setProperty('--nameW','104px');
  r.style.setProperty('--idx','22px');
  r.style.setProperty('--tableFont','37px');
}
applyFont=function(v){
  font=Math.round(clamp(v,.8,1.8)*100)/100;
  localStorage.setItem(FKEY,font);
  fixedLayoutVars();
  const namePx=13.5*(font/FIXED_LAYOUT_SCALE);
  document.documentElement.style.setProperty('--guestNameFont',namePx.toFixed(2)+'px');
  $('fontVal').textContent=Math.round(font*100)+' %';
};
dims=function(t){
  const f=FIXED_LAYOUT_SCALE,w=122*f,h=46*f,pad=Math.round(Math.max(w,h)*.95);
  if(t.shape==='round'){
    const d=Math.max(300,Math.min(720,Math.ceil(t.seats*w*.75/Math.PI)+70));
    return{sw:d,sh:d,ww:d+2*pad,wh:d+2*pad,pad,off:Math.round(h*.9)};
  }
  const sh=Math.max(230,Math.round(t.seats*20+30*f)),sw=Math.max(360,Math.round(sh*1.52));
  return{sw,sh,ww:sw+2*pad,wh:sh+2*pad,pad,off:Math.round(pad*.6)};
};
applyFont(font);
renderTables();
if(typeof syncWorkspaceToTables==='function')requestAnimationFrame(syncWorkspaceToTables);
