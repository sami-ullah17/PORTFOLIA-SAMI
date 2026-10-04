import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig, Plugin } from 'vite';

function savePhotoPlugin(): Plugin {
  return {
    name: 'save-photo-plugin',
    configureServer(server) {
      server.middlewares.use('/api/save-photo', (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const { image } = JSON.parse(body);
              if (image && typeof image === 'string' && image.startsWith('data:image/')) {
                const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
                const buffer = Buffer.from(base64Data, 'base64');
                const publicDir = path.resolve(__dirname, 'public');
                if (!fs.existsSync(publicDir)) {
                  fs.mkdirSync(publicDir, { recursive: true });
                }
                const photoPath = path.join(publicDir, 'sami_profile_photo.jpg');
                fs.writeFileSync(photoPath, buffer);

                // Also save into src/assets/images
                const assetsImgDir = path.resolve(__dirname, 'src/assets/images');
                if (!fs.existsSync(assetsImgDir)) {
                  fs.mkdirSync(assetsImgDir, { recursive: true });
                }
                fs.writeFileSync(path.join(assetsImgDir, 'sami_profile_photo.jpg'), buffer);

                // Update defaultPortfolio.ts default avatar
                const defaultPortfolioPath = path.resolve(__dirname, 'src/data/defaultPortfolio.ts');
                if (fs.existsSync(defaultPortfolioPath)) {
                  let content = fs.readFileSync(defaultPortfolioPath, 'utf-8');
                  content = content.replace(
                    /avatarUrl:\s*['"`][^'"`]+['"`]/,
                    "avatarUrl: '/sami_profile_photo.jpg'"
                  );
                  fs.writeFileSync(defaultPortfolioPath, content, 'utf-8');
                }

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, path: '/sami_profile_photo.jpg' }));
                return;
              }
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Invalid image data' }));
            } catch (err: any) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        } else {
          res.writeHead(405);
          res.end();
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), savePhotoPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
