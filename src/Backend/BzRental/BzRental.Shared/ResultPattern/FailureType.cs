using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Shared.ResultPattern
{
    public enum FailureType
    {
        BadRequest,
        AccessForbidden,
        Validation,
        NotFound,
        Conflict,
        Unauthorized,
        Other,
        InternalServerError
    }
}
