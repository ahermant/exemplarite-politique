export interface Politicien {
  id: string;
  slug: string;
  civilite: string;
  prenom: string;
  nom: string;
  nomComplet: string;
  genre: string;
  dateNaissance: string;
  lieuNaissance: string;
  parti: string;
  partiComplet: string;
  positionPolitique: string;
  mandat: string;
  titreMandat: string;
  debutMandat: string;
  finMandat: string;
  circonscription: string;
  codeDepartement: string;
  photo: string | null;
  profilUrl: string;
  nbEnquetes: number;
  nbInculpations: number;
  nbCondamnations: number;
  nbRelaxe: number;
  nbAffaires: number;
  affaires: AffaireResume[];
}

export interface AffaireResume {
  id: string;
  slug: string;
  titre: string;
  statut: string;
  statutCode: StatutCode;
  categorie: string;
  categorieCode: string;
  gravite: string;
  description: string;
  peine: string;
}

export interface Affaire {
  id: string;
  slug: string;
  titre: string;
  politicienId: string;
  politicienSlug: string;
  politicien: string;
  partiActuel: string;
  partiActuelComplet: string;
  positionPolitique: string;
  statut: string;
  statutCode: StatutCode;
  categorie: string;
  categorieCode: string;
  gravite: string;
  graviteCode: string;
  implication: string;
  implicationCode: string;
  lieeAuMandat: string;
  dateFaits: string;
  dateDebut: string;
  dateVerdict: string;
  amende: number | null;
  prison: number | null;
  prisonSursis: string;
  ineligibilite: number | null;
  tig: number | null;
  appel: string;
  peine: string;
  autresPeines: string;
  juridiction: string;
  description: string;
  nbSources: number;
  premiereSourceUrl: string;
  premiereSourceTitre: string;
  pagePoligraph: string;
}

export type StatutCode =
  | 'MISE_EN_EXAMEN'
  | 'CONDAMNATION_PREMIERE_INSTANCE'
  | 'CONDAMNATION_DEFINITIVE'
  | 'ENQUETE_PRELIMINAIRE'
  | 'INSTRUCTION'
  | 'APPEL_EN_COURS'
  | 'RELAXE'
  | 'CLASSEMENT_SANS_SUITE'
  | 'NON_LIEU'
  | 'PRESCRIPTION'
  | 'RENVOI_TRIBUNAL'
  | 'PROCES_EN_COURS';

export function getStatutLabel(code: StatutCode): string {
  const labels: Record<StatutCode, string> = {
    MISE_EN_EXAMEN: 'Mise en examen',
    CONDAMNATION_PREMIERE_INSTANCE: 'Condamnation (1ère instance)',
    CONDAMNATION_DEFINITIVE: 'Condamnation définitive',
    ENQUETE_PRELIMINAIRE: 'Enquête préliminaire',
    INSTRUCTION: 'Instruction en cours',
    APPEL_EN_COURS: 'Appel en cours',
    RELAXE: 'Relaxe',
    CLASSEMENT_SANS_SUITE: 'Classement sans suite',
    NON_LIEU: 'Non-lieu',
    PRESCRIPTION: 'Prescription',
    RENVOI_TRIBUNAL: 'Renvoi devant le tribunal',
    PROCES_EN_COURS: 'Procès en cours',
  };
  return labels[code] || code;
}

export function getStatutVariant(code: StatutCode): string {
  const variants: Record<StatutCode, string> = {
    MISE_EN_EXAMEN: 'status-mise-en-examen',
    CONDAMNATION_PREMIERE_INSTANCE: 'status-condamnation',
    CONDAMNATION_DEFINITIVE: 'status-condamnation',
    ENQUETE_PRELIMINAIRE: 'status-enquete',
    INSTRUCTION: 'status-instruction',
    APPEL_EN_COURS: 'status-appel',
    RELAXE: 'status-relaxe',
    CLASSEMENT_SANS_SUITE: 'status-classement',
    NON_LIEU: 'status-classement',
    PRESCRIPTION: 'status-classement',
    RENVOI_TRIBUNAL: 'status-renvoi',
    PROCES_EN_COURS: 'status-proces',
  };
  return variants[code] || 'status-enquete';
}

export function isEnquete(code: StatutCode): boolean {
  return code === 'ENQUETE_PRELIMINAIRE';
}

export function isInculpation(code: StatutCode): boolean {
  return code === 'MISE_EN_EXAMEN' || code === 'INSTRUCTION' || code === 'RENVOI_TRIBUNAL' || code === 'PROCES_EN_COURS';
}

export function isCondamnation(code: StatutCode): boolean {
  return code === 'CONDAMNATION_PREMIERE_INSTANCE' || code === 'CONDAMNATION_DEFINITIVE' || code === 'APPEL_EN_COURS';
}

export function isRelaxeOuClassement(code: StatutCode): boolean {
  return code === 'RELAXE' || code === 'CLASSEMENT_SANS_SUITE' || code === 'NON_LIEU' || code === 'PRESCRIPTION';
}

export function getPartyColor(parti: string): string {
  const colors: Record<string, string> = {
    'LFI': '#E63946',
    'RN': '#0D1B3E',
    'RE': '#FFB700',
    'LR': '#0066CC',
    'PS': '#FF69B4',
    'PCF': '#DD0000',
    'EELV': '#00A95C',
    'UDI': '#7B2D8E',
    'REC': '#1E3A8A',
    'NFP': '#E63946',
    'Horizons': '#00A1D6',
    'MoDem': '#FF8C22',
    'DLF': '#173F73',
    'LS': '#1A3A5C',
  };
  return colors[parti] || '#71717A';
}

export interface StatsGlobale {
  totalPoliticiens: number;
  totalAffaires: number;
  totalEnquetes: number;
  totalInculpations: number;
  totalCondamnations: number;
  totalRelaxe: number;
  topPartis: { parti: string; nbAffaires: number; nbPoliticiens: number }[];
}
