using BzRental.Shared.Contracts.Dtos;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Application.Users.Dtos
{
    public class AuthDto : Dto
    {
        public string AccessToken { get; set; } = string.Empty;
        public bool IsAdmin { get; set; } = false;
    }
}
