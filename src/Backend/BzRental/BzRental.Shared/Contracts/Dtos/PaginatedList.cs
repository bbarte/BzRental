using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Shared.Contracts.Dtos
{
    public class PaginatedList<T>
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 50;
        public bool HasNextPage { get; set; } = false;
        public List<T> Items { get; set; } = new();
    }
}
