using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Configuration.Users
{
    public static class ConfigurationExtensions
    {
        public static ModelBuilder ConfigureUsers(this ModelBuilder builder)
        {
            builder.ApplyConfiguration(new UserConfiguration());

            return builder;
        }
    }
}
