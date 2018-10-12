
const getSolution = (num, solutionSize) => {
    let solution = [];
    console.log(`number: ${num} - solution size ${solutionSize}`);
    for (let i = 0; i < solutionSize - 1; i++) {
        let percentage;
        
        do {
            percentage = Math.random() * 100;
        }while (percentage > 85 || percentage < 5);

        solution[i] = Math.floor( percentage * num / 100 );
        num -= solution[i];
    }
    solution.push(num);
    console.log(`Solution: ${solution.toString()}`);
    return solution;
};

const getShadowSolutions = (num, solutionSize) => {
    let shadowNumber = num + 1 + Math.floor(Math.random() * 10 );
    return getSolution(shadowNumber, solutionSize);
}

const levelOneGame = () => {
    let problemNumber, solutionSize = 3;
    do{
        problemNumber = Math.floor(Math.random() * 10 * 5);
    }while ( problemNumber < 10 );
    let solution = getSolution(problemNumber, solutionSize);
    for (let i = 0; i < solutionSize - 1; i++) {
        solution = solution.concat(getShadowSolutions(problemNumber, solutionSize));
    }

    return { level: 1, problemNumber: problemNumber, solutionSize: solutionSize, solutionArray: solution, solution: solution.slice(0, solutionSize) }
};

const levelTwoGame = () => {
    let problemNumber, solutionSize = 4;
    do{
        problemNumber = Math.floor(Math.random() * 10 * 15);
    }while ( problemNumber <= 50 || problemNumber > 150);
    let solution = getSolution(problemNumber, solutionSize);
    for (let i = 0; i < solutionSize - 1; i++) {
        solution = solution.concat(getShadowSolutions(problemNumber, solutionSize));
    }

    return { level: 2, problemNumber: problemNumber, solutionSize: solutionSize, solutionArray: solution, solution: solution.slice(0, solutionSize) };
};

const levelThreeGame = () => {
    let problemNumber, solutionSize = 5;
    do{
        problemNumber = Math.floor(Math.random() * 10 * 20);
    }while ( problemNumber <= 150 || problemNumber > 200);
    let solution = getSolution(problemNumber, solutionSize);
    for (let i = 0; i < solutionSize - 1; i++) {
        solution = solution.concat(getShadowSolutions(problemNumber, solutionSize));
    }

    return { level: 3, problemNumber: problemNumber, solutionSize: solutionSize, solutionArray: solution, solution: solution.slice(0, solutionSize) };
};

module.exports = {
    levelOneGame: levelOneGame,
    levelTwoGame: levelTwoGame,
    levelThreeGame: levelThreeGame
}