using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Shared.Contracts.Dtos.ResultPattern
{
    public sealed class ApiErrorDto : Dto
    {
        public string Code { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
    }
}
