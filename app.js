const inputFieldsFirst = document.querySelectorAll("input")
const nextButton = document.querySelectorAll(".nextBtn")
const sections = document.querySelectorAll("section")
const planRadioInputs = document.querySelectorAll("input.plan__input")
const addonCheckboxInputs = document.querySelectorAll(".addon input")
const stepNavigatiors = document.querySelectorAll(".form__step h4:first-child")
const switchPlanSlider = document.querySelector(".section__switch input#switch-rounded")
const billingCards = document.querySelectorAll(".billing__card .plan__details")

const fetchData = async () => {
    const data = await fetch('./data.json')
    const res = await data.json()
    return await res
}

// Debugging
// sections[0].style.display = "none"
// sections[1].style.display = "flex"
// sections[2].style.display = "none"
// sections[3].style.display = "none"

// const errorSpans = document.querySelectorAll(".errorSpan")

let activeSection = 0

let validity = {
    stepOne: {
        name: false,
        email: false,
        phone: false
    },
    stepTwo: {
        plan: false
    },
    stepThree: {
        addon: true
    }
}

// toggles error 
const toggleError = (flag, element, errorText) => {
    if (flag === true) {
        element.textContent = errorText
        element.hidden = false
    } else {
        element.hidden = true
    }
}

const updateNavigator = (nextPreviousSibling) => {
    stepNavigatiors[activeSection].style.backgroundColor = 'white'
    stepNavigatiors[activeSection].style.color = 'black'
    if (activeSection >= 0 && activeSection <= 5) {
        try {
            stepNavigatiors[nextPreviousSibling].style.backgroundColor = 'transparent'
            stepNavigatiors[nextPreviousSibling].style.color = 'white'
        }

        catch (error) { }
    }
}

updateNavigator()

const handleNextStep = () => {
    console.log(sections)
    sections[activeSection].style.display = "none"
    sections[activeSection + 1].style.display = "flex"
    activeSection += 1
    updateNavigator(activeSection - 1)
}

const handleBackStep = () => {
    sections[activeSection].style.display = "none"
    sections[activeSection - 1].style.display = "flex"
    activeSection -= 1
    updateNavigator(activeSection + 1)
}

const enableButton = () => {
    nextButton[activeSection].classList.add("enabled")
    nextButton[activeSection].classList.remove("disabled")
    nextButton[activeSection].disabled = false
}

const disableButton = () => {
    nextButton[activeSection].disabled = true
    nextButton[activeSection].classList.add("disabled")
    nextButton[activeSection].classList.remove("enabled")
}

const toggleButtonBehaviour = () => {
    if (activeSection === 0) {
        if (validity.stepOne.name === true && validity.stepOne.email === true && validity.stepOne.phone === true) {
            enableButton()
        } else {
            disableButton()
        }
    }

    if (activeSection === 1) {
        if (validity.stepTwo.plan === true) {
            enableButton()
        }
        else {
            disableButton()
        }
    }
}

// KeyUp evemts on input tag
inputFieldsFirst.forEach((input, index) => {
    input.addEventListener("keyup", (e) => {
        let errorSpan = e.target.parentElement.childNodes[1].childNodes[3]
        let targetValue = e.target.value

        if (index === 0) {
            if (targetValue == "" || null) {
                validity.stepOne.name = false
                toggleError(true, errorSpan, "This field is required")
            }
            else {
                validity.stepOne.name = true
                toggleError(false, errorSpan)
                sessionStorage.setItem("name", targetValue)
            }
        }

        if (index === 1) {
            if (targetValue.includes('@') && targetValue.includes('.')) {
                validity.stepOne.email = true
                toggleError(false, errorSpan)
                sessionStorage.setItem("email", targetValue)
            }
            else {
                validity.stepOne.email = false
                toggleError(true, errorSpan, "This field is required")
            }
        }

        if (index === 2) {
            if (targetValue.length == 0) {
                validity.stepOne.phone = false
                toggleError(true, errorSpan, "This field is required")
            }
            else if (targetValue.length < 10) {
                validity.stepOne.phone = false
                toggleError(true, errorSpan, "Atleast 10 numbers")
            }
            else {
                validity.stepOne.phone = true
                toggleError(false, errorSpan)
                sessionStorage.setItem("phone", targetValue)
            }
        }

        toggleButtonBehaviour()
    })
})

planRadioInputs.forEach((plan, index) => {
    plan.addEventListener("change", () => {
        validity.stepTwo.plan = true
        toggleButtonBehaviour()
        console.log(plan.id)
        sessionStorage.setItem("planId", plan.id )
        console.log(plan.parentElement.querySelector(".plan__details"))
    })
})

switchPlanSlider.addEventListener("change", async () => {
    const data = await fetchData(); // Assuming fetchData() retrieves the data
    const planType = switchPlanSlider.checked ? 'yearly' : 'monthly'; // Determine plan type

    billingCards.forEach((card, index) => {
        const price = card.querySelector('p');
        const billingFrequency = switchPlanSlider.checked ? 'yr' : 'mo'; // Set billing frequency

        switch (index) {
            case 0:
                price.textContent = `$${data.plan[planType].arcade.price}/${billingFrequency}`;
                break;
            case 1:
                price.textContent = `$${data.plan[planType].advanced.price}/${billingFrequency}`;
                break;
            case 2:
                price.textContent = `$${data.plan[planType].pro.price}/${billingFrequency}`;
                break;
            default:
                break;
        }
    });
});


