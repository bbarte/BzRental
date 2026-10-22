using BzRental.Shared.ResultPattern;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Application.Users.Errors
{
    public static class AuthErrors
    {
        public static readonly Error LoginFailed = new Error(
            "Auth.LoginFailed", "Provided login creds. where incorrect", FailureType.BadRequest);
        
        public static readonly Error Blocked = new Error(
            "Auth.Blocked", "User was blocked", FailureType.BadRequest);
    }
}
