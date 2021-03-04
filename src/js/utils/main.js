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
    powerModal: document.querySelector("#modal-power"),
    closeBtn: document.querySelectorAll('.close'),
    instructionsModal: document.querySelector('#modal-instructions'),
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

const handleDrinkButton = () => {
    const { alertPopup, machine, recipeBlock, powerModal, instructionsModal } = refs;
    const chosenDrink = event.currentTarget.getAttribute("data-drink");
    const drinkId = event.currentTarget.getAttribute("id");
    const drinkInProcessAlert = document.createTextNode("Please take your current drink first. You can order another one right after!");
    const drinkMessage = document.createTextNode(`While you are waiting for your delicious drink here is a ${chosenDrink} recipe: `);
    const hidePopup = () => {
        alertPopup.style.display = "none";
        alertPopup.firstChild.remove();
    };
    if (state.isDrinkInProcess == true) {
        if (alertPopup.hasChildNodes()) {
            alertPopup.firstChild.remove();
            alertPopup.appendChild(drinkInProcessAlert);
        } else {
            alertPopup.appendChild(drinkInProcessAlert);
        }
        alertPopup.style.display = "flex";
        setTimeout(hidePopup, 5000);
    } else if (state.isPowerOn !== true) {
        powerModal.style.display = "block";
    } else {
        state.isDrinkInProcess = true;
        const drinkPng = document.createElement("img");
        drinkPng.setAttribute("class", "main-machine--drinkImg");
        drinkPng.setAttribute("src", pngRoutes["Empty glass"]);
        machine.appendChild(drinkPng);
        recipeBlock.style.display = "flex";
        recipeBlock.appendChild(drinkMessage);
        instructionsModal.style.display = "block";

        const showRecipeContent = async () => {
            const delay = async (delay) => new Promise(next => setTimeout(next, delay));
            const chain = async (a, ..._) => {
                if (!(a instanceof Function)) return;
                await a();
                console.log(a);
                return chain(..._);
            };
            const todo = [];
            for (const drink in RECIPES) {
                if (drink === drinkId) {
                    for (let i = 0; i < RECIPES[drink].length; i++) {
                        let recipeStep = document.createElement("div");
                        recipeStep.setAttribute("class", "main-recipe--step");
                        recipeStep.innerHTML += (i + 1) + ". " + RECIPES[drink][i];
                        todo.push(async () => {
                            await delay(2000);
                            recipeBlock.appendChild(recipeStep);
                        });
                    }
                }
            }
            todo.push(async () => {
                await delay(2000);
                addDrinkPicture();
            });
            return chain(...todo);
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
            document.querySelector(".close-instructions").style.display = "block";
            document.querySelector(".main-machine--drinkImg").addEventListener("click", handleDrinkClick);
        };
    }
};
const closeModal = () => {
    const { powerModal, instructionsModal } = refs;
    powerModal.style.display = "none";
    instructionsModal.style.display = "none";
};
const handleDrinkClick = () => {
    const { machine, recipeBlock } = refs;
    machine.removeChild(event.currentTarget);
    recipeBlock.innerHTML = "";
    document.querySelector(".close-instructions").style.display = "none";
    state.isDrinkInProcess = false;
};

const handlePowerButton = () => {
    state.isPowerOn !== true
        ? (state.isPowerOn = true,
            event.currentTarget.style.backgroundColor = "green")
        : (state.isPowerOn = false,
            event.currentTarget.style.backgroundColor = "red");
};

refs.closeBtn.forEach(button => {
    button.addEventListener("click", closeModal);
});
refs.buttons.forEach(button => {
    button.addEventListener("click", handleDrinkButton);
});
refs.powerButton.addEventListener("click", handlePowerButton);

window.onclick = function (event) {
    if (event.target == refs.powerModal) {
        refs.powerModal.style.display = "none";
    }
}