using BzRental.Shared.ResultPattern;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Application.Products.Errors
{
    public static class FileErrors
    {
        public static readonly Error NoFilesProvided = new Error(
            "Files.NoFilesProvided", "The request didn't contain any files", FailureType.BadRequest);
        
        public static readonly Error InvalidExtension = new Error(
            "Files.InvalidExtension", "The provided file had an invalid extension", FailureType.BadRequest);
    }
}
