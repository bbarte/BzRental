using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Shared.Pagination
{
    public sealed class PaginationParameters
    {
        public const int MaxPageSize = 250;

        private int _pageNumber = 1;
        private int _pageSize = 50;

        public int PageNumber
        {
            get => _pageNumber;
            set
            {
                if (value <= 0)
                    _pageNumber = 1;
                else
                    _pageNumber = value;
            }
        }

        public int PageSize
        {
            get => _pageSize;
            set
            {
                if (value <= 0)
                    _pageSize = 5;
                else if (value > MaxPageSize)
                    _pageSize = 5;
                else
                    _pageSize = value;
            }
        }
    }
}
