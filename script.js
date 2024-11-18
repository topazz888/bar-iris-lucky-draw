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

const probabilityWeights = [7, 7, 7, 7, 7, 7, 7, 3, 3, 3];

let startAngle = 0;
let spinTimeout = null;

// Adjust font size and align text
function drawText(ctx, text, centerX, centerY, angle, radius) {
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(angle);
    ctx.font = "bold 26px Arial"; // Adjust font size here
    ctx.textAlign = "left";
    ctx.fillStyle = "black";

    const words = text.split(' ');
    let line = '';
    let yOffset = -radius + 30; // Start drawing text slightly away from the center

    words.forEach((word, index) => {
        let testLine = line + word + ' ';
        let metrics = ctx.measureText(testLine);
        let testWidth = metrics.width;
        if (testWidth > 150) { // Adjust maximum text width
            ctx.fillText(line, 0, yOffset);
            line = word + ' ';
            yOffset += 20; // Line height
        } else {
            line = testLine;
        }
        if (index === words.length - 1) {
            ctx.fillText(line, 0, yOffset);
        }
    });

    ctx.restore();
}

// Draw the wheel
function drawWheel() {
    const arc = Math.PI * 2 / prizes.length;
    for (let i = 0; i < prizes.length; i++) {
        const angle = startAngle + i * arc;

        // Draw section
        ctx.fillStyle = prizeColors[i % prizeColors.length];
        ctx.beginPath();
        ctx.moveTo(250, 250);
        ctx.arc(250, 250, 250, angle, angle + arc, false);
        ctx.lineTo(250, 250);
        ctx.fill();

        // Draw text
        drawText(ctx, prizes[i], 250, 250, angle + arc / 2, 200);
    }
}

// Weighted random selection
function getRandomPrize() {
    const totalWeight = probabilityWeights.reduce((a, b) => a + b, 0);
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
