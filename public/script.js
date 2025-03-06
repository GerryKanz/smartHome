
function device_name(name) {
    let devicename = name.value;

    //add device name to html
    document.getElementById('todelete').innerHTML = `${devicename}`

    //add css class to the delete meassge and button.
    //makes them appear in sync with selected device name
    document.getElementById('deleteBtn').style.display = 'block';
}

//responsible for submition of forms on click
function submit_form(ID) {
    var form = document.getElementById(ID);
    form.submit();
}

//displays a warning message before user tries to delete a device
function radioClicked() {
    let deviceSelected = document.getElementById('deletemsg').checked;
    const warning = document.getElementById('deleteBtn');
    if (deviceSelected) {
        warning.style.display = 'block';
    }
}

//display a success  or failure message from server after every delete attempt
function confirmDelete() {
    let text = 'Are you sure?';
    var form = document.getElementById('deleDvc');



    if (confirm(text) == true) {
        form.submit();

        const scsMsge = document.getElementById('success-msg');
        document.getElementById('deleteBtn').style.display = 'none';
        scsMsge.style.display = 'block';
    }

}



//display a related form field and hide other form fields that arent necessary.
function displayField(entry) {
    let temperature = document.getElementById('temperature');
    let volume = document.getElementById('volume').classList;
    let videoQuality = document.getElementById('videoQuality').classList;
    let itensity = document.getElementById('itensity').classList;
    let audio = document.getElementById('audio').classList;
    let blinderdrop = document.getElementById('blinderdrop').classList;

    if (entry.value == 'airConditioner') {
        temperature.classList.remove('form_field');
    }
    else {
        temperature.classList.add('form_field');
    }
    if (entry.value == 'lights') {
        itensity.remove('form_field');

    } else {
        itensity.add('form_field');
    }

    if (entry.value == 'smartTV') {
        volume.remove('form_field');
    }
    else {
        volume.add('form_field');

    }

    if (entry.value == 'CCTV') {
        videoQuality.remove('form_field');
        audio.remove('form_field');
    }
    else {
        videoQuality.add('form_field');
        audio.add('form_field');
    }

    if (entry.value == 'blinder') {
        blinderdrop.remove('form_field');
        blinderdrop.remove('form_field');
    } else {
        blinderdrop.add('form_field');
        blinderdrop.add('form_field');
    }
}
