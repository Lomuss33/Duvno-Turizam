import { defineConfig } from 'vite';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { destinations } from './content.js';
import { localBusinesses } from './local.js';
import { areaGuides } from './area-data.js';
import { pillarHubs } from './pillars-data.js';
import { pagePath } from './routes.js';

const root = fileURLToPath(new URL('./', import.meta.url));
const generate = () => execFileSync(process.execPath, ['scripts/generate-pages.js'], { cwd: root, stdio: 'inherit' });
generate();
const input = ['hr', 'en'].flatMap((language) => [
  pagePath(language),
  pagePath(language, null, 'credits'),
  ...[...destinations, ...localBusinesses].map((place) => pagePath(language, place.id)),
  ...areaGuides.map((area) => pagePath(language, area.id, 'area')),
  ...pillarHubs.filter((item) => item.kind === 'pillar').map((pillar) => pagePath(language, pillar.id, 'pillar')),
]).map((path) => resolve(root, path));

export default defineConfig({
  // Relative asset URLs work on GitHub project Pages and custom domains.
  base: './',
  build: { rollupOptions: { input } },
  plugins: [{
    name: 'duvno-static-pages',
    configureServer(server) {
      const sources = ['templates/home.html', 'render.js', 'discovery-render.js', 'discovery-data.js', 'area-render.js', 'guide-search.js', 'planner-render.js', 'planner.js', 'browse-data.js', 'browse-render.js', 'river-data.js', 'river-render.js', 'town-data.js', 'town-render.js', 'pillars-data.js', 'pillars-render.js', 'pillars-ui.js', 'scripts/generate-pages.js'].map((path) => resolve(root, path));
      const sourceNames = new Set(sources.map((path) => path.replaceAll('\\', '/').split('/').at(-1).toLowerCase()));
      let generationTimer;
      server.watcher.add(sources);
      server.watcher.on('change', (path) => {
        if (sourceNames.has(path.replaceAll('\\', '/').split('/').at(-1).toLowerCase())) {
          clearTimeout(generationTimer);
          generationTimer = setTimeout(() => {
            try { generate(); server.ws.send({ type: 'full-reload' }); }
            catch (error) { server.config.logger.error(error.message); }
          }, 80);
        }
      });
      server.httpServer?.once('close', () => clearTimeout(generationTimer));
    },
  }],
});
