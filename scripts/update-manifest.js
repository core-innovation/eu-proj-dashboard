#!/usr/bin/env node

/**
 * Script to automatically generate projects-manifest.json from files in public/eu-data
 * Run with: node scripts/update-manifest.js
 */

import { readdir, writeFile } from 'fs/promises';
import { join, extname, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const projectRoot = join(__dirname, '..');
const euDataPath = join(projectRoot, 'public', 'eu-data');
const manifestPath = join(euDataPath, 'projects-manifest.json');

async function updateManifest() {
  try {
    console.log('🔍 Scanning for project files in', euDataPath);
    
    // Read all files in the eu-data directory
    const files = await readdir(euDataPath);
    
    // Filter for JSON files excluding the manifest itself
    const projectFiles = files
      .filter(file => extname(file) === '.json')
      .filter(file => file !== 'projects-manifest.json')
      .map(file => basename(file, '.json'))
      .sort();
    
    console.log('📋 Found project files:', projectFiles);
    
    // Create manifest object
    const manifest = {
      projects: projectFiles,
      lastUpdated: new Date().toISOString().split('T')[0],
      description: "Auto-generated manifest file listing all available EU project data files",
      generatedBy: "scripts/update-manifest.js",
      totalProjects: projectFiles.length
    };
    
    // Write manifest file
    await writeFile(manifestPath, JSON.stringify(manifest, null, 2));
    
    console.log('✅ Successfully updated projects-manifest.json');
    console.log(`📊 Total projects: ${projectFiles.length}`);
    
    // Also update the backup manifest in eu-data folder
    const backupManifestPath = join(projectRoot, 'eu-data', 'projects-manifest.json');
    await writeFile(backupManifestPath, JSON.stringify(manifest, null, 2));
    console.log('✅ Updated backup manifest in eu-data folder');
    
  } catch (error) {
    console.error('❌ Error updating manifest:', error);
    process.exit(1);
  }
}

updateManifest();
