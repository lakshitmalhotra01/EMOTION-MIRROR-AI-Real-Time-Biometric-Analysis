import * as faceapi from 'face-api.js';

/**
 * Loads all 5 required face-api.js models sequentially,
 * triggering a progress callback after each model loads.
 * 
 * @param {string} modelUrl URI path to the models folder (e.g., '/models')
 * @param {function} onProgressCallback Callback receiving ({ modelId, progress, status })
 */
export async function loadAllModels(modelUrl = '/models', onProgressCallback) {
  const models = [
    { id: 'tinyFaceDetector', name: 'Tiny Face Detector (Bounding Box)', loader: faceapi.nets.tinyFaceDetector },
    { id: 'faceLandmark68Net', name: '68 Facial Landmark Net (Biometric Mesh)', loader: faceapi.nets.faceLandmark68Net },
    { id: 'faceRecognitionNet', name: 'Face Recognition Net (Identity Vector)', loader: faceapi.nets.faceRecognitionNet },
    { id: 'faceExpressionNet', name: 'Face Expression Net (Affect Analytics)', loader: faceapi.nets.faceExpressionNet },
    { id: 'ageGenderNet', name: 'Age & Gender Net (Demographic Classifier)', loader: faceapi.nets.ageGenderNet }
  ];

  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    
    // Notify starting load
    onProgressCallback({
      modelId: model.id,
      name: model.name,
      progress: 0,
      status: 'loading'
    });

    try {
      await model.loader.loadFromUri(modelUrl);
      
      // Notify model is loaded successfully
      onProgressCallback({
        modelId: model.id,
        name: model.name,
        progress: 100,
        status: 'loaded'
      });
    } catch (error) {
      console.error(`Error loading model ${model.name} from ${modelUrl}:`, error);
      onProgressCallback({
        modelId: model.id,
        name: model.name,
        progress: 0,
        status: 'error',
        error: error.message
      });
      throw new Error(`Failed to load ${model.name}`);
    }
  }
}
