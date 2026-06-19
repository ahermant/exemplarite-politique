import { readFileSync, writeFileSync } from 'fs';

const aff = JSON.parse(readFileSync('src/data/affaires.json', 'utf-8'));
const pol = JSON.parse(readFileSync('src/data/politiques.json', 'utf-8'));
const idsPol = new Set(pol.slice(0, 35619).map(p => p.id));

const orphelins = [...new Map(aff.filter(a => !idsPol.has(a.politicienId)).map(a => {
  const nom = a.politicien;
  const nomParts = nom.split(' ');
  const prenom = nomParts.length > 1 ? nomParts.slice(0, -1).join(' ') : nom;
  const lastName = nomParts.length > 1 ? nomParts[nomParts.length - 1] : '';
  return [a.politicienId, {
    id: a.politicienId, slug: a.politicienSlug, prenom, nom: lastName, nomComplet: nom,
    partiAbrege: a.partiActuel || '', partiComplet: a.partiActuelComplet || ''
  }];
})).values()];

// Fixed-position CSV builder
function line(arr) {
  return arr.map(v => v || '').join(',');
}

const header = line([
  'poligraphId','Slug','Civilité','Prénom','Nom','Nom complet','Genre',
  'Date de naissance','Lieu de naissance','Date de décès','poligraphId parti',
  'Parti (abrégé)','Parti','Position politique','Mandat actuel','Titre du mandat',
  'Début du mandat','Fin du mandat','Circonscription','Code département',
  "Nombre d'affaires",'Fact-checks (mentions)','Score de prominence',
  'Wikidata Q-ID','Photo','Profil Poligraph','Créé le','Mis à jour le'
]);

const lines = [header];

lines.push(line(['PG-001511','jean-luc-melenchon','M.','Jean-Luc','Mélenchon','Jean-Luc Mélenchon','M','1951-08-19','Tanger','','','LFI','La France insoumise','Gauche radicale','Candidat','Candidat à la présidentielle 2027','','','','','0','0','0','Q5829','','https://poligraph.fr/politiques/jean-luc-melenchon','2026-06-19T00:00:00.000Z','2026-06-19T00:00:00.000Z']));
lines.push(line(['PG-CAND-001','valerie-pecresse','Mme','Valérie','Pécresse','Valérie Pécresse','F','1967-07-14','Neuilly-sur-Seine','','','LR','Les Républicains','Droite','Candidat','Candidate à la présidentielle 2027','','','','','0','0','0','Q465987','','https://poligraph.fr/politiques/valerie-pecresse','2026-06-19T00:00:00.000Z','2026-06-19T00:00:00.000Z']));

for (const o of orphelins) {
  lines.push(line([o.id, o.slug, '', o.prenom, o.nom, o.nomComplet, '', '', '', '', '', o.partiAbrege, o.partiComplet, '', 'Ancien élu', 'Ancien mandat', '', '', '', '', '0', '0', '0', '', '', '', '2026-06-19T00:00:00.000Z', '2026-06-19T00:00:00.000Z']));
}

writeFileSync('candidats.csv', lines.join('\n'), 'utf-8');
console.log('Done: ' + lines.length + ' lines');
console.log('Orphans: ' + orphelins.length);
