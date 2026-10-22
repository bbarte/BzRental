using BzRental.Shared.Contracts.Dtos;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Application.Users.Dtos
{
    public sealed class UserDto : TimestampDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public bool IsAdmin { get; set; } = false;

        public bool IsDeleted { get; set; } = false;
        public bool IsBlocked { get; set; } = false;
    }
}
