const get = id => document.getElementById(id);

const num = id => {
    const value = parseFloat(get(id).value);

    if (!Number.isFinite(value)) {
        console.error(`"${id}" is not a number`);
    }

    return value;
}

get('target').addEventListener('change', () => {
    if (get('target').files.length === 0) {
        console.log('no image');

        return;
    }

    const image = new Image();

    image.addEventListener('load', () => {
        const { width, height } = image;

        get('canvas-evolution').width = width;
        get('canvas-evolution').height = height;

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(image, 0, 0, width, height);

        const pixels = [];
        const imgData = canvas.getContext('2d').getImageData(0, 0, width, height).data;

        for (let i = 0, n = imgData.length; i < n; i += 4) {
            const r = imgData[i + 0];
            const g = imgData[i + 1];
            const b = imgData[i + 2];

            pixels.push(Math.floor((r+g+b) / 3));
        }

        context.target = { height, width, pixels };

        console.log('done')
    });

    image.src = URL.createObjectURL(get('target').files[0]);
})

get('button-evolve').addEventListener('click', e => {
    e.preventDefault();

    const populationSize = num('population-size');

    initializePopulation(populationSize);

    context.summationIndexes = (Math.pow(context.population.length, 2) + context.population.length) / 2;

    context.tolerance = num('pixel-tolerance');

    context.mutationRate = num('mutation-rate');

    const evolution = () => {
        evolve();
        const bestIndividual = context.population[context.population.length - 1];
        draw(bestIndividual);
        get('best-fitness').textContent = (bestIndividual.lastFitness * 100).toFixed(2);

        if (bestIndividual.lastFitness < 0.99) {
            setTimeout(evolution, 0);
        }
    }

    for (const ele of document.querySelectorAll('#area-inputs input')) {
        ele.disabled = true;
    }

    evolution();
});

const draw = image => {
    const ctx = get('canvas-evolution').getContext('2d');
    const imgData = ctx.getImageData(0, 0, image.width, image.height);

    for (let i = 0, j = 0; i < image.pixels.length; i++, j += 4) {
        imgData.data[j + 0] = image.pixels[i];
        imgData.data[j + 1] = image.pixels[i];
        imgData.data[j + 2] = image.pixels[i];
        imgData.data[j + 3] = 255;
    }

    ctx.putImageData(imgData, 0, 0);
}