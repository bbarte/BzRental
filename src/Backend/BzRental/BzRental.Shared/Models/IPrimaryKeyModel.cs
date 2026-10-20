using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Shared.Models
{
    public interface IPrimaryKeyModel
    {
        public int Id { get; set; }
    }
}
