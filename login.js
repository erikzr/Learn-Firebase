// Konfigurasi Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAfZwJQvd0MDcHeFmyRR5IpTWfJW6l_yRY",
    authDomain: "database-1d5b9.firebaseapp.com",
    projectId: "database-1d5b9",
    storageBucket: "database-1d5b9.appspot.com",
    messagingSenderId: "742126491421",
    appId: "1:742126491421:web:86d6ac2680d793a0a833f4",
    measurementId: "G-X4HZFNDWBV"
};
firebase.initializeApp(firebaseConfig);


// Mengambil referensi ke Firebase Authentication
const auth = firebase.auth();

// Mendapatkan referensi ke form login
const loginForm = document.getElementById('loginForm');

// Menangani login
loginForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Mencegah form dari pengiriman default

    const email = loginForm.email.value;
    const password = loginForm.password.value;

    // Melakukan login menggunakan Firebase Authentication
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Login berhasil, redirect ke halaman index
            window.location.href = "index.html";
        })
        .catch((error) => {
            // Handle errors
            console.error('Login error:', error);
            alert('Login gagal. Periksa kembali email dan password Anda.');
        });
});
