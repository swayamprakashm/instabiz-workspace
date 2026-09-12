import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDALoQ2hjlTpXDKAahILq4xC_3WZ-ZBo_I",
  authDomain: "instabiz-2326.firebaseapp.com",
  projectId: "instabiz-2326",
  storageBucket: "instabiz-2326.firebasestorage.app",
  messagingSenderId: "1053352056753",
  appId: "1:1053352056753:web:d2ff2498511c35eaae8f90",
  measurementId: "G-JQXKN1BN1F"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);