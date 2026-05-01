import * as faceapi from 'face-api.js';

const MODEL_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights';

export class FaceApiService {
  private static modelsLoaded = false;

  static async loadModels() {
    if (this.modelsLoaded) return;

    try {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
      ]);
      this.modelsLoaded = true;
      console.log('Face-api models loaded successfully');
    } catch (error) {
      console.error('Error loading face-api models:', error);
      throw error;
    }
  }

  static async getFaceDescriptor(inputElement: HTMLVideoElement | HTMLImageElement) {
    if (!this.modelsLoaded) {
      await this.loadModels();
    }
    const detection = await faceapi
      .detectSingleFace(inputElement, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) return null;
    
    // Return a plain array instead of Float32Array for easy JSON storage
    return Array.from(detection.descriptor);
  }

  static calculateDistance(descriptor1: number[], descriptor2: number[]) {
    // Euclidean distance
    return Math.sqrt(
      descriptor1.reduce((sum, val, i) => sum + Math.pow(val - descriptor2[i], 2), 0)
    );
  }

  static findBestMatch(scannedDescriptor: number[], patients: any[]) {
    const threshold = 0.6; // face-api.js standard threshold
    let bestMatch = null;
    let minDistance = threshold;

    patients.forEach(patient => {
      if (patient.faceDescriptor) {
        const distance = this.calculateDistance(scannedDescriptor, patient.faceDescriptor);
        if (distance < minDistance) {
          minDistance = distance;
          bestMatch = patient;
        }
      }
    });

    return bestMatch;
  }
}
