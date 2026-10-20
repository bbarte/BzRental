using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Shared.ResultPattern
{
    public sealed class ResultPatternException : Exception
    {
        public ResultPatternException() : base()
        {
        }

        public ResultPatternException(string? message) : base(message)
        {
        }

        public ResultPatternException(string? message, Exception? innerException) : base(message, innerException)
        {
        }
    }
}
