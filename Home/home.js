var lastTab = 'ShulSchedules';

function changeTo(pageName) {
    $('#' + pageName + '-iframe').show();
    $('#' + lastTab + '-iframe').hide();
    $('#' + lastTab).removeClass('opened');
    $('#' + pageName).addClass('opened');
    lastTab = pageName;
}