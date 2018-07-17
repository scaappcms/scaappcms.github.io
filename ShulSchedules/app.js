const config = {
    apiKey: "AIzaSyAtnW8LCJ_4q_GFIB_m9aOk0zEt_o3dPcM",
    authDomain: "sca-app-cms.firebaseapp.com",
    databaseURL: "https://sca-app-cms.firebaseio.com",
    projectId: "sca-app-cms",
    storageBucket: "",
    messagingSenderId: "970834659998"
  };
firebase.initializeApp(config);
const database = firebase.database();
document.onload = loadShulData();

function finalizeShulAdd() {
    let shulName = $('#newShulInput').val();
    if (shulName != "") {
        let snapshot = database.ref('Shuls').push(shulName);
        database.ref('Shul-Schedules/' + snapshot.key).set({
            ShulTitle: shulName,
            Address: '---',
            FriNight: '---',
            SatMorning: '---',
            SatAfternoon: '---',
            WeekMornings: '---',
            WeekAfternoons: '---'
        });
        $('#addShulPopup').hide();
        $('#newShulInput').val('');
        loadShulData();
    } else {
        alert('Please enter the shul name before continuing.');
    }
}
async function loadShulData() {
    $('main').html('');
    var shulSchedules = await new Promise(function(resolve, reject) {
        database.ref('Shul-Schedules').once('value', snapshot => {
            resolve(snapshot.val());
        });
    });
    if (!shulSchedules) return;
    for (let key of Object.keys(shulSchedules)) {
        let data = {
            ShulKey: key,
            Name: shulSchedules[key].ShulTitle,
            Address: shulSchedules[key].Address,
            FriNight: shulSchedules[key].FriNight,
            SatMorning: shulSchedules[key].SatMorning,
            SatAfternoon: shulSchedules[key].SatAfternoon,
            WeekMornings: shulSchedules[key].WeekMornings,
            WeekAfternoons: shulSchedules[key].WeekAfternoons
        }
        let template = Handlebars.compile($('#shulDiv-template').html());
        let html     = template(data);
        $('main').prepend(html);
        $('.shulScheduleInput').change(updateFieldInDB);
    }
    
}
function deleteShul(key, name) {
    if (confirm(`You are about to remove ${name} permanently. Are you sure you want to continue?`)) {
        database.ref('Shul-Schedules/' + key).remove();
        database.ref('Shuls/' + key).remove();
        loadShulData();
    }
}
function updateFieldInDB() {
    const path = 'Shul-Schedules/' + $(this).attr('id');
    database.ref(path).set($(this).val());
}