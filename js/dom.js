const get = document.getElementById.bind(document)

get('input-image').addEventListener('change', () => {
    if (get('input-image').files.length === 0) {
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
        initializePopulation(80);
        context.summationIndexes = (Math.pow(context.population.length, 2) + context.population.length) / 2;

        console.log('done')
    });

    image.src = URL.createObjectURL(get('input-image').files[0]);
})

get('button-evolve').addEventListener('click', () => {
    const cb = () => {
        evolve();
        draw(context.population[context.population.length - 1]);
        get('best-fitness').textContent = (context.bestFitness * 100).toFixed(2);

        if (context.bestFitness < 0.95) {
            setTimeout(cb, 0);
        } else {
            get('button-evolve').disabled = false;
        }
    }

    get('button-evolve').disabled = true;

    cb();
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