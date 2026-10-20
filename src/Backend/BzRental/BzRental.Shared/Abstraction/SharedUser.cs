using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Shared.Abstraction
{
    public sealed class SharedUser
    {
        public int Id { get; set; }
        public string Role { get; set; } = string.Empty;
    }
}
