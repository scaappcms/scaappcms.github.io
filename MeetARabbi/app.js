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

function initiateAddRabbi() {
    let data = {
        key: database.ref('MeetARabbi/').push().key,
        Name: '----'
    }
    insertRabbiBoxWithData(data);
}
function insertRabbiBoxWithData(data) {
    let template = Handlebars.compile($('#rabbi-upload-template').html());
    let html = template(data);
    $('main').append(html);
    $('.img-input').on('change', uploadImage);
    $('.input').on('change', function() {
        database.ref('MeetARabbi/' + $(this).attr('id')).set($(this).val());
    });
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
async function uploadImage() {
    let path = 'MeetARabbi/' + $(this).attr('id');
    let imageString = await getBase64($(this).prop('files')[0]);
    database.ref(path).set(imageString);
    $(`#${$(this).attr('id').replace('/', '-')}-preview`).attr('src', imageString);
 }
 async function loadRabbis() {
    $('main').html('');
    let rabbis = await database.ref('MeetARabbi/').once('value');
    rabbis = rabbis.val();
    for (rabbiKey in rabbis) {
        let data = rabbis[rabbiKey];
        data['key'] = rabbiKey;
        insertRabbiBoxWithData(data);
    }
 }
 function removeRabbi(key) {
     database.ref('MeetARabbi/' + key).remove();
     loadRabbis();
 }
 document.onload = loadRabbis();