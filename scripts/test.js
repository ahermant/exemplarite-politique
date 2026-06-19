/**
 * Suite de tests — Intégrité des données
 * Exécution : node scripts/test.js
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

let passed = 0;
let failed = 0;

function assert(label, condition, detail = '') {
  if (condition) {
    passed++;
    console.log(`  ✓ ${label}`);
  } else {
    failed++;
    console.log(`  ✗ ${label}${detail ? ` — ${detail}` : ''}`);
  }
}

const politiques = JSON.parse(readFileSync(resolve(root, 'src', 'data', 'politiques.json'), 'utf-8'));
const affaires = JSON.parse(readFileSync(resolve(root, 'src', 'data', 'affaires.json'), 'utf-8'));

console.log('\n=== Intégrité des données ===\n');

// 1. Volumes
console.log('1. Volumes :');
assert('Politiciens > 0', politiques.length > 0, `${politiques.length} trouvés`);
assert('Affaires > 0', affaires.length > 0, `${affaires.length} trouvées`);

// 2. IDs uniques
console.log('\n2. IDs uniques :');
const idsPoliticiens = new Set(politiques.map(p => p.id));
const idsAffaires = new Set(affaires.map(a => a.id));
assert('IDs politiciens uniques', idsPoliticiens.size === politiques.length);
assert('IDs affaires uniques', idsAffaires.size === affaires.length);

// 3. Structure
console.log('\n3. Structure des politiciens :');
const champsP = ['id', 'slug', 'prenom', 'nom', 'parti', 'mandat'];
for (const champ of champsP) {
  const manquants = politiques.filter(p => !p[champ]).length;
  assert(`Champ "${champ}" présent`, manquants === 0, `${manquants} manquants`);
}

console.log('\n4. Structure des affaires :');
const champsA = ['id', 'slug', 'titre', 'politicienId', 'statutCode', 'implicationCode'];
for (const champ of champsA) {
  const manquants = affaires.filter(a => !a[champ]).length;
  assert(`Champ "${champ}" présent`, manquants === 0, `${manquants} manquants`);
}

// 5. Références croisées
console.log('\n5. Références croisées :');
const affairesOrphelines = affaires.filter(a => !idsPoliticiens.has(a.politicienId));
assert('Toutes les affaires référencent un politicien existant', affairesOrphelines.length === 0,
  `${affairesOrphelines.length} orphelines : ${affairesOrphelines.map(a => `${a.politicien} (${a.politicienId})`).join(', ')}`);

// 6. Catégories exhaustives
console.log('\n6. Catégories couvrant tous les statuts :');
const statutsAttendus = [
  'ENQUETE_PRELIMINAIRE', 'MISE_EN_EXAMEN', 'INSTRUCTION', 'RENVOI_TRIBUNAL', 'PROCES_EN_COURS',
  'CONDAMNATION_PREMIERE_INSTANCE', 'CONDAMNATION_DEFINITIVE', 'APPEL_EN_COURS',
  'RELAXE', 'CLASSEMENT_SANS_SUITE', 'NON_LIEU', 'PRESCRIPTION'
];
const statutsPresents = new Set(affaires.map(a => a.statutCode));
for (const s of statutsAttendus) {
  assert(`Statut "${s}" reconnu`, statutsPresents.has(s), statutsPresents.has(s) ? 'présent' : 'absent des données');
}

// 7. Implication codes valides
console.log('\n7. Codes d\'implication :');
const implAttendus = ['DIRECT', 'PLAINTIFF', 'MENTIONED_ONLY'];
const implPresents = new Set(affaires.map(a => a.implicationCode));
for (const i of implAttendus) {
  assert(`Implication "${i}" présente`, implPresents.has(i));
}

// 8. Somme des catégories (DIRECT only)
console.log('\n8. Somme catégories = total (DIRECT) :');
const direct = affaires.filter(a => a.implicationCode === 'DIRECT');
const enquetes = direct.filter(a => a.statutCode === 'ENQUETE_PRELIMINAIRE').length;
const inculpations = direct.filter(a => ['MISE_EN_EXAMEN','INSTRUCTION','RENVOI_TRIBUNAL','PROCES_EN_COURS'].includes(a.statutCode)).length;
const condamnations = direct.filter(a => ['CONDAMNATION_PREMIERE_INSTANCE','CONDAMNATION_DEFINITIVE','APPEL_EN_COURS'].includes(a.statutCode)).length;
const relaxe = direct.filter(a => ['RELAXE','CLASSEMENT_SANS_SUITE','NON_LIEU','PRESCRIPTION'].includes(a.statutCode)).length;
const somme = enquetes + inculpations + condamnations + relaxe;
assert('Enquêtes + Mises en examen + Condamnations + Relaxe = Total DIRECT',
  somme === direct.length,
  `${enquetes}+${inculpations}+${condamnations}+${relaxe}=${somme} vs ${direct.length}`);

// 9. Candidats présents
console.log('\n9. Candidats présidentielle :');
const candidats = ['jean-luc-melenchon', 'valerie-pecresse'];
for (const slug of candidats) {
  const found = politiques.find(p => p.slug === slug);
  assert(`Candidat "${slug}" présent`, !!found, found ? `${found.prenom} ${found.nom}` : 'absent');
}

// Résumé
console.log(`\n=== Résultat : ${passed} réussis, ${failed} échoués ===\n`);
process.exit(failed > 0 ? 1 : 0);
