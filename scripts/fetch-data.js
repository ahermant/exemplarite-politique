/**
 * Script de rafraîchissement des données
 *
 * Ce script est lancé mensuellement par GitHub Actions.
 * Il télécharge les fichiers CSV depuis leur source puis les convertit en JSON.
 *
 * Source actuelle : fichiers locaux dans le repo.
 * Pour utiliser une source distante, modifiez les URLs ci-dessous.
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const CSV_SOURCES = {
  politiques: process.env.POLITIQUES_CSV_URL || null,
  affaires: process.env.AFFAIRES_CSV_URL || null,
  candidats: process.env.CANDIDATS_CSV_URL || null,
};

async function fetchCSV(url, outputPath) {
  console.log(`Downloading ${url}...`);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  }
  const text = await response.text();
  const { writeFileSync } = await import('fs');
  writeFileSync(outputPath, text, 'utf-8');
  console.log(`Saved to ${outputPath}`);
}

async function main() {
  console.log('=== Data Refresh ===');
  console.log(`Date: ${new Date().toISOString()}`);

  // If remote URLs are configured, download CSVs
  if (CSV_SOURCES.politiques) {
    await fetchCSV(CSV_SOURCES.politiques, resolve(root, 'politiques.csv'));
  } else {
    console.log('No remote URL for politiques.csv, using local file.');
  }

  if (CSV_SOURCES.affaires) {
    await fetchCSV(CSV_SOURCES.affaires, resolve(root, 'affaires.csv'));
  } else {
    console.log('No remote URL for affaires.csv, using local file.');
  }

  if (CSV_SOURCES.candidats) {
    await fetchCSV(CSV_SOURCES.candidats, resolve(root, 'candidats.csv'));
  } else {
    console.log('No remote URL for candidats.csv, using local file.');
  }

  // Run conversion script
  console.log('Running CSV to JSON conversion...');
  execSync('node scripts/convert-csv-to-json.js', { cwd: root, stdio: 'inherit' });

  console.log('=== Refresh Complete ===');
}

main().catch(err => {
  console.error('Refresh failed:', err);
  process.exit(1);
});
