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

// Inisialisasi Firebase
firebase.initializeApp(firebaseConfig);

// Mengambil referensi ke Firebase Storage
const storage = firebase.storage();

// Mendapatkan referensi ke elemen di HTML
const imageList = document.getElementById('imageList');
const documentList = document.getElementById('documentList');
const fileInput = document.getElementById('fileInput');
const uploadButton = document.getElementById('uploadButton');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');

// Fungsi untuk menampilkan file sesuai dengan tipe
function displayFile(fileRef) {
    const fileName = fileRef.name;
    const ext = fileName.split('.').pop().toLowerCase();

    // Membuat kontainer file
    const fileContainer = document.createElement('div');
    fileContainer.classList.add('file-container');

    // Mendapatkan timestamp saat ini untuk digunakan sebagai bagian dari ID
    const timestamp = new Date().getTime();

    // Membuat ID yang unik untuk elemen file
    const uniqueID = `${fileName}_${timestamp}`;

    // Cek apakah file sudah ditampilkan sebelumnya
    if (!document.getElementById(uniqueID)) {
        if (ext === 'jpg' || ext === 'jpeg' || ext === 'png' || ext === 'gif') {
            // Jika gambar, tampilkan sebagai gambar
            fileRef.getDownloadURL().then((url) => {
                const img = document.createElement('img');
                img.src = url;
                img.id = uniqueID; // Berikan ID yang unik
                fileContainer.appendChild(img);

                // Menambahkan informasi pengguna di atas gambar
                const metadata = fileRef.metadata;
                if (metadata && metadata.customMetadata && metadata.customMetadata.uploadedBy) {
                    const uploadedByElement = document.createElement('p');
                    uploadedByElement.textContent = `Uploaded by: ${metadata.customMetadata.uploadedBy}`;
                    fileContainer.appendChild(uploadedByElement);
                }

                imageList.appendChild(fileContainer);
            }).catch((error) => {
                console.error('Error displaying image:', error);
                // Jika terjadi kesalahan, tampilkan nama file saja
                const fileNameElement = document.createElement('p');
                fileNameElement.textContent = fileName;
                fileContainer.appendChild(fileNameElement);
                imageList.appendChild(fileContainer);
            });
        } else {
            // Jika bukan gambar, tampilkan sebagai link dengan nama file
            // Jika bukan gambar, tampilkan sebagai tautan untuk mengunduh file
            const link = document.createElement('a');
            link.href = '#'; // Atur URL yang sesuai jika perlu
            link.textContent = fileName;
            link.id = uniqueID; // Berikan ID yang unik
            link.addEventListener('click', () => {
                fileRef.getDownloadURL().then((url) => {
                    window.open(url, '_blank');
                }).catch((error) => {
                    console.error('Error getting download URL:', error);
                    alert('Terjadi kesalahan saat mendapatkan URL unduhan');
                });
            });
            fileContainer.appendChild(link);
            documentList.appendChild(fileContainer);
        }
    }
}

// Fungsi untuk menampilkan daftar file dari Firebase Storage
function displayFiles() {
    // Membersihkan elemen imageList sebelum menambahkan gambar-gambar baru
    imageList.innerHTML = '';

    const imagesRef = storage.ref('images');
    const documentsRef = storage.ref('documents');

    imagesRef.listAll().then((imageRes) => {
        imageRes.items.forEach((imageRef) => {
            displayFile(imageRef);
        });
    }).catch((error) => {
        console.error('Error displaying images:', error);
    });

    documentsRef.listAll().then((docRes) => {
        docRes.items.forEach((docRef) => {
            displayFile(docRef);
        });
    }).catch((error) => {
        console.error('Error displaying documents:', error);
    });
}

// Memanggil fungsi untuk menampilkan daftar file saat halaman dimuat
displayFiles();

// Fungsi untuk mengunggah file ke Firebase Storage
function uploadFile() {
    const file = fileInput.files[0];

    if (file) {
        // Menentukan path di Firebase Storage sesuai dengan tipe file
        let path = 'images/' + file.name;

        // Membuat referensi ke lokasi penyimpanan file di Firebase Storage
        const storageRef = storage.ref(path);

        // Membuat objek metadata dengan informasi pengguna
        const metadata = {
            customMetadata: {
                'uploadedBy': firebase.auth().currentUser.uid, // Misalnya, gunakan ID pengguna sebagai informasi pengguna
            }
        };

        // Mengunggah file dengan metadata
        const uploadTask = storageRef.put(file, metadata);

        // Update bar proses saat mengunggah
        uploadTask.on('state_changed', 
            (snapshot) => {
                // Menghitung persentase unggah
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                progressBar.value = progress;
                progressText.textContent = `Progress: ${progress.toFixed(2)}%`;
            },
            (error) => {
                console.error('Error mengunggah file:', error);
                alert('Terjadi kesalahan saat mengunggah file');
            },
            () => {
                // Menampilkan ulang gambar dan daftar file setelah unggah selesai
                console.log('File berhasil diunggah');
                alert('File berhasil diunggah');
                imageList.innerHTML = '';
                documentList.innerHTML = '';
                displayFiles(); // Panggil disini setelah unggah selesai
            }
        );
    } else {
        alert('Pilih file terlebih dahulu');
    }
}

// Mendapatkan referensi ke elemen tombol log out
const logoutButton = document.getElementById('logoutButton');

// Penanganan acara klik pada tombol log out
logoutButton.addEventListener('click', () => {
    firebase.auth().signOut().then(() => {
        // Redirect ke halaman login setelah berhasil logout
        window.location.href = "login.html";
    }).catch((error) => {
        console.error('An error occurred while logging out:', error);
    });
});

// Menambahkan event listener untuk tombol unggah file
uploadButton.addEventListener('click', uploadFile);
