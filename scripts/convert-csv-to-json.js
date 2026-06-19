import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

function parseCSV(text) {
  const lines = text.split(/\r?\n/);
  if (lines.length === 0) return [];

  let firstLine = lines[0];
  if (firstLine.charCodeAt(0) === 0xFEFF) {
    firstLine = firstLine.slice(1);
  }
  const headers = firstLine.split(',').map(h => h.trim().replace(/^"|"$/g, ''));

  const result = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const vals = [];
    let s = '';
    let q = false;
    for (let j = 0; j < line.length; j++) {
      const c = line[j];
      if (c === '"') {
        q = !q;
      } else if (c === ',' && !q) {
        vals.push(s.trim());
        s = '';
      } else {
        s += c;
      }
    }
    vals.push(s.trim());
    const obj = {};
    headers.forEach((h, idx) => {
      obj[h] = vals[idx] || '';
    });
    result.push(obj);
  }
  return result;
}

function rowToPolitician(r) {
  return {
    id: r['poligraphId'] || '',
    slug: r['Slug'] || '',
    civilite: r['Civilité'] || '',
    prenom: r['Prénom'] || '',
    nom: r['Nom'] || '',
    nomComplet: r['Nom complet'] || '',
    genre: r['Genre'] || '',
    dateNaissance: r['Date de naissance'] || '',
    lieuNaissance: r['Lieu de naissance'] || '',
    parti: r['Parti (abrégé)'] || '',
    partiComplet: r['Parti'] || '',
    positionPolitique: r['Position politique'] || '',
    mandat: r['Mandat actuel'] || '',
    titreMandat: r['Titre du mandat'] || '',
    debutMandat: r['Début du mandat'] || '',
    finMandat: r['Fin du mandat'] || '',
    circonscription: r['Circonscription'] || '',
    codeDepartement: r['Code département'] || '',
    photo: r['Photo'] || null,
    profilUrl: r['Profil Poligraph'] || '',
  };
}

function convertPolitiques() {
  console.log('Reading politiques.csv...');
  const csv = readFileSync(resolve(root, 'politiques.csv'), 'utf-8');
  const rows = parseCSV(csv);

  const map = new Map();
  for (const r of rows) {
    const p = rowToPolitician(r);
    if (p.id) map.set(p.id, p);
  }
  console.log(`  ${map.size} politicians from politiques.csv`);

  const candidatsPath = resolve(root, 'candidats.csv');
  if (existsSync(candidatsPath)) {
    console.log('Reading candidats.csv...');
    const csvCand = readFileSync(candidatsPath, 'utf-8');
    const rowsCand = parseCSV(csvCand);
    for (const r of rowsCand) {
      const p = rowToPolitician(r);
      if (p.id) map.set(p.id, p);
    }
    console.log(`  ${rowsCand.length} candidates merged`);
  }

  const data = Array.from(map.values());
  writeFileSync(resolve(root, 'src', 'data', 'politiques.json'), JSON.stringify(data, null, 2));
  console.log(`Total: ${data.length} politicians written to src/data/politiques.json`);
}

function convertAffaires() {
  console.log('Reading affaires.csv...');
  const csv = readFileSync(resolve(root, 'affaires.csv'), 'utf-8');
  const rows = parseCSV(csv);

  const data = rows.map(r => ({
    id: r['poligraphId'] || '',
    slug: r['Slug affaire'] || '',
    titre: r['Titre'] || '',
    politicienId: r['poligraphId politique'] || '',
    politicienSlug: r['Slug politique'] || '',
    politicien: r['Politique'] || '',
    partiActuel: r['Parti actuel (abrégé)'] || '',
    partiActuelComplet: r['Parti actuel'] || '',
    positionPolitique: r['Position politique'] || '',
    statut: r['Statut'] || '',
    statutCode: r['Statut (code)'] || '',
    categorie: r['Catégorie'] || '',
    categorieCode: r['Catégorie (code)'] || '',
    gravite: r['Gravité'] || '',
    graviteCode: r['Gravité (code)'] || '',
    implication: r['Implication'] || '',
    implicationCode: r['Implication (code)'] || '',
    lieeAuMandat: r['Liée au mandat'] || '',
    dateFaits: r['Date des faits'] || '',
    dateDebut: r['Date de début'] || '',
    dateVerdict: r['Date du verdict'] || '',
    amende: parseFloat(r['Amende (EUR)']) || null,
    prison: parseFloat(r['Prison (mois)']) || null,
    prisonSursis: r['Prison avec sursis'] || '',
    ineligibilite: parseFloat(r['Inéligibilité (mois)']) || null,
    tig: parseFloat(r['TIG (heures)']) || null,
    appel: r['Appel'] || '',
    peine: r['Peine (texte libre)'] || '',
    autresPeines: r['Autres peines'] || '',
    juridiction: r['Juridiction'] || '',
    description: r['Description'] || '',
    nbSources: parseInt(r['Nombre de sources']) || 0,
    premiereSourceUrl: r['Première source (URL)'] || '',
    premiereSourceTitre: r['Première source (titre)'] || '',
    pagePoligraph: r['Page Poligraph'] || '',
  }));

  writeFileSync(resolve(root, 'src', 'data', 'affaires.json'), JSON.stringify(data, null, 2));
  console.log(`Converted ${data.length} affairs to src/data/affaires.json`);
}

convertPolitiques();
convertAffaires();
console.log('Done!');
