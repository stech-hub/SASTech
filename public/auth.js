/* =========================
   FIREBASE AUTH SETUP
========================= */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

/* =========================
   YOUR FIREBASE CONFIG
========================= */
const firebaseConfig = {
  apiKey: "AIzaSyCyAIL9Ki7OVqgq23LgAQhmFQzN8ZAMtGM",
  authDomain: "bionurse-pro.firebaseapp.com",
  projectId: "bionurse-pro",
  storageBucket: "bionurse-pro.firebasestorage.app",
  messagingSenderId: "262309708872",
  appId: "1:262309708872:web:b26529e0283a17aafc447d"
};

/* =========================
   INIT
========================= */
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

/* =========================
   GOOGLE SIGN IN
========================= */
window.googleSignIn = async function () {
  try {
    await signInWithPopup(auth, provider);
    window.location.href = "/pro.html";
  } catch (error) {
    alert("Google sign-in failed: " + error.message);
  }
};

/* =========================
   EMAIL SIGN UP
========================= */
window.emailSignUp = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Please fill all fields");
    return;
  }

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    window.location.href = "/pro.html";
  } catch (error) {
    alert(error.message);
  }
};

/* =========================
   EMAIL LOGIN
========================= */
window.emailLogin = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "/pro.html";
  } catch (error) {
    alert(error.message);
  }
};

/* =========================
   AUTO REDIRECT IF LOGGED IN
========================= */
onAuthStateChanged(auth, (user) => {
  if (user && window.location.pathname.includes("index")) {
    window.location.href = "/pro.html";
  }
});
