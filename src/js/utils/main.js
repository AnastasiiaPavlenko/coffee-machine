import { LEMON_TEA, COFFEE, HOT_CHOCOLATE } from './constants';

const refs = {
    buttons: document.querySelectorAll(".main-machine--btn"),
    powerButton: document.querySelector(".main-machine--power"),
    popupOnHover: document.querySelector(".main-machine--popup")
};

let state = {
    isPowerOn: false,
};

const onMouseOver = () => {
    const chosenDrink = event.currentTarget.getAttribute("data-drink");
    refs.popupOnHover.style.display = "flex";
    const content = document.createTextNode(`Press me to order ${chosenDrink}`);
    refs.popupOnHover.appendChild(content);
};

const onMouseOut = () => {
    refs.popupOnHover.style.display = "none";
    refs.popupOnHover.firstChild.remove();
};

const handleDrinkButton = () => {

};

const handlePowerButton = () => {
    state.isPowerOn !== true
        ? (state.isPowerOn = true,
            event.currentTarget.style.backgroundColor = "green")
        : (state.isPowerOn = false,
            event.currentTarget.style.backgroundColor = "red")
    console.log(event.currentTarget);
};

refs.buttons.forEach(button => {
    button.addEventListener("mouseover", onMouseOver);
});
refs.buttons.forEach(button => {
    button.addEventListener("mouseout", onMouseOut);
});
refs.powerButton.addEventListener("click", handlePowerButton);
