import { crx, defineManifest } from '@crxjs/vite-plugin'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import zip from 'vite-plugin-zip-pack'
import packageJson from './package.json'

const { description, version, productName } = packageJson

const manifest = defineManifest({
  name: productName,
  description,
  version,
  manifest_version: 3,
  icons: {
    128: 'icon.png',
  },
  background: {
    service_worker: 'src/background.ts',
    type: 'module',
  },
  content_scripts: [
    {
      matches: ['https://www.youtube.com/*'],
      js: ['src/content-script.ts'],
    },
    {
      matches: ['https://www.youtube.com/live_chat*'],
      js: ['src/content-script-frame.ts'],
      all_frames: true,
    },
  ],
  action: {
    default_icon: {
      128: 'icon.png',
    },
    default_popup: 'src/popup.html',
  },
  permissions: ['storage'],
  host_permissions: ['https://www.youtube.com/*'],
})

// TODO: https://github.com/crxjs/chrome-extension-tools/issues/1145
export default defineConfig({
  plugins: [react(), crx({ manifest }), zip()],
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    cors: {
      origin: [/chrome-extension:\/\//],
    },
  },
})
