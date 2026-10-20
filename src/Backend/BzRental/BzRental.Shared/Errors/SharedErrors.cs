using BzRental.Shared.ResultPattern;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Shared.Errors
{
    public static class SharedErrors
    {
        public static readonly Error RelationsNotFound
            = new Error("RelationsNotFound", "The request contained ids of objects which don't exist in the database.", FailureType.BadRequest);

        public static readonly Error NotFound
            = new Error("NotFound", "Requested resource was not found.", FailureType.NotFound);
    }
}
