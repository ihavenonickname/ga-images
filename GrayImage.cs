using System;
using System.Drawing;
using System.IO;
using System.Linq;

namespace ImageCombinator
{
    public class GrayImage
    {
        public readonly byte[,] Pixels;
        private readonly Size _size;

        public Size Size
        {
            get
            {
                return _size;
            }
        }

        // public byte this[int x, int y]
        // {
        //     get
        //     {
        //         return _pixels[x, y];
        //     }

        //     set
        //     {
        //         _pixels[x, y] = value;
        //     }
        // }

        public GrayImage(string filepath)
        {
            var image = new Bitmap(filepath);

            Pixels = new byte[image.Width, image.Height];
            _size = image.Size;

            for (var x = 0; x < image.Width; x++)
            {
                for (var y = 0; y < image.Height; y++)
                {
                    var pixel = image.GetPixel(x, y);
                    Pixels[x, y] = (byte)((pixel.R + pixel.G + pixel.B) / 3);
                }
            }
        }

        public GrayImage(Size size, ImageInitializationType initialization)
        {
            _size = size;
            Pixels = new byte[size.Width, size.Height];

            if (initialization == ImageInitializationType.Random)
            {
                var random = new Random();

                for (var x = 0; x < size.Width; x++)
                {
                    for (var y = 0; y < size.Height; y++)
                    {
                        Pixels[x, y] = (byte)(random.Next(256));
                    }
                }
            }
        }

        public double Similarity(GrayImage other)
        {
            return Similarity(other, 25);
        }

        public double Similarity(GrayImage other, byte tolerance)
        {
            if (Size != other.Size)
            {
                throw new ArgumentException("Images must have same size");
            }

            var matches = 0;

            for (var x = 0; x < Size.Width; x++)
            {
                for (var y = 0; y < Size.Height; y++)
                {
                    if (Math.Abs(Pixels[x, y] - other.Pixels[x, y]) <= tolerance)
                    {
                        matches++;
                    }
                }
            }

            return ((double)matches) / Pixels.Length;
        }

        public void Write(string filepath)
        {
            var image = new Bitmap(Size.Width, Size.Height);

            for (var x = 0; x < Size.Width; x++)
            {
                for (var y = 0; y < Size.Height; y++)
                {
                    var p = Pixels[x, y];
                    image.SetPixel(x, y, Color.FromArgb(p, p, p));
                }
            }

            image.Save(filepath);
        }
    }
}