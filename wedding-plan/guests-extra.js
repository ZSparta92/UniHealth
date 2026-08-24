// Invités ajoutés depuis l'onglet Civile du Google Sheet.
// IDs techniques séparés pour ne jamais casser les placements existants.
// sheetNumber conserve le numéro visible du Sheet.
if(!GUESTS.some(g=>g.sheetNumber===101&&g.name==='Sofiane')){
  GUESTS.push({id:108,sheetNumber:101,name:'Sofiane',side:'Anis',cat:'Adulte',age:'',parent:'',sheet:''});
}
if(!GUESTS.some(g=>g.sheetNumber===102&&g.name==='Jason')){
  GUESTS.push({id:109,sheetNumber:102,name:'Jason',side:'Anis',cat:'Adulte',age:'',parent:'',sheet:''});
}
if(!GUESTS.some(g=>g.sheetNumber===103&&g.name==='Marc')){
  GUESTS.push({id:110,sheetNumber:103,name:'Marc',side:'Anis',cat:'Adulte',age:'',parent:'',sheet:''});
}
if(!GUESTS.some(g=>g.sheetNumber===104&&g.name==='Femme Marc')){
  GUESTS.push({id:111,sheetNumber:104,name:'Femme Marc',side:'Anis',cat:'Adulte',age:'',parent:'',sheet:''});
}
if(!GUESTS.some(g=>g.sheetNumber===105&&g.name==='Melina')){
  GUESTS.push({id:112,sheetNumber:105,name:'Melina',side:'Anis',cat:'Enfant',age:'',parent:'',sheet:''});
}
