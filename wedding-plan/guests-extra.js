// Invités ajoutés depuis l'onglet Civile du Google Sheet.
// IDs techniques 108/109 pour ne jamais casser les placements existants.
// sheetNumber conserve le numéro visible du Sheet.
if(!GUESTS.some(g=>g.sheetNumber===101&&g.name==='Sofiane')){
  GUESTS.push({id:108,sheetNumber:101,name:'Sofiane',side:'Anis',cat:'Adulte',age:'',parent:'',sheet:''});
}
if(!GUESTS.some(g=>g.sheetNumber===102&&g.name==='Jason')){
  GUESTS.push({id:109,sheetNumber:102,name:'Jason',side:'Anis',cat:'Adulte',age:'',parent:'',sheet:''});
}
