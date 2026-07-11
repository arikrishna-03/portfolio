const fs = require('fs');
const path = require('path');

const localDriveDir = 'A:\\my files\\Certificate';
const srcDir = path.join(__dirname, '..', 'certification');
const destDir = path.join(__dirname, '..', 'public', 'certification');
const jsonDest = path.join(__dirname, '..', 'public', 'certifications.json');

// Helper to recursively copy directories
function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 0. Auto-sync from local Google Drive folder if available
if (fs.existsSync(localDriveDir)) {
  console.log(`Syncing from local Google Drive folder: ${localDriveDir}...`);
  // Ensure source folder exists or clear it to match latest Drive state
  if (fs.existsSync(srcDir)) {
    fs.rmSync(srcDir, { recursive: true, force: true });
  }
  copyDir(localDriveDir, srcDir);
} else {
  // Ensure source directory exists
  if (!fs.existsSync(srcDir)) {
    fs.mkdirSync(srcDir, { recursive: true });
  }
}

// Helper to recursively find PDFs and get metadata
const defList = [];
function scanPDFs(dir, relativePath = '') {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);
    const relUrl = path.join(relativePath, entry.name).replace(/\\/g, '/');

    if (entry.isDirectory()) {
      scanPDFs(entryPath, relUrl);
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.pdf')) {
      const parentDirName = path.basename(dir);
      const filenameNoExt = path.basename(entry.name, path.extname(entry.name));
      
      const certInfo = parseCertMeta(filenameNoExt, parentDirName, relUrl);
      defList.push(certInfo);
    }
  }
}

// Prettify certificate title and identify platform/issuer
function parseCertMeta(filename, parentDir, urlPath) {
  let title = filename;
  let platform = 'Certification';

  const nameUpper = filename.toUpperCase();
  const parentUpper = parentDir.toUpperCase();

  // Determine Platform/Issuer based on folder or keywords
  if (parentUpper === 'IN AMIGOS' || nameUpper.includes('INAMIGOS') || (parentUpper === 'INTERNSHIP' && (nameUpper.includes('APPRECIATION') || nameUpper.includes('COMPLETION')))) {
    platform = 'InAmigos Foundation';
  } else if (parentUpper === 'USR MACHINERIES' || nameUpper.includes('USR MACHINERIES')) {
    platform = 'USR Machineries';
  } else if (/coursera/i.test(filename)) {
    platform = 'Coursera';
  } else if (/mongodb/i.test(filename)) {
    platform = 'MongoDB';
  } else if (/coding ninja/i.test(filename)) {
    platform = 'Coding Ninjas';
  } else if (/tata/i.test(filename)) {
    platform = 'Tata';
  } else if (/hackathon/i.test(filename)) {
    platform = 'Hackathon';
  } else if (/codechef/i.test(filename) || /kit28adc018/i.test(filename)) {
    platform = 'CodeChef';
  }

  // Prettify titles based on specific file patterns
  if (nameUpper.includes('PARTICIPATION CERTIFICATE')) {
    title = 'Participation Certificate';
  } else if (nameUpper.includes('INTRO AI')) {
    title = 'Introduction to Artificial Intelligence';
  } else if (nameUpper.includes('ENTRUPERNER SHIP')) {
    title = 'Entrepreneurship Development';
  } else if (nameUpper.includes('GIT_GITHUB')) {
    title = 'Git & GitHub Tools';
  } else if (nameUpper.includes('JAVA IN CODING NINJA')) {
    title = 'Java Programming Course';
  } else if (nameUpper.includes('500 DIFFICULTY RATING')) {
    title = '500 Difficulty Rating Milestone';
  } else if (nameUpper.includes('PRACTICE STRINGS')) {
    title = 'Practice Strings Milestone';
  } else if (nameUpper.includes('REVERSE CODING X')) {
    title = 'Reverse Coding X Competition';
  } else if (nameUpper.includes('TATA CRUCIBLE')) {
    title = 'Tata Crucible Campus Quiz';
  } else if (nameUpper.includes('HACKATHON 360')) {
    title = 'International Level Hackathon 360°';
  } else if (nameUpper.includes('INTRODUCTION TO MONGODB')) {
    title = 'Introduction to MongoDB';
  } else if (nameUpper.includes('INTRODUCTION TO SOFTWARE ENGINEERING')) {
    title = 'Introduction to Software Engineering';
  } else if (nameUpper.includes('MINERAL FORECASTING')) {
    title = 'Mineral Forecasting AI';
  } else if (nameUpper.includes('TATA IMAGINATION CHALLENGE')) {
    title = 'Tata Imagination Challenge';
  } else if (nameUpper.includes('WC CERTIFICATE')) {
    title = 'WC Certificate';
  } else if (nameUpper.includes('APPRECIATION CERTIFICATE')) {
    title = 'Internship Appreciation';
  } else if (nameUpper.includes('COMPLETION CERTIFICATE')) {
    title = 'Internship Completion';
  } else if (nameUpper.includes('USR MACHINERIES') || nameUpper.includes('USR')) {
    title = 'Internship Completion';
  } else {
    // General clean up
    title = filename
      .replace(/[_-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    // Capitalize first letters
    title = title.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }

  return {
    title,
    platform,
    path: `/certification/${urlPath}`
  };
}

// 1. Copy certification files to public/
console.log("Copying certification files to public asset directory...");
if (fs.existsSync(destDir)) {
  fs.rmSync(destDir, { recursive: true, force: true });
}
copyDir(srcDir, destDir);

// 2. Scan and generate JSON
console.log("Scanning certificates for metadata...");
scanPDFs(destDir);

// 3. Save to public/certifications.json
console.log(`Writing list of ${defList.length} certificates to public/certifications.json...`);
fs.writeFileSync(jsonDest, JSON.stringify(defList, null, 2), 'utf-8');

console.log("Build certifications successfully completed!");
