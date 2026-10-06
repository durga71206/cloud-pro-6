// Firebase imports
import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    query,
    orderBy
} from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// Firebase configuration

const firebaseConfig = {
    apiKey: "AIzaSyDlW5GIuMGqQbjQpFH9AOYohZrTjI-97MU",
    authDomain: "cloud-digital-notice-boa-47d04.firebaseapp.com",
    projectId: "cloud-digital-notice-boa-47d04",
    storageBucket: "cloud-digital-notice-boa-47d04.firebasestorage.app",
    messagingSenderId: "299395825404",
    appId: "1:299395825404:web:36ca07d11632059918e179"
};


// Initialize Firebase

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


// Login

window.login = async function () {

    const email = document.getElementById("email").value;

    const password = document.getElementById("password").value;

    const message = document.getElementById("message");


    if (!email || !password) {

        message.innerText = "Please enter email and password.";

        message.style.color = "red";

        return;
    }


    try {

        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        message.innerText = "Login successful!";

        message.style.color = "green";

    } catch (error) {

        message.innerText = error.message;

        message.style.color = "red";
    }
};


// Register

window.register = async function () {

    const email = document.getElementById("email").value;

    const password = document.getElementById("password").value;

    const message = document.getElementById("message");


    if (!email || !password) {

        message.innerText = "Please enter email and password.";

        message.style.color = "red";

        return;
    }


    if (password.length < 6) {

        message.innerText =
            "Password must contain at least 6 characters.";

        message.style.color = "red";

        return;
    }


    try {

        await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        message.innerText =
            "Account created successfully!";

        message.style.color = "green";

    } catch (error) {

        message.innerText = error.message;

        message.style.color = "red";
    }
};


// Logout

window.logout = async function () {

    try {

        await signOut(auth);

    } catch (error) {

        console.log(error);
    }
};


// Check Login Status

onAuthStateChanged(auth, (user) => {

    const loginSection =
        document.getElementById("loginSection");

    const noticeSection =
        document.getElementById("noticeSection");


    if (user) {

        loginSection.classList.add("hidden");

        noticeSection.classList.remove("hidden");

        loadNotices();

    } else {

        loginSection.classList.remove("hidden");

        noticeSection.classList.add("hidden");
    }

});


// Add Notice

window.addNotice = async function () {

    const title =
        document.getElementById("noticeTitle").value;

    const description =
        document.getElementById("noticeDescription").value;

    const department =
        document.getElementById("noticeDepartment").value;

    const date =
        document.getElementById("noticeDate").value;

    const important =
        document.getElementById("important").checked;


    if (!title || !description || !department || !date) {

        alert("Please fill all fields.");

        return;
    }


    try {

        await addDoc(
            collection(db, "notices"),
            {
                title: title,
                description: description,
                department: department,
                date: date,
                important: important,
                createdAt: new Date()
            }
        );


        alert("Notice added successfully!");


        document.getElementById("noticeTitle").value = "";

        document.getElementById("noticeDescription").value = "";

        document.getElementById("noticeDepartment").value = "";

        document.getElementById("noticeDate").value = "";

        document.getElementById("important").checked = false;


        loadNotices();

    } catch (error) {

        console.error(error);

        alert("Error adding notice: " + error.message);
    }
};


// Load Notices

async function loadNotices() {

    const noticeList =
        document.getElementById("noticeList");


    noticeList.innerHTML =
        "<p>Loading notices...</p>";


    try {

        const q = query(
            collection(db, "notices"),
            orderBy("date", "desc")
        );


        const snapshot =
            await getDocs(q);


        noticeList.innerHTML = "";


        if (snapshot.empty) {

            noticeList.innerHTML =
                "<p>No notices available.</p>";

            return;
        }


        snapshot.forEach((doc) => {

            const notice = doc.data();


            const card =
                document.createElement("div");

            card.className = "notice-card";


            if (notice.important) {

                card.classList.add("important");
            }


            card.innerHTML = `

                <h3>${notice.title}</h3>

                <p>
                    ${notice.description}
                </p>

                <p>
                    <strong>Department:</strong>
                    ${notice.department}
                </p>

                <p>
                    <strong>Date:</strong>
                    ${notice.date}
                </p>

                ${
                    notice.important
                    ? '<span class="badge">IMPORTANT</span>'
                    : ''
                }

            `;


            noticeList.appendChild(card);

        });


    } catch (error) {

        console.error(error);

        noticeList.innerHTML =
            "<p>Unable to load notices.</p>";
    }
}