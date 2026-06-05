import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MODELS_DIR = path.join(__dirname, 'public', 'models');
const BASE_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/';

const models = [
  'tiny_face_detector_model-weights_manifest.json',
  'tiny_face_detector_model-shard1',
  'face_landmark_68_model-weights_manifest.json',
  'face_landmark_68_model-shard1',
  'face_recognition_model-weights_manifest.json',
  'face_recognition_model-shard1',
  'face_recognition_model-shard2',
  'face_expression_model-weights_manifest.json',
  'face_expression_model-shard1',
  'age_gender_model-weights_manifest.json',
  'age_gender_model-shard1'
];

// Ensure models directory exists
if (!fs.existsSync(MODELS_DIR)) {
  fs.mkdirSync(MODELS_DIR, { recursive: true });
}

console.log('🌐 Starting download of face-api.js models...\n');

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: status code ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {}); // Delete local file on error
      reject(err);
    });
  });
}

async function run() {
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    const url = `${BASE_URL}${model}`;
    const dest = path.join(MODELS_DIR, model);
    
    process.stdout.write(`📥 [${i + 1}/${models.length}] Downloading ${model}... `);
    
    try {
      if (fs.existsSync(dest) && fs.statSync(dest).size > 0) {
        console.log('✅ (Already Exists)');
      } else {
        await downloadFile(url, dest);
        console.log('✅ Done');
      }
    } catch (err) {
      console.log('❌ Error');
      console.error(`Error downloading ${model}:`, err.message);
    }
  }
  
  console.log('\n🎉 All models downloaded and placed in /public/models/!');
}

run();
