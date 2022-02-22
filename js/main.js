document.addEventListener('DOMContentLoaded', () => {
    // Elements declaration
    const openmodalBtn = document.querySelector('#modal-testDrive'),
          closemodalBtn = document.querySelector('#modalClose-button'),
          submitBtn = document.querySelector('#modal-submit'),
          modalWindow = document.querySelector('.modal-window'),
          fioInput = document.querySelector('#FIO-input'),
          telInput = document.querySelector('#tel-input'),
          emailInput = document.querySelector('#email-input'),
          form = document.querySelector('#modal-form'),
          startItem = document.querySelector('.startItem').value,
          daysNum = document.querySelector('#days-num'),
          hoursNum = document.querySelector('#hours-num'),
          minutesNum = document.querySelector('#minutes-num'),
          secondsNum = document.querySelector('#seconds-num'),
          daysWord = document.querySelector('#days-word'),
          hoursWord = document.querySelector('#hours-word'),
          minutesWord = document.querySelector('#minutes-word'),
          secondsWord = document.querySelector('#seconds-word'),
          second = 1000,
          minute = second * 60,
          hour = minute * 60,
          day = hour * 24;

    let fioValue,
        fioLen,
        telValue,
        telLen,
        tokens,
        timeLeft,
        errors = 0;


        
    // Дата, до которой будет вестись обратный отсчет
    let countdownDate = new Date('Feb 30, 2022 0:00:00').getTime();

    const updateTimer = function() {
        let currDate = new Date().getTime(),
            days,
            hours,
            minutes,
            seconds;

        timeLeft = countdownDate - currDate;

        if (timeLeft > 0) {
            days = Math.floor(timeLeft / day);
        
            hours = Math.floor((timeLeft % day) / hour);
            if (hours < 10) hours = '0' + hours;

            minutes = Math.floor((timeLeft % hour) / minute);
            if (minutes < 10) minutes = '0' + minutes;

            seconds = Math.floor((timeLeft % minute) / second);
            if (seconds < 10) seconds = '0' + seconds;
            if (seconds == 60) seconds = 59;
        } else {
            days = 0;

            hours = '00';

            minutes = '00';

            seconds = '00';
        }

        daysNum.textContent = days;
        if ([1, 21].indexOf(days) !== -1) {
            daysWord.textContent = 'День';
        } else if ([2, 3, 4, 22, 23, 24].indexOf(days) !== -1) {
            daysWord.textContent = 'Дня';
        } else {
            daysWord.textContent = 'Дней';
        }

        hoursNum.textContent = hours;
        if (['01', 21].indexOf(hours) !== -1) {
            hoursWord.textContent = 'Час';
        } else if (['02', '03', '04', 22, 23, 24].indexOf(hours) !== -1) {
            hoursWord.textContent = 'Часа';
        } else {
            hoursWord.textContent = 'Часов';
        }

        minutesNum.textContent = minutes;
        if (['01', 21, 31, 41, 51].indexOf(minutes) !== -1) {
            minutesWord.textContent = 'Минута';
        } else if (['02', '03', '04', 22, 23, 24, 32, 33, 34, 42, 43, 44, 52, 53, 54].indexOf(minutes) !== -1) {
            minutesWord.textContent = 'Минуты';
        } else {
            minutesWord.textContent = 'Минут';
        }

        secondsNum.textContent = seconds;
        if (['01', 21, 31, 41, 51].indexOf(seconds) !== -1) {
            secondsWord.textContent = 'Секунда';
        } else if(['02', '03', '04', 22, 23, 24, 32, 33, 34, 42, 43, 44, 52, 53, 54].indexOf(seconds) !== -1) {
            secondsWord.textContent = 'Секунды';
        } else {
            secondsWord.textContent = 'Секунд';
        }

        return timeLeft;
    };

    if (countdownDate && countdownDate !== 0) {
        const updateInterval = setInterval(updateTimer, 1000);
    }

    // Как текущая дата будет равна или больше указанной для обратного отсчета, останавливаем интервал
    if (timeLeft <= 0) {
        clearInterval(updateInterval);
    }  



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

        // Ready to send
        if (formValidate()) {
            if (localStorage.getItem('testDrive_tokens') === null) {
                tokens = [];
            } else {
                tokens = JSON.parse(localStorage.getItem('testDrive_tokens'));
            }
            
            let formData = new FormData(form);
            let obj = {};
            for(let item of formData.entries()) {
                console.log(item[1]);
                obj[item[0]] = item[1];
            }

            let formRequires = document.querySelectorAll('._required');
            for(let i = 0; i < formRequires.length; i++) {
                formRequires[i].value = '';
            }

            tokens.push(obj);
            localStorage.setItem('testDrive_tokens', JSON.stringify(tokens));

            submitBtn.value = 'Registered';
            submitBtn.classList.add('_success');
            setTimeout(() => {
                submitBtn.value = 'Register';
                submitBtn.classList.remove('_success');
            }, 2000);
        }
    };

    // Validation
    function formValidate() {
        fioInput.value = fioInput.value.trim();
        console.log('Валидировалось');
        if (fioInput.value === '' || fioInput.value !== '' && fioInput.value.split(' ') == fioInput.value) {
            fioInput.value = '';
            fioInput.classList.add('_error');
            errors++;
        }
        
        if (telValue === '' || telInput.value.length < 10) {
            telInput.value = '';
            telInput.classList.add('_error');
            errors++;
        }

        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(emailInput.value)) {
            emailInput.value = '';
            emailInput.classList.add('_error');
            errors++;
        }
        
        if (errors === 0) {
            return true;
        } else if (errors > 0) {
            errors = 0;

            return false;
        }
    };



    // Slider initialization
    const slider = (function() {
        const slider = document.querySelector('.slider'),
              sliderContent = document.querySelector('.slider-content'),
              sliderContentWrapper = document.querySelector('.slider-content__wrapper'),
              sliderItems = document.querySelectorAll('.slider-item');
        
        let autoButton = null,
            leftArrow = null,
            rightArrow = null,
            intervalId = null,
            bullets = null,
            pause = false;

        const info = {
            offset: 0,
            position: {
                current: 0,
                min: 0,
                max: sliderItems.length - 1
            },
            intervalSpeed: 0,

            update: function(value) {
                this.position.current = value;
                this.offset = -value;
            },
            reset: function() {
                this.position.current = 0;
                this.offset = 0;
            },

            dotsEnabled: false,
            arrowsEnabled: false,
            autobuttonEnabled: false,
            prevButtonDisabled: true,
		    nextButtonDisabled: false
        };

        function init(properties) {
            let {offset, position, intervalSpeed} = info;
            
            if (slider && sliderContent && sliderContentWrapper && sliderItems) {
                if (properties && properties.intervalSpeed) {
                    intervalSpeed = properties.intervalSpeed;
                }

                if (properties && properties.currentItem) {
                    if (parseInt(properties.currentItem) >= position.min && parseInt(properties.currentItem) <= position.max ) {
                        position.current = properties.currentItem;
                        offset = - properties.currentItem;	
                    }
                }

                if (properties && properties.bullets) {
                    info.dotsEnabled = true;
                }
                if (properties && properties.arrows) {
                    info.arrowsEnabled = true;
                }
                if (properties && properties.autoBtn) {
                    info.autobuttonEnabled = true;
                }
                
                updateButtonDisabling();
                createControls(info.dotsEnabled, info.arrowsEnabled, info.autobuttonEnabled);
                render();	
                updateInfo(properties.currentItem - 1);
            } else {
                console.log('Make sure the slider layout is correct (it has the following classes: "slider", "slider-content", "slider-content__wrapper", "slider-item", "dots"))');
            }
        };

        function createControls(dots = false, arrows = false, autobutton = false) {
            arrows ? createArrows() : null;
            dots ? createDots() : null;
            autobutton ? createAutobutton() : null;
            
            function createArrows() {
                leftArrow = createHTMLElement("a", "slider-switch");
                leftArrow.href = '#';
                leftArrow.id = 'prev-button';
                leftArrow.addEventListener("click", (e) => {
                    e.preventDefault();
                    updateInfo(info.position.current - 1)
                });

                leftSvg = createHTMLElement("img", "left-arrow");
                leftSvg.src = '../pics/left-arrow.svg';
                leftSvg.alt = 'icon';
                leftArrow.append(leftSvg);
                


                rightArrow = createHTMLElement("a", "slider-switch");
                rightArrow.href = '#';
                rightArrow.id = 'next-button';
                rightArrow.addEventListener("click", (e) => {
                    e.preventDefault();
                    updateInfo(info.position.current + 1)
                });

                rightSvg = createHTMLElement("img", "right-arrow");
                rightSvg.src = '../pics/right-arrow.svg';
                rightSvg.alt = 'icon';
                rightArrow.append(rightSvg);
    


                sliderContent.append(leftArrow, rightArrow);
            };

            function createDots() {	
                bullets = createHTMLElement('div', 'bullets-items');
                for(let i = 0; i < info.position.max + 1; i++) {
                    const dot = document.createElement("div");
                    dot.className = "bullets-items__bullet-item";
                    dot.addEventListener("click", function() {
                        updateInfo(i);
                    })

                    bullets.append(dot);		
                }

                sliderContent.append(bullets);
            };

            function createAutobutton() {
                autoButton = createHTMLElement('button', 'auto-button');
                autoButton.addEventListener("click", () => {
                    if(pause) {
                        slideItem();
                        pause = false;
                    } else {
                        intervalId = setInterval(function(){
                            if (info.position.current < info.position.max) {
                                info.update(info.position.current + 1);
                            } else {
                                info.reset();
                            }
                            slideItem();
                        }, info.intervalSpeed);
                        pause = true;
                    }
                });

                const span = document.createElement('span');
                span.textContent = 'Auto';
                autoButton.append(span);

                sliderContent.append(autoButton);
            };
        };

        function render() {
            const {prevButtonDisabled, nextButtonDisabled} = info;
            let controlsArray = [
                {element: leftArrow, className: "d-none", disabled: prevButtonDisabled},
                {element: rightArrow, className: "d-none", disabled: nextButtonDisabled}
            ];

            setClass(controlsArray);

            sliderContentWrapper.style.transform = `translateX(${info.offset*100}%)`;	

            if (info.dotsEnabled) {
                if (document.querySelector(".dot--active")) {
                    document.querySelector(".dot--active").classList.remove("dot--active");	
                }

                bullets.children[info.position.current].classList.add("dot--active");
            }
        };

        function createHTMLElement(tagName, className) {
            const element = document.createElement(tagName);
            className ? element.className = className : null;

            return element;
        };

        function updateInfo(value) {
            info.update(value);
            slideItem(true);	
        };

        function updateButtonDisabling() {
            const {current, min, max} = info.position;
            info.prevButtonDisabled = current > min ? false : true;
            info.nextButtonDisabled = current < max ? false : true;
        };

        function slideItem(autoMode = false) {
            if (autoMode && intervalId) {
                clearInterval(intervalId);
            }
            
            updateButtonDisabling();
            render();
        };

        function setClass(options) {
            if (options) {
                options.forEach(({element, className, disabled}) => {
                    if (element) {
                        disabled ? element.classList.add(className) : element.classList.remove(className)	
                    }
                })
            }
        };

        return {init};
    }());

    slider.init({
        intervalSpeed: 1000, // IntervalSpeed for auto switching
        currentItem: startItem, 
        bullets: true,
        arrows: true,
        autoBtn : false
    });
})

// Разобраться с последними 2 условиями валидации FIO-input (нерабочие)