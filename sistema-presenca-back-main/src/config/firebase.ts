import admin from 'firebase-admin';

let initialized = false;

export function initializeFirebase() {
  if (initialized) return;
  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      // Se necessário, adicione databaseURL ou outras configs aqui
    });
    initialized = true;
    console.log('Firebase Admin inicializado!');
  }
}

export { admin };
