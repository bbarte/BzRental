using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Domain.ProductsRenting.Enums
{
    public enum ProductRentingStatus
    {
        Planned,
        InProgress,
        Returned,
        Canceled,
        UserDidNotShowUp,
        Overdue
    }
}
