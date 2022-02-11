document.addEventListener('DOMContentLoaded', () => {
    // Elements declaration
    const openmodalBtn = document.querySelector('#modal-testDrive'),
          closemodalBtn = document.querySelector('#modalClose-button'),
          submitBtn = document.querySelector('#modal-submit'),
          modalWindow = document.querySelector('.modal-window'),
          fioInput = document.querySelector('#FIO-input'),
          telInput = document.querySelector('#tel-input'),
          emailInput = document.querySelector('#email-input'),
          form = document.querySelector('#modal-form');

    let fioValue,
        fioLen,
        telValue,
        telLen;

    // Modal-window buttons
    openmodalBtn.addEventListener('click', () => {
        modalWindow.classList.remove('opened');
        modalWindow.classList.remove('out');
        modalWindow.classList.add('opened');
    });

    closemodalBtn.addEventListener('click', () => {
        modalWindow.classList.add('out');

        form.reset();
    });

    // Input`s change validation
    fioInput.addEventListener('input', () => {
        if (fioInput.classList.contains('_error')) fioInput.classList.remove('_error');


        fioValue = fioInput.value, fioLen = fioValue.length;

        if (!/^[A-Z]/.test(fioValue) || !/^[a-zA-Z]*$/.test(fioValue) && !/[a-zA-Z]\s/.test(fioValue) || /\s[a-z]/.test(fioValue) ||/\s\W/.test(fioValue) || /\s\d/.test(fioValue) || /[a-zA-Z]\s[a-zA-Z]\s/.test(fioValue) || /[a-zA-Z]\s[a-zA-Z]\d/.test(fioValue) || /[a-zA-Z]\s[a-zA-Z]\W/.test(fioValue) ) {
            fioInput.value = fioValue.substring(0, fioLen - 1);
        }
    });

    telInput.addEventListener('input', () => {
        if (telInput.classList.contains('_error')) telInput.classList.remove('_error');

        telValue = telInput.value, telLen = telValue.length;
        if (!/^(7|8)/.test(telValue) || /\d\D/.test(telValue) || telLen === 12) {
            telInput.value = telValue.substring(0, telLen - 1);
        }
    });

    emailInput.addEventListener('input', () => {
        if (emailInput.classList.contains('_error')) emailInput.classList.remove('_error');

        if (!/\w/.test(emailInput.value)) {
            emailInput.value = emailInput.value.substring(0, telLen - 1);
        }
    });

    // FormData processing
    form.addEventListener('submit', formdataSending);
    
    async function formdataSending(e) {
        e.preventDefault();
        let formData = new FormData(form);

        // Ready to send
        if (formValidate(formData)) {
            let obj = {};
            for(let item of formData.entries()) {
                obj[item[0]] = item[1];
            }

            localStorage.setItem('testDrive_token', JSON.stringify(obj));

            submitBtn.value = 'Registered';
            submitBtn.classList.add('_success');
            setTimeout(() => {
                submitBtn.value = 'Register';
                submitBtn.classList.remove('_success');
            }, 2000);
        }

        return;
    };

    // Validation
    function formValidate(formData) {
        if (fioInput.value !== '' && fioValue.split(' ') == fioValue || fioInput.value !== '' && fioInput.value.slice(-1) === ' ') {
            fioInput.value = '';
            fioInput.classList.add('_error');
        }
        
        if (telValue === '' || telInput.value.length < 10) {
            telInput.value = '';
            telInput.classList.add('_error');
        }

        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(emailInput.value)) {
            emailInput.value = '';
            emailInput.classList.add('_error');
        }

        let formRequires = document.querySelectorAll('._required');

        let keys = [], j = 0, errors = 0;
        for(let key of formData.keys()) {
            keys[j] = key;
            j++;
        }

        for(let i = 0; i < formRequires.length; i++) {
            if (formData.get(keys[i]) === '') {
                formRequires[i].classList.add('_error');
                formRequires[i].value = '';
                errors++;
            }
        }
        
        if (errors === 0) {
            for(let i = 0; i < formRequires.length; i++) {
                formRequires[i].value = '';   
            }

            return true;
        } else {
            return false;
        }
    };
})

// Разобраться с последними 2 условиями валидации FIO-input (нерабочие)