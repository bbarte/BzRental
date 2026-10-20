using BzRental.Shared.ResultPattern;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Shared.Abstraction
{
    public interface IUserProvider
    {
        Result<SharedUser> GetUser();
    }
}
