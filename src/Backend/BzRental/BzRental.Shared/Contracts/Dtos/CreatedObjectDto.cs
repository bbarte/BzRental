using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Shared.Contracts.Dtos
{
    public sealed class CreatedObjectDto<T>
    {
        public T Id { get; set; } = default!;

        public CreatedObjectDto()
        {
        }

        public CreatedObjectDto(T id)
        {
            Id = id;
        }
    }
}
