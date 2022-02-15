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
          startItem = document.querySelector('.startItem').value;

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
        autoBtn : true
    });
})

// Разобраться с последними 2 условиями валидации FIO-input (нерабочие)