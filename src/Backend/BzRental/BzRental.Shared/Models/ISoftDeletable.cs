using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Shared.Models
{
    public interface ISoftDeletable
    {
        public bool IsDeleted { get; set; }
    }
}
