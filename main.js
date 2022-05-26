const carCanvas = document.querySelector('#carCanvas');
carCanvas.width = 200;
const networkCanvas = document.querySelector('#networkCanvas');
networkCanvas.width = 400;

const carCtx = carCanvas.getContext('2d');
const networkCtx = networkCanvas.getContext('2d');
console.log(networkCtx);

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);

const N = 300;
const cars = generateCars(N);
let bestCar = cars[0];
if (localStorage.getItem('bestBrain')) {
    for (let i = 0; i < cars.length; i++) {
        cars[i].brain = JSON.parse(localStorage.getItem('bestBrain'));
        if (i !== 0) {
            NeuralNetwork.mutate(cars[i].brain, 0.15);
        }
    }
}

const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, 'DUMMY', 2),
    new Car(road.getLaneCenter(0), -300, 30, 50, 'DUMMY', 2),
    new Car(road.getLaneCenter(2), -300, 30, 50, 'DUMMY', 2),
    new Car(road.getLaneCenter(0), -500, 30, 50, 'DUMMY', 2),
    new Car(road.getLaneCenter(1), -500, 30, 50, 'DUMMY', 2),
    new Car(road.getLaneCenter(2), -700, 30, 50, 'DUMMY', 2),
    new Car(road.getLaneCenter(0), -700, 30, 50, 'DUMMY', 2),
    new Car(road.getLaneCenter(1), -900, 30, 50, 'DUMMY', 2),
    new Car(road.getLaneCenter(2), -1100, 30, 50, 'DUMMY', 2),
    new Car(road.getLaneCenter(1), -1300, 30, 50, 'DUMMY', 2),
    new Car(road.getLaneCenter(2), -1300, 30, 50, 'DUMMY', 2),
    new Car(road.getLaneCenter(0), -1500, 30, 50, 'DUMMY', 2),
    new Car(road.getLaneCenter(1), -1500, 30, 50, 'DUMMY', 2),
    new Car(road.getLaneCenter(2), -1700, 30, 50, 'DUMMY', 2),
    new Car(road.getLaneCenter(1), -1900, 30, 50, 'DUMMY', 2),
    new Car(road.getLaneCenter(2), -1900, 30, 50, 'DUMMY', 2),
    new Car(road.getLaneCenter(1), -2200, 30, 50, 'DUMMY', 2),
    new Car(road.getLaneCenter(0), -2200, 30, 50, 'DUMMY', 2),
    new Car(road.getLaneCenter(2), -2350, 30, 50, 'DUMMY', 2),
    new Car(road.getLaneCenter(0), -2570, 30, 50, 'DUMMY', 2),
    new Car(road.getLaneCenter(1), -2740, 30, 50, 'DUMMY', 2),
    new Car(road.getLaneCenter(2), -2740, 30, 50, 'DUMMY', 2),
    new Car(road.getLaneCenter(1), -2950, 30, 50, 'DUMMY', 2),
    new Car(road.getLaneCenter(0), -3090, 30, 50, 'DUMMY', 2),
    new Car(road.getLaneCenter(2), -3090, 30, 50, 'DUMMY', 2),
];

animate();

function save() {
    localStorage.setItem('bestBrain', JSON.stringify(bestCar.brain));
}

function discard() {
    localStorage.removeItem('bestBrain');
}

function generateCars(N) {
    const cars = [];
    for (let i = 1; i < N; i++) {
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, 'AI'));
    }
    return cars;
}

function animate(time) {
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders, []);
    }
    for (let i = 0; i < cars.length; i++) {
        cars[i].update(road.borders, traffic);
    }

    bestCar = cars.find((c) => c.y === Math.min(...cars.map((c) => c.y)));

    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    carCtx.save();
    carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);

    road.draw(carCtx);

    for (let i = 0; i < traffic.length; i++) {
        traffic[i].draw(carCtx, 'red');
    }

    carCtx.globalAlpha = 0.2;

    for (let i = 0; i < cars.length; i++) {
        cars[i].draw(carCtx, 'blue');
    }

    carCtx.globalAlpha = 1;
    bestCar.draw(carCtx, 'blue', true);

    carCtx.restore();

    networkCtx.lineDashOffset = -time / 60;
    Visualizer.drawNetwork(networkCtx, bestCar.brain);
    requestAnimationFrame(animate);
}
