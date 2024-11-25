// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAaV1obh7GmbdCoOF3kX89L8tPMyy9VhIw",
  authDomain: "fulbo21hs.firebaseapp.com",
  projectId: "fulbo21hs",
  storageBucket: "fulbo21hs.firebasestorage.app",
  messagingSenderId: "117038985535",
  appId: "1:117038985535:web:c8f0e4fc76dc526337a38a",
  measurementId: "G-0W1BKHCM9W"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Inicializar servicios específicos si los necesitas
const database = firebase.database();
const auth = firebase.auth();

// No podemos usar analytics con la versión actual del SDK, así que lo omitimos

