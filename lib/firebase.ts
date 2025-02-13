import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCW1ow3vngWIu-8mvUEQC_DQMjKullvqjY",
  authDomain: "jobzera-2af41.firebaseapp.com",
  projectId: "jobzera-2af41",
  storageBucket: "jobzera-2af41.firebasestorage.app",
  messagingSenderId: "605078549649",
  appId: "1:605078549649:web:cf4ac886e42c945b92bb30",
  measurementId: "G-JR1XPF2R25"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Initialize Analytics and get a reference to the service
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { app, auth, db, analytics, storage };

