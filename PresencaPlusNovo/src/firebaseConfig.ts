// Substitua os valores abaixo pelas suas credenciais do projeto Firebase
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCSk2nUxVUDCjHJq6sy13KMC0_R-hh0GTU",
  authDomain: "syspresenca.firebaseapp.com",
  projectId: "syspresenca",
  storageBucket: "syspresenca.appspot.com",
  messagingSenderId: "819650641280",
  appId: "1:819650641280:web:c7e471dc7f3d622fdc5565",
  measurementId: "G-RP49BFNQHE"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
