const inputFieldsFirst = document.querySelectorAll("input")

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
    console.log("Hello world!")
}

// KeyUp evemts on input tag
inputFieldsFirst.forEach((input, index) => {
    input.addEventListener("keyup", (e) => {
        let errorSpan = e.target.parentElement.childNodes[1].childNodes[3]
        let targetValue = e.target.value
        if (index === 0) {
            if (targetValue == "" || null) toggleError(true, errorSpan, "This field is required")
            else toggleError(false, errorSpan)
        }

        if (index === 1) {
            if (targetValue.includes('@') && targetValue.includes('.')) toggleError(false, errorSpan)
            else toggleError(true, errorSpan, "This field is required")
        }

        if (index === 2) {
            if (targetValue.length == 0) {
                toggleError(true, errorSpan, "This field is required")
            }
            else if (targetValue.length < 10) {
                toggleError(true, errorSpan, "Atleast 10 numbers")
            }
            else toggleError(false, errorSpan)
        }
    })
})