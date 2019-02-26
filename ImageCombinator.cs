using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;

namespace ImageCombinator
{
    public class ImageCombinator
    {
        private readonly IEnumerable<GrayImage> _targets;
        private List<GrayImage> _population;
        private readonly double _mutationRate;

        private readonly Random _random = new Random();
        private readonly Size _imageSize;
        private readonly int _summationIndexes;

        public ImageCombinator(IEnumerable<GrayImage> targets, int populationSize, double mutationRate)
        {
            _imageSize = targets.First().Size;

            if (targets.Any(x => x.Size != _imageSize))
            {
                throw new ArgumentException("All targets must have same size");
            }

            _targets = targets;
            _mutationRate = mutationRate;
            _population = new List<GrayImage>(populationSize);
            _summationIndexes = populationSize*(populationSize / 2) + (populationSize / 2);

            for (var i = 0; i < populationSize; i++)
            {
                var image = new GrayImage(_imageSize, ImageInitializationType.Random);

                _population.Add(image);
            }

            _population.Sort(Comparator);
        }

        public GrayImage Evolve(double acceptableFitness, int maxIterations)
        {
            GrayImage bestIndividual = null;

            Console.WriteLine();

            for (var i = 0; i < maxIterations; i++)
            {
                bestIndividual = _population[_population.Count - 1];

                var bestFitness = Fitness(bestIndividual);

                if (i % 100 == 0 || i == 0)
                {
                    Console.WriteLine(string.Format("{0:0.##}%", bestFitness*100));
                }

                if (bestFitness >= acceptableFitness)
                {
                    break;
                }

                Advance();
            }

            return bestIndividual;
        }

        private void Advance()
        {
            var nextPopulation = new List<GrayImage>(_population.Count);

            for (var i = 0; i < _population.Count; i++)
            {
                var index1 = PickIndexForCrossover();
                var index2 = PickIndexForCrossover();

                while (index1 == index2)
                {
                    index2 = PickIndexForCrossover();
                }

                var child = Crossover(index1, index2);

                nextPopulation.Add(child);
            }

            _population = nextPopulation;
            _population.Sort(Comparator);
        }

        private int PickIndexForCrossover()
        {
            double r = 1 + _random.Next(_summationIndexes);

            return (int)(Math.Floor(-0.5 + Math.Sqrt(0.25 - 2.0 * -r)) - 1.0);
        }

        private GrayImage Crossover(int index1, int index2)
        {
            var parent1 = _population[index1];
            var parent2 = _population[index2];
            var child = new GrayImage(_imageSize, ImageInitializationType.Solid);

            for (var x = 0; x < _imageSize.Width; x++)
            {
                for (var y = 0; y < _imageSize.Height; y++)
                {
                    if (_random.NextDouble() < _mutationRate)
                    {
                        child.Pixels[x, y] = (byte)_random.Next(256);
                    }
                    else if (_random.Next(2) == 0)
                    {
                        child.Pixels[x, y] = parent1.Pixels[x, y];
                    }
                    else
                    {
                        child.Pixels[x, y] = parent2.Pixels[x, y];
                    }
                }
            }

            return child;
        }

        private double Fitness(GrayImage image)
        {
            var acc = 0.0;

            foreach (var target in _targets)
            {
                acc += target.Similarity(image, 5);
            }

            return acc / _targets.Count();
        }

        private int Comparator(GrayImage image1, GrayImage image2)
        {
            var fitness1 = Fitness(image1);
            var fitness2 = Fitness(image2);

            return fitness1 > fitness2 ? 1 : (fitness1 < fitness2 ? -1 : 0);
        }
    }
}
