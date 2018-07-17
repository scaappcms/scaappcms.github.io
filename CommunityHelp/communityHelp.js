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
document.onload = loadCommunityHelpers();

function loadCommunityHelpers() {
    $('main').html('');
    database.ref('CommunityHelpers').once('value', snapshot => {
        let categories = snapshot.val();
        for (let categoryID of Object.keys(categories)) {
            let categoryDivTemplate = Handlebars.compile($('#category-template').html())
            let categoryDivHTML     = categoryDivTemplate({categoryKey: categoryID, Title: categories[categoryID].Title});
            $('#main-content').append(categoryDivHTML);
            console.log(Object.keys(categories[categoryID]));
            for (let helperID of Object.keys(categories[categoryID])) {
                
                if (helperID != "Title") {
                    console.log(helperID);
                    let helperDivTemplate = Handlebars.compile($('#communityHelper-template').html());
                    let helperDivHTML     = helperDivTemplate({categoryKey: categoryID, helperID: helperID , helper: categories[categoryID][helperID]});
                    $(`#${categoryID}-helpers`).append(helperDivHTML);
                }
            }
        }
        $('.HelperInput').on('change', updateFieldInDB);
    });
}

function updateFieldInDB() {
    let path = 'CommunityHelpers/' + $(this).attr('id');
    database.ref(path).set($(this).val());
}

function addCategory() {
    let categoryName = $('#newCategoryInput').val();
    if (categoryName != "") {
        let snapshot = database.ref('CommunityHelperCategories').push(categoryName);
        addHelper(snapshot.key);
        database.ref(`CommunityHelpers/${snapshot.key}/Title`).set(categoryName);
        loadCommunityHelpers();
    } else {
        alert('Please enter the category name before continuing.');
    }
}
function addHelper(categoryID) {
    database.ref('CommunityHelpers/' + categoryID).push({
        Name: '----',
        Email: '----',
        Phone: '----'
    });
}
function removeHelper(path, name) {
    if (confirm("You are about to remove " + name + " from community helpers. Are you sure you want to continue?")) {
        database.ref('CommunityHelpers/' + path).remove();
        loadCommunityHelpers();
    }
}
function goToShulSchedules() {
    window.location.replace('/ShulSchedules');
}
function goToEvents() {
    window.location.replace('/Events');
}