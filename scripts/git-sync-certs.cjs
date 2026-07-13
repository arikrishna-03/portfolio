const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

try {
  console.log('1. Running scrape-drive-folder.cjs to sync online files...');
  execSync('node scripts/scrape-drive-folder.cjs', { stdio: 'inherit' });

  // Add only certification json
  console.log('2. Staging certifications JSON in Git...');
  execSync('git add public/certifications.json', { stdio: 'inherit' });

  // Check if there are changes to commit
  const status = execSync('git status --porcelain').toString();
  const hasChanges = status.split('\n').some(line => {
    return line.includes('certifications.json');
  });

  if (!hasChanges) {
    console.log('No new certificates or modifications found. Git is up to date.');
    process.exit(0);
  }

  console.log('3. Committing changes...');
  execSync('git commit -m "Auto-sync certifications from Google Drive"', { stdio: 'inherit' });

  console.log('4. Pushing changes to GitHub...');
  execSync('git push origin main', { stdio: 'inherit' });

  console.log('Sync completed successfully and pushed to GitHub!');
} catch (error) {
  console.error('Error during sync:', error.message);
  process.exit(1);
}
