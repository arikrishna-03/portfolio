import { defineConfig } from 'vite'
import { resolve } from 'path'
import fs from 'fs'
import { exec } from 'child_process'

function googleDriveWatcherPlugin() {
  const localDriveDir = 'A:\\my files\\Certificate';
  const scriptPath = resolve(__dirname, 'scripts/build-certs.cjs');

  return {
    name: 'google-drive-watcher',
    configureServer(server) {
      if (!fs.existsSync(localDriveDir)) {
        console.log(`\n[Watcher] Local Google Drive folder not found at: ${localDriveDir}. Skipping real-time sync watch.`);
        return;
      }

      console.log(`\n[Watcher] Watching Google Drive folder: "${localDriveDir}" for changes...`);
      
      let debounceTimeout;
      const watcher = fs.watch(localDriveDir, { recursive: true }, (eventType, filename) => {
        if (filename && filename.toLowerCase().endsWith('.pdf')) {
          console.log(`[Watcher] Change detected in Google Drive: ${filename} (${eventType})`);
          
          // Debounce build-certs run so it doesn't trigger multiple times for a single copy operation
          clearTimeout(debounceTimeout);
          debounceTimeout = setTimeout(() => {
            console.log('[Watcher] Synchronizing changes...');
            exec(`node "${scriptPath}"`, (err, stdout) => {
              if (err) {
                console.error('[Watcher] Sync failed:', err);
                return;
              }
              console.log('[Watcher] Sync completed successfully!');
              
              // Tell Vite server to full-reload the page to show latest certificates
              server.ws.send({ type: 'full-reload' });
            });
          }, 1200);
        }
      });

      server.httpServer.once('close', () => {
        watcher.close();
      });
    }
  }
}

export default defineConfig({
  base: './', // Makes built asset paths relative so it works on GitHub Pages subdirectories
  plugins: [googleDriveWatcherPlugin()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        profile: resolve(__dirname, 'profile.html'),
      },
    },
  },
})
