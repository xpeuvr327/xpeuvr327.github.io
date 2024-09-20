let money = 0;
let increment = 1;
let upgradePrice = 10;

function incrementMoney() {
    money += increment;
    document.getElementById('money').innerText = money;
}

function upgrade() {
    if (money >= upgradePrice) {
        money -= upgradePrice;
        increment++;
        upgradePrice = Math.round(upgradePrice * 1.1);
        document.getElementById('money').innerText = money;
        document.getElementById('increment').innerText = increment;
        document.getElementById('upgradePrice').innerText = upgradePrice;
    }
}

