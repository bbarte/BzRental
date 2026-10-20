using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Shared.Models
{
    public class DomainModel : BaseDomainModel, IPrimaryKeyModel
    {
        public int Id { get; set; }
    }
}
