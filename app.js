const inputFieldsFirst = document.querySelectorAll("input")
const nextButton = document.querySelector(".nextBtn")
const sections = document.querySelectorAll("section")

// const errorSpans = document.querySelectorAll(".errorSpan")

let activeSection = 0

let validity = {
    stepOne: {
        name: false,
        email: false,
        phone: false
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

const handleNextStep = () => {
    console.log(sections)
    sections[activeSection].style.display = "none"
    sections[activeSection + 1].style.display = "flex"
    activeSection += 1
}

const handleBackStep = () => {
    sections[activeSection].style.display = "none"
    sections[activeSection - 1].style.display = "flex"
    activeSection -= 1
}

const enableButton = () => {
    nextButton.classList.add("enabled")
    nextButton.classList.remove("disabled")
    nextButton.disabled = false
}

const disableButton = () => {
    nextButton.disabled = true
    nextButton.classList.add("disabled")
    nextButton.classList.remove("enabled")
}

const toggleButtonBehaviour = () => {
    if (validity.stepOne.name === true && validity.stepOne.email === true && validity.stepOne.phone === true) {
        enableButton()
    } else {
        disableButton()
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
            }
        }

        if (index === 1) {
            if (targetValue.includes('@') && targetValue.includes('.')) {
                validity.stepOne.email = true
                toggleError(false, errorSpan)
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
            }
        }

        toggleButtonBehaviour()
    })
})

