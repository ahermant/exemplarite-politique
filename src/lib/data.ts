import type { Politicien, Affaire, AffaireResume, StatsGlobale } from './types';
import { isEnquete, isInculpation, isCondamnation, isRelaxeOuClassement } from './types';

import politiquesData from '../data/politiques.json';
import affairesData from '../data/affaires.json';

const politiquesRaw = politiquesData as any[];
const affairesRaw = affairesData as any[];

let cachePoliticiens: Politicien[] | null = null;
let cacheAffaires: Affaire[] | null = null;

function buildPoliticien(raw: any): Politicien {
  const affairesDuPoliticien = getAffairesByPoliticienId(raw.id);
  const affairesDirect = affairesDuPoliticien.filter(a => a.implicationCode === 'DIRECT');
  const nbEnquetes = affairesDirect.filter(a => isEnquete(a.statutCode)).length;
  const nbInculpations = affairesDirect.filter(a => isInculpation(a.statutCode)).length;
  const nbCondamnations = affairesDirect.filter(a => isCondamnation(a.statutCode)).length;
  const nbRelaxe = affairesDirect.filter(a => isRelaxeOuClassement(a.statutCode)).length;

  return {
    id: raw.id,
    slug: raw.slug,
    civilite: raw.civilite,
    prenom: raw.prenom,
    nom: raw.nom,
    nomComplet: raw.nomComplet,
    genre: raw.genre,
    dateNaissance: raw.dateNaissance,
    lieuNaissance: raw.lieuNaissance,
    parti: raw.parti,
    partiComplet: raw.partiComplet,
    positionPolitique: raw.positionPolitique,
    mandat: raw.mandat,
    titreMandat: raw.titreMandat,
    debutMandat: raw.debutMandat,
    finMandat: raw.finMandat,
    circonscription: raw.circonscription,
    codeDepartement: raw.codeDepartement,
    photo: raw.photo,
    profilUrl: raw.profilUrl,
    nbEnquetes,
    nbInculpations,
    nbCondamnations,
    nbRelaxe,
    nbAffaires: affairesDirect.length,
    affaires: affairesDuPoliticien.map(a => ({
      id: a.id,
      slug: a.slug,
      titre: a.titre,
      statut: a.statut,
      statutCode: a.statutCode,
      categorie: a.categorie,
      categorieCode: a.categorieCode,
      gravite: a.gravite,
      description: a.description,
      peine: a.peine,
    })),
  };
}

export function getPoliticiens(): Politicien[] {
  if (cachePoliticiens) return cachePoliticiens;
  cachePoliticiens = politiquesRaw.map(buildPoliticien);
  return cachePoliticiens;
}

export function getPoliticienBySlug(slug: string): Politicien | undefined {
  return getPoliticiens().find(p => p.slug === slug);
}

export function getPoliticienById(id: string): Politicien | undefined {
  return getPoliticiens().find(p => p.id === id);
}

function buildAffaire(raw: any): Affaire {
  return {
    id: raw.id,
    slug: raw.slug,
    titre: raw.titre,
    politicienId: raw.politicienId,
    politicienSlug: raw.politicienSlug,
    politicien: raw.politicien,
    partiActuel: raw.partiActuel,
    partiActuelComplet: raw.partiActuelComplet,
    positionPolitique: raw.positionPolitique,
    statut: raw.statut,
    statutCode: raw.statutCode,
    categorie: raw.categorie,
    categorieCode: raw.categorieCode,
    gravite: raw.gravite,
    graviteCode: raw.graviteCode,
    implication: raw.implication,
    implicationCode: raw.implicationCode,
    lieeAuMandat: raw.lieeAuMandat,
    dateFaits: raw.dateFaits,
    dateDebut: raw.dateDebut,
    dateVerdict: raw.dateVerdict,
    amende: raw.amende,
    prison: raw.prison,
    prisonSursis: raw.prisonSursis,
    ineligibilite: raw.ineligibilite,
    tig: raw.tig,
    appel: raw.appel,
    peine: raw.peine,
    autresPeines: raw.autresPeines,
    juridiction: raw.juridiction,
    description: raw.description,
    nbSources: raw.nbSources,
    premiereSourceUrl: raw.premiereSourceUrl,
    premiereSourceTitre: raw.premiereSourceTitre,
    pagePoligraph: raw.pagePoligraph,
  };
}

export function getAffaires(): Affaire[] {
  if (cacheAffaires) return cacheAffaires;
  cacheAffaires = affairesRaw.map(buildAffaire);
  return cacheAffaires;
}

export function getAffaireBySlug(slug: string): Affaire | undefined {
  return getAffaires().find(a => a.slug === slug);
}

export function getAffairesByPoliticienId(id: string): Affaire[] {
  return getAffaires().filter(a => a.politicienId === id);
}

export function getAffairesByPoliticienSlug(slug: string): Affaire[] {
  return getAffaires().filter(a => a.politicienSlug === slug);
}

export function getStatsGlobales(): StatsGlobale {
  const politiciens = getPoliticiens();
  const affaires = getAffaires();

  const affairesDirect = affaires.filter(a => a.implicationCode === 'DIRECT');
  const totalEnquetes = affairesDirect.filter(a => isEnquete(a.statutCode)).length;
  const totalInculpations = affairesDirect.filter(a => isInculpation(a.statutCode)).length;
  const totalCondamnations = affairesDirect.filter(a => isCondamnation(a.statutCode)).length;
  const totalRelaxe = affairesDirect.filter(a => isRelaxeOuClassement(a.statutCode)).length;

  const partiStats = new Map<string, { nbAffaires: number; nbPoliticiens: number }>();
  for (const p of politiciens) {
    if (!p.parti) continue;
    const existing = partiStats.get(p.parti) || { nbAffaires: 0, nbPoliticiens: 0 };
    existing.nbAffaires += p.nbAffaires;
    existing.nbPoliticiens++;
    partiStats.set(p.parti, existing);
  }

  const topPartis = Array.from(partiStats.entries())
    .map(([parti, stats]) => ({ parti, ...stats }))
    .sort((a, b) => b.nbAffaires - a.nbAffaires)
    .slice(0, 10);

  return {
    totalPoliticiens: politiciens.length,
    totalAffaires: affairesDirect.length,
    totalEnquetes,
    totalInculpations,
    totalCondamnations,
    totalRelaxe,
    topPartis,
  };
}

export function getTousLesPartis(): string[] {
  const partis = new Set<string>();
  for (const p of getPoliticiens()) {
    if (p.parti) partis.add(p.parti);
  }
  return Array.from(partis).sort();
}
