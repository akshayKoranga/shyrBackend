
const getSolution = (problemNumber, solutionSize) => {
    let solution = [];
    //console.log(`number: ${problemNumber} - solution size ${solutionSize}`);
    for (let i = 0; i < solutionSize - 1; i++) {
        let percentage;
        if(solutionSize = 4){
            var upto = (i+1)*28
        } else if(solutionSize = 4) {
            var upto = (i+1)*22
        } else {
            var upto = (i+1)*17
        }
        // console.log(upto);process.exit()
        do {
            percentage = Math.random() * 100;
        }while (percentage > upto || percentage < i+3);

        solution[i] = Math.floor( percentage * problemNumber / 100 );
        //console.log(problemNumber,percentage, solution[i]);
        problemNumber -= solution[i];
        //console.log(problemNumber,solution[i]);//process.exit()
    }
    solution.push(problemNumber);
    
   //console.log(`Solution: ${solution.toString()}`);
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
        //console.log(problemNumber,'oooooo')
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
