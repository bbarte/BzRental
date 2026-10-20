using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Shared.Contracts.Dtos.ResultPattern
{
    public sealed class ApiErrorResponseDto : Dto
    {
        public List<ApiErrorDto> Errors { get; set; } = new();
    }
}
