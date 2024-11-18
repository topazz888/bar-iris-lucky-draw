
const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');

const prizes = [
    "Classic & Signature Cocktail",
    "1 Whiskey Shot",
    "1 Tequila Shot",
    "OnlyFun (Shooter)",
    "Good Girls Swallow (Shooter)",
    "Money Shot (Shooter)",
    "Take It All In (Shooter)",
    "You did great this year, but Santa still not chose you :(",
    "Almost there! Maybe next time luck will be on your side. Cheers!",
    "Good vibes only! You’re still a winner in our eyes. 🥂"
];

const prizeColors = [
    "#FF6347", "#FFD700", "#90EE90", "#20B2AA", 
    "#9370DB", "#FF69B4", "#4682B4", "#A9A9A9", 
    "#A9A9A9", "#A9A9A9"
];

// 70% chance to win a drink, 30% chance to get a consolation message
const probabilityWeights = [
    7, 7, 7, 7, 7, 7, 7, 3, 3, 3
];

let startAngle = 0;
let spinTimeout = null;

// Calculate total weight
const totalWeight = probabilityWeights.reduce((a, b) => a + b, 0);

// Draw the wheel
function drawWheel() {
    const arc = Math.PI * 2 / prizes.length;
    for (let i = 0; i < prizes.length; i++) {
        const angle = startAngle + i * arc;
        ctx.fillStyle = prizeColors[i % prizeColors.length];
        ctx.beginPath();
        ctx.moveTo(250, 250);
        ctx.arc(250, 250, 250, angle, angle + arc, false);
        ctx.lineTo(250, 250);
        ctx.fill();

        ctx.save();
        ctx.fillStyle = "white";
        ctx.translate(
            250 + Math.cos(angle + arc / 2) * 150,
            250 + Math.sin(angle + arc / 2) * 150
        );
        ctx.rotate(angle + arc / 2);
        ctx.fillText(prizes[i], -30, 10);
        ctx.restore();
    }
}

// Weighted random selection
function getRandomPrize() {
    const random = Math.random() * totalWeight;
    let cumulativeWeight = 0;
    for (let i = 0; i < probabilityWeights.length; i++) {
        cumulativeWeight += probabilityWeights[i];
        if (random < cumulativeWeight) {
            return i;
        }
    }
    return prizes.length - 1; // fallback to the last item
}

// Spin the wheel
function spinWheel() {
    const prizeIndex = getRandomPrize();
    let spinAngleStart = Math.random() * 10 + 10;
    let spinTime = 0;
    const spinTimeTotal = Math.random() * 3000 + 4000;

    function rotateWheel() {
        spinTime += 30;
        if (spinTime >= spinTimeTotal) {
            clearTimeout(spinTimeout);
            const result = prizes[prizeIndex];
            document.getElementById('result').textContent = `Congratulations! You got: ${result}`;
            return;
        }
        const spinAngle = spinAngleStart - (spinTime / spinTimeTotal) * spinAngleStart;
        startAngle += (spinAngle * Math.PI) / 180;
        drawWheel();
        spinTimeout = setTimeout(rotateWheel, 30);
    }
    rotateWheel();
}

document.getElementById('spinButton').addEventListener('click', spinWheel);
drawWheel();
