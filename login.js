const config = {
    apiKey: "AIzaSyAtnW8LCJ_4q_GFIB_m9aOk0zEt_o3dPcM",
    authDomain: "sca-app-cms.firebaseapp.com",
    databaseURL: "https://sca-app-cms.firebaseio.com",
    projectId: "sca-app-cms",
    storageBucket: "",
    messagingSenderId: "970834659998"
    };
firebase.initializeApp(config);

async function login() {
    let email = $('#login-email').val();
    let password = $('#login-pass').val();
    if (email != "" && password != "") {
        try {
            await firebase.auth().signInWithEmailAndPassword(email, password);
            window.location.replace('/ShulSchedules');
        } catch (error) {
            alert(error.message);
        }
    } else {
        alert('Email and Password fields must be entered before logging in.');
    }
}