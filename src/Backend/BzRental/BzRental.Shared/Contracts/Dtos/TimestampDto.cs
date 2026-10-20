using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Shared.Contracts.Dtos
{
    public class TimestampDto : Dto
    {
        public DateTime CreatedAt { get; set; }
    }
}
