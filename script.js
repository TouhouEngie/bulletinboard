// TODO: Store this in PHP or something idfk
import { firebaseConfig } from './secrets.js';

// firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import { getFirestore, addDoc, doc, collection, getDocs } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

// https://firebase.google.com/docs/web/setup#available-libraries
// github stfu, this is already restricted on the server side lmao
const firebaseConfig = {
    "apiKey": "AIzaSyA8bgyoLtWiHQqnziio4if2aSTJ1k-y0qc",
    "authDomain": "bulletinboard-f0479.firebaseapp.com",
    "projectId": "bulletinboard-f0479",
    "storageBucket": "bulletinboard-f0479.firebasestorage.app",
    "messagingSenderId": "614006899593",
    "appId": "1:614006899593:web:04c13c5f3505ebc0d55758"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth();
const database = getFirestore();
const elgoog = new GoogleAuthProvider();

function signInWithEmail(email, password) {
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
        })
        .catch ((error) => {
            const errorCode = error.code;
            const message = error.message;
        });
}

function createAccount(email, password) {
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
        })
        .catch ((error) => {
            const errorCode = error.code;
            const message = error.message;
        });
}

function signTheHeckOut() {
    signOut(auth).then(() => {
    // succ
    }).catch((error) => {
        // fucc
    });
}

// start actual code

function postIt() {
    addDoc(collection(database, "posts"), {
        message: message.value,
        author: auth.currentUser.displayName,
    });
    document.getElementById("alert").innerHTML = "Message sent!";
    loadPosts();
}

document.getElementById("signInWithElgoog").addEventListener("click", () => { signInWithPopup(auth, elgoog).then(() => { window.location.replace("/"); }); });

async function loadPosts() {
    const posts = await getDocs(collection(database, "posts"));
    document.getElementById("postboard").innerHTML = "";
    posts.forEach((doc) => {
        const newPost = document.createElement("div");
        newPost.classList.add("bg-sky-500", "border", "rounded-md", "p-3")
        const name = document.createElement("p")
        name.innerText = doc.data().author;
        name.classList.add("text-sm")
        const message = document.createElement("p")
        message.innerText = doc.data().message;
        newPost.appendChild(name);
        newPost.appendChild(message);
        document.getElementById("postboard").appendChild(newPost);
    });
}

const form = document.getElementById("form");
form.addEventListener("submit", (e) => {
    e.preventDefault();
    // or just f#cking hide the form before user login?
    const currentUser = auth.currentUser;
    if (!(currentUser)) {
        document.getElementById("alert").innerText = "Please sign in first.";
    } else {
        postIt();
    }
});
const message = document.getElementById("message");
loadPosts();

