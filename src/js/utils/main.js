import { RECIPES } from './constants';
const regeneratorRuntime = require("regenerator-runtime");
import emptyGlass from '../../images/empty-glass.png';
import lemonTea from '../../images/tea.png';
import coffee from '../../images/coffee.png';
import chocolate from '../../images/chocolate.png';

const refs = {
    machine: document.querySelector(".main-machine"),
    buttons: document.querySelectorAll(".main-machine--btn"),
    powerButton: document.querySelector(".main-machine--power"),
    popupOnHover: document.querySelector(".main-machine--popup"),
    alertPopup: document.querySelector(".main-machine--alert"),
    recipeBlock: document.querySelector(".main-recipe")
};

const pngRoutes = {
    "Empty glass": emptyGlass,
    "Lemon Tea": lemonTea,
    "Coffee": coffee,
    "Hot Chocolate": chocolate
};

let state = {
    isPowerOn: false,
    isDrinkInProcess: false
};

const onMouseOver = () => {
    const { popupOnHover } = refs;
    const chosenDrink = event.currentTarget.getAttribute("data-drink");
    popupOnHover.style.display = "flex";
    const content = document.createTextNode(`Press me to order ${chosenDrink}`);
    popupOnHover.appendChild(content);
};

const onMouseOut = () => {
    const { popupOnHover } = refs;
    popupOnHover.style.display = "none";
    popupOnHover.firstChild.remove();
};

const handleDrinkButton = () => {
    const { alertPopup, machine, recipeBlock } = refs;
    const chosenDrink = event.currentTarget.getAttribute("data-drink");
    const drinkId = event.currentTarget.getAttribute("id");
    const powerButtonAlert = document.createTextNode("Oops.. seems like you forgot to switch on the Coffee Machine! Press the red button =>");
    const drinkInProcessAlert = document.createTextNode("Please wait, your drink is being made. You can order another one right after!");
    const drinkMessage = document.createTextNode(`While you are waiting for your delicious drink here is a ${chosenDrink} recipe: `);
    const hidePopup = () => {
        alertPopup.style.display = "none";
        alertPopup.firstChild.remove();
    };
    if (state.isDrinkInProcess == true) {
        alertPopup.appendChild(drinkInProcessAlert);
        alertPopup.style.display = "flex";
        setTimeout(hidePopup, 5000);
    } else if (state.isPowerOn !== true) {
        alertPopup.appendChild(powerButtonAlert);
        alertPopup.style.display = "flex";
        setTimeout(hidePopup, 5000);
    } else {
        state.isDrinkInProcess = true;
        const drinkPng = document.createElement("img");
        drinkPng.setAttribute("class", "main-machine--drinkImg");
        drinkPng.setAttribute("src", pngRoutes["Empty glass"]);
        machine.appendChild(drinkPng);
        recipeBlock.style.display = "flex";
        recipeBlock.appendChild(drinkMessage);
        const showRecipeContent = () => {
            for (const drink in RECIPES) {
                if (drink === drinkId) {
                    for (let i = 0; i < RECIPES[drink].length; i++) {
                        let recipeStep = document.createElement("div");
                        recipeStep.setAttribute("class", "main-recipe--step");
                        recipeStep.innerHTML += (i + 1) + ". " + RECIPES[drink][i];
                        setTimeout(() => recipeBlock.appendChild(recipeStep), i * 2000);
                    }
                }
            }
            setTimeout(() => addDrinkPicture(), 7000);
        };
        showRecipeContent();

        const addDrinkPicture = () => {
            const { machine } = refs;
            for (const key in pngRoutes) {
                if (key == chosenDrink) {
                    drinkPng.setAttribute("src", pngRoutes[key]);
                    machine.appendChild(drinkPng);
                }
            }
            recipeBlock.innerHTML = "Your drink is ready! Click on it to drink it! :)";
            document.querySelector(".main-machine--drinkImg").addEventListener("click", handleDrinkClick);
        };
    }
};
const handleDrinkClick = () => {
    const { machine, recipeBlock } = refs;
    machine.removeChild(event.currentTarget);
    recipeBlock.innerHTML = 'Hope you enjoyed this virtual Coffee Station! Feel free to order another drink and see you in a bit!';
    setTimeout(() => hideRecipeBlock(), 4000);
    state.isDrinkInProcess = false;
};
const hideRecipeBlock = () => {
    const { recipeBlock } = refs;
    recipeBlock.innerHTML = "";
    recipeBlock.style.display = "none";
};
const handlePowerButton = () => {
    state.isPowerOn !== true
        ? (state.isPowerOn = true,
            event.currentTarget.style.backgroundColor = "green")
        : (state.isPowerOn = false,
            event.currentTarget.style.backgroundColor = "red");
};

refs.buttons.forEach(button => {
    button.addEventListener("mouseover", onMouseOver);
});
refs.buttons.forEach(button => {
    button.addEventListener("mouseout", onMouseOut);
});
refs.buttons.forEach(button => {
    button.addEventListener("click", handleDrinkButton);
});
refs.powerButton.addEventListener("click", handlePowerButton);
