const context = {
    target: null,
    population: null,
    tolerance: null,
    mutationRate: null,
    summationIndexes: null,
    bestFitness: null
}

const randomInteger = n => Math.floor(Math.random() * n);

const sorter = (a, b) => {
    const f1 = fitness(a);
    const f2 = fitness(b);

    return f1 > f2 ? 1 : (f2 > f1 ? -1 : 0);
}

const pickIndexForCrossOver = () => {
    const r = 1 + randomInteger(context.summationIndexes);

    return Math.floor(-0.5 + Math.sqrt(0.25 - 2.0 * -r)) - 1;
}

const emptyImage = () => {
    return  {
        width: context.target.width,
        height: context.target.height,
        pixels: []
    };
}

const fitness = ({pixels}) => {
    let matchCount = 0;

    for (let i = 0; i < context.target.pixels.length; i++) {
        if (Math.abs(context.target.pixels[i] - pixels[i]) <= context.tolerance) {
            matchCount++;
        }
    }

    return matchCount / context.target.pixels.length;
}

const crossOver = (parent1, parent2) => {
    const child = emptyImage();

    for (let i = 0; i < context.target.pixels.length; i++) {
        if (Math.random() < context.mutationRate) {
            child.pixels.push(randomInteger(256));
        } else if (Math.random() < 0.5) {
            child.pixels.push(parent1.pixels[i]);
        } else {
            child.pixels.push(parent2.pixels[i]);
        }
    }

    return child;
}

const evolve = () => {
    const newPopulation = [];

    for (let i = 0; i < context.population.length; i++) {
        const index1 = pickIndexForCrossOver();
        let index2 = pickIndexForCrossOver();

        while (index1 === index2) {
            index2 = pickIndexForCrossOver();
        }

        const child = crossOver(context.population[index1], context.population[index2]);

        newPopulation.push(child);
    }

    context.population = newPopulation.sort(sorter);
    context.bestFitness = fitness(context.population[context.population.length - 1]);
}

const initializePopulation = count => {
    const population = [];

    for (let i = 0; i < count; i++) {
        const image = emptyImage();

        for (let j = 0; j < context.target.pixels.length; j++) {
            image.pixels.push(randomInteger(256));
        }

        population.push(image);
    }

    context.population = population.sort(sorter);
    context.bestFitness = context.population[context.population.length - 1];
}
