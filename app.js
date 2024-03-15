const inputFieldsFirst = document.querySelectorAll("input");
const nextButton = document.querySelectorAll(".nextBtn");
const sections = document.querySelectorAll("section");
const planRadioInputs = document.querySelectorAll("input.plan__input");
const addonCheckboxInputs = document.querySelectorAll(".addon input");
const stepNavigatiors = document.querySelectorAll(".form__step h4:first-child");
const switchPlanSlider = document.querySelector(
  ".section__switch input#switch-rounded"
);
const billingCards = document.querySelectorAll(".billing__card .plan__details");
const addonDetails = document.querySelectorAll("li.addon span");
const finalRow1 = document.querySelectorAll(
  "section.step__4 .section__middle > div:first-child h4"
);
console.log(addonDetails);

// Debugging
// sections[0].style.display = "none";
// sections[1].style.display = "none";
// sections[2].style.display = "none";
// sections[3].style.display = "flex";

// const errorSpans = document.querySelectorAll(".errorSpan")

let activeSection = 0;

let validity = {
    stepOne: {
        name: false,
    email: false,
    phone: false,
},
stepTwo: {
    plan: false,
},
stepThree: {
    addon: {
        addon1: false,
        addon2: false,
        addon3: false,
    },
},
};

const fetchData = async () => {
  const data = await fetch("data.json");
  const res = await data.json();
  return await res;
};
// toggles error
const toggleError = (flag, element, errorText) => {
  if (flag === true) {
    element.textContent = errorText;
    element.hidden = false;
  } else {
    element.hidden = true;
  }
};

const updateNavigator = (nextPreviousSibling) => {
  stepNavigatiors[activeSection].style.backgroundColor = "white";
  stepNavigatiors[activeSection].style.color = "black";
  if (activeSection >= 0 && activeSection <= 5) {
    try {
      stepNavigatiors[nextPreviousSibling].style.backgroundColor =
        "transparent";
      stepNavigatiors[nextPreviousSibling].style.color = "white";
    } catch (error) {}
  }
};

updateNavigator();

const handleNextStep = () => {
  console.log(sections);
  sections[activeSection].style.display = "none";
  sections[activeSection + 1].style.display = "flex";
  activeSection += 1;
  updateNavigator(activeSection - 1);
};

const handleBackStep = () => {
  sections[activeSection].style.display = "none";
  sections[activeSection - 1].style.display = "flex";
  activeSection -= 1;
  updateNavigator(activeSection + 1);
};

const enableButton = () => {
  nextButton[activeSection].classList.add("enabled");
  nextButton[activeSection].classList.remove("disabled");
  nextButton[activeSection].disabled = false;
};

const disableButton = () => {
  nextButton[activeSection].disabled = true;
  nextButton[activeSection].classList.add("disabled");
  nextButton[activeSection].classList.remove("enabled");
};

const toggleButtonBehaviour = () => {
  switch (activeSection) {
    case 0:
      if (
        validity.stepOne.name &&
        validity.stepOne.email &&
        validity.stepOne.phone
      ) {
        enableButton();
      } else {
        disableButton();
      }
      break;
    case 1:
      if (validity.stepTwo.plan) {
        enableButton();
      } else {
        disableButton();
      }
      break;
    default:
      disableButton();
      break;
  }
};

// KeyUp evemts on input tag
inputFieldsFirst.forEach((input, index) => {
  input.addEventListener("keyup", (e) => {
    let errorSpan = e.target.parentElement.childNodes[1].childNodes[3];
    let targetValue = e.target.value;

    switch (index) {
      case 0:
        if (targetValue == "" || targetValue == null) {
          validity.stepOne.name = false;
          toggleError(true, errorSpan, "This field is required");
        } else {
          validity.stepOne.name = true;
          toggleError(false, errorSpan);
          sessionStorage.setItem("name", targetValue);
        }
        break;
      case 1:
        if (targetValue.includes("@") && targetValue.includes(".")) {
          validity.stepOne.email = true;
          toggleError(false, errorSpan);
          sessionStorage.setItem("email", targetValue);
        } else {
          validity.stepOne.email = false;
          toggleError(true, errorSpan, "This field is required");
        }
        break;
      case 2:
        if (targetValue.length == 0) {
          validity.stepOne.phone = false;
          toggleError(true, errorSpan, "This field is required");
        } else if (targetValue.length < 10) {
          validity.stepOne.phone = false;
          toggleError(true, errorSpan, "At least 10 numbers");
        } else {
          validity.stepOne.phone = true;
          toggleError(false, errorSpan);
          sessionStorage.setItem("phone", targetValue);
        }
        break;
      default:
        break;
    }

    toggleButtonBehaviour();
  });
});

planRadioInputs.forEach((plan, index) => {
  plan.addEventListener("change", () => {
    validity.stepTwo.plan = true;
    toggleButtonBehaviour();
    console.log(plan.id);
    sessionStorage.setItem("planId", plan.id);
    console.log(plan.parentElement.querySelector(".plan__details"));
  });
});

switchPlanSlider.addEventListener("change", async () => {
  const data = await fetchData(); // Assuming fetchData() retrieves the data
  const planType = switchPlanSlider.checked ? "yearly" : "monthly"; // Determine plan type
  const billingFrequency = switchPlanSlider.checked ? "yr" : "mo"; // Set billing frequency
  sessionStorage.setItem("planType", planType);

  billingCards.forEach((card, index) => {
    const price = card.querySelector("p");

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
  addonDetails.forEach((span, index) => {
    switch (index) {
      case 0:
        span.textContent = `$${data.addons[planType].addon1.price}/${billingFrequency}`;
        break;
      case 1:
        span.textContent = `$${data.addons[planType].addon2.price}/${billingFrequency}`;
        break;
      case 2:
        span.textContent = `$${data.addons[planType].addon3.price}/${billingFrequency}`;
        break;
      default:
        break;
    }
  })
});

addonCheckboxInputs.forEach((addon, index) => {
  addon.addEventListener("change", () => {
    switch (index) {
      case 0:
        validity.stepThree.addon.addon1 = addon.checked;
        break;
      case 1:
        validity.stepThree.addon.addon2 = addon.checked;
        break;
      case 2:
        validity.stepThree.addon.addon3 = addon.checked;
        break;
      default:
        break;
    }
  });
});
