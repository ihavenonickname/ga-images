using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;

namespace ImageCombinator
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Loading targets");

            var image1 = new GrayImage(args[0]);

            Console.WriteLine("Creating evolver");

            var targets = new [] { image1 };
            var evolver = new ImageCombinator(targets, 80, 0.0005);

            Console.WriteLine("Evolving");

            var bestIndividual = evolver.Evolve(0.95, int.Parse(args[1]));

            Console.WriteLine("Writing best individual");

            bestIndividual.Write("best.jpg");
        }
    }
}
