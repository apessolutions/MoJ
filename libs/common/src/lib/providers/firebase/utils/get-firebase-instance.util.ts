import * as admin from 'firebase-admin';
import firebaseConfig from '../config/firebase.config';

let isInitialized = false;
export function getFirebaseInstance() {
  if (!isInitialized) {
    admin.initializeApp({
      credential: admin.credential.cert(firebaseConfig() as any),
    });
  }
  isInitialized = true;
  return admin;
}
