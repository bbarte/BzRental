using BzRental.Shared.ResultPattern;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Application.Users.Errors
{
    public static class UserErrors
    {
        public static readonly Error UsernameTaken = new Error(
            "Users.UsernameTaken", "The provided username is already taken", FailureType.BadRequest);
        
        public static readonly Error InvalidCurrentPassword = new Error(
            "Users.InvalidCurrentPassword", "The provided current password is invalid", FailureType.BadRequest);
        
        public static readonly Error OperationWouldBlockAccess = new Error(
            "Users.OperationWouldBlockAccess", "Cannot fullfil request, because it would block the access to the system", FailureType.BadRequest);
    }
}
