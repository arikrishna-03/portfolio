const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    const pdfData = fs.readFileSync(path.resolve(__dirname, '../public/resume.pdf'));
    const pdfBase64 = pdfData.toString('base64');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
        <style>
          body { margin: 0; padding: 0; background: transparent; display: inline-block; }
          canvas { display: block; }
        </style>
      </head>
      <body>
        <canvas id="pdf-canvas"></canvas>
        <script>
          pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
          const rawData = atob("${pdfBase64}");
          const uint8Array = new Uint8Array(rawData.length);
          for (let i = 0; i < rawData.length; i++) {
            uint8Array[i] = rawData.charCodeAt(i);
          }
          const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
          window.renderPromise = loadingTask.promise.then(pdf => {
            return pdf.getPage(1).then(page => {
              const scale = 2.0;
              const viewport = page.getViewport({ scale: scale });
              const canvas = document.getElementById('pdf-canvas');
              canvas.width = viewport.width;
              canvas.height = viewport.height;
              const ctx = canvas.getContext('2d');
              return page.render({ canvasContext: ctx, viewport: viewport }).promise;
            });
          });
        </script>
      </body>
      </html>
    `;

    await page.setContent(html, { waitUntil: 'networkidle0' });
    await page.waitForFunction(() => window.renderPromise !== undefined);
    await page.evaluate(() => window.renderPromise);
    await new Promise(r => setTimeout(r, 600));

    const canvasElement = await page.$('#pdf-canvas');
    const outPub = path.resolve(__dirname, '../public/resume-preview.png');
    const outRoot = path.resolve(__dirname, '../resume-preview.png');
    await canvasElement.screenshot({ path: outPub });
    fs.copyFileSync(outPub, outRoot);
    console.log('SUCCESS: Rendered crystal-clear resume-preview.png');
    await browser.close();
  } catch (err) {
    console.error('ERROR:', err);
  }
})();
