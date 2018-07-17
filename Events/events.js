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
document.onload = reloadCurrentEvents();

async function addEvent() {
    let snapshot = await database.ref('Events/').push();
    let data = {
        Title: '----',
        Subtitle: '----',
        Address: '----',
        Date: '----'
    }
    database.ref('Events/' + snapshot.key).set(data);
    data['EventKey'] = snapshot.key;
    insertEventWithData(data);
}
function updateFieldInDB() {
    let path = 'Events/' + $(this).attr('id');
    database.ref(path).set($(this).val());
}
function getBase64(file) {
    return new Promise(function(resolve, reject) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            resolve(reader.result)
        };
        reader.onerror = function (error) {
            reject(error);
        };
    });
 }
 async function uploadImgString() {
    let path = 'Events/' + $(this).attr('id');
    let imageString = await getBase64($(this).prop('files')[0]);
    database.ref(path).set(imageString);
    let prevImgId = "#" + $(this).attr('id').slice(0, $(this).attr('id').indexOf('/')) + "-prevImg";
    console.log(prevImgId);
    $(prevImgId).attr('src', imageString);
 }
 function reloadCurrentEvents() {
    $('main').html('');
    database.ref('Events').once('value', snapshot => {
        let events = snapshot.val();
        for (let eventKey of Object.keys(events)) {
            let eventData = events[eventKey];
            eventData["EventKey"] = eventKey;
            insertEventWithData(eventData);
        }
    });
 }
 function insertEventWithData(eventData) {
    let template = Handlebars.compile($('#event-template').html());
    let html = template(eventData);
    $('main').append(html);
    $('.eventInput').on('change', updateFieldInDB);
    $('.imageInput').on('change', uploadImgString);
 }
 function removeEvent(eventKey) {
    database.ref('Events/' + eventKey).remove();
    reloadCurrentEvents();
 }