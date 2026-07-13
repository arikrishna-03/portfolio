const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Helper to determine platform and prettify titles (similar to local watcher)
function parseCertMeta(filename, parentDir, fileId) {
  let title = filename;
  let platform = 'Certification';

  const nameUpper = filename.toUpperCase();
  const parentUpper = parentDir.toUpperCase();

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

  // Prettify titles
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
    // Strip file extensions if they leaked into the inner text
    title = filename.replace(/\.[a-zA-Z0-9]+$/, '');
    title = title.replace(/[_-]/g, ' ').replace(/\s+/g, ' ').trim();
    title = title.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }

  return {
    title: title,
    platform: platform,
    path: `https://drive.google.com/file/d/${fileId}/preview`
  };
}

async function scrapeFolderRecursively(rootFolderId) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const certs = [];
  const folderQueue = [{ id: rootFolderId, name: 'Root' }];
  const processedFolders = new Set();

  try {
    const page = await browser.newPage();
    // Block images and stylesheets to speed up loading
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      if (req.resourceType() === 'image' || req.resourceType() === 'stylesheet') {
        req.abort();
      } else {
        req.continue();
      }
    });

    while (folderQueue.length > 0) {
      const current = folderQueue.shift();
      if (processedFolders.has(current.id)) continue;
      processedFolders.add(current.id);

      const url = `https://drive.google.com/embeddedfolderview?id=${current.id}`;
      console.log(`Scraping folder: ${current.name} (${current.id}) ...`);
      
      try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 15000 });
        await page.waitForSelector('.flip-entries', { timeout: 10000 });

        // Extract folder and file links
        const items = await page.evaluate(() => {
          const folderLinks = [];
          const fileLinks = [];
          
          document.querySelectorAll('a').forEach(link => {
            const href = link.getAttribute('href') || '';
            const text = link.innerText || link.textContent || '';
            
            // Match files
            if (href.includes('/file/d/')) {
              const fileMatch = href.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
              if (fileMatch) {
                fileLinks.push({ id: fileMatch[1], name: text.trim() });
              }
            }
            
            // Match folders
            if (href.includes('/drive/folders/') || href.includes('/drive/u/0/folders/')) {
              const folderMatch = href.match(/\/folders\/([a-zA-Z0-9_-]+)/);
              if (folderMatch) {
                folderLinks.push({ id: folderMatch[1], name: text.trim() });
              }
            }
          });
          
          return { folderLinks, fileLinks };
        });

        // Add subfolders to queue
        items.folderLinks.forEach(f => {
          if (!processedFolders.has(f.id)) {
            folderQueue.push({ id: f.id, name: f.name });
          }
        });

        // Process PDF files
        items.fileLinks.forEach(f => {
          // If name has .pdf or is named like a certificate
          if (f.name && !f.name.toLowerCase().endsWith('.folder') && !f.name.toLowerCase().includes('untitled folder')) {
            const cleanName = f.name.replace(/\.pdf$/i, '');
            const meta = parseCertMeta(cleanName, current.name, f.id);
            certs.push(meta);
          }
        });

      } catch (err) {
        console.error(`Failed to scrape folder ${current.name} (${current.id}):`, err.message);
      }
    }

    console.log(`Scraping finished. Found ${certs.length} certificates.`);
    
    // Write results to public/certifications.json
    const dest = path.join(__dirname, '..', 'public', 'certifications.json');
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, JSON.stringify(certs, null, 2));
    console.log(`Successfully updated database: ${dest}`);

  } finally {
    await browser.close();
  }
}

const targetFolderId = '1i75o8xVlfhhNMtZ89yGxoq4OXhfBqVrP';
scrapeFolderRecursively(targetFolderId).catch(err => {
  console.error('Fatal execution error:', err.message);
  process.exit(1);
});
