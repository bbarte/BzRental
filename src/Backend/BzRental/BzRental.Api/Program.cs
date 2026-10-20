using BzRental.Api.Abstraction;
using BzRental.Api.Handlers;
using BzRental.DbAccess.Contexts;
using BzRental.Shared.Abstraction;
using LinqKit;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;

namespace BzRental.Api
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddDbContext<BzRentalDbContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
                .WithExpressionExpanding()
                .LogTo(msg => Debug.WriteLine(msg), new[] { DbLoggerCategory.Database.Command.Name }, LogLevel.Information)
#if DEBUG
                .EnableSensitiveDataLogging()
#endif
                );

            builder.Services.AddExceptionHandler<SqlServerExceptionHandler>();
            builder.Services.AddProblemDetails();

            builder.Services.AddHttpContextAccessor();

            builder.Services.AddScoped<IPasswordHasher<object>, PasswordHasher<object>>();
            builder.Services.AddScoped<ISharedPasswordHasher, AspnetPasswordHasher>();

            builder.Services.AddControllers();
            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            builder.Services.AddOpenApi();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();

                app.UseReDoc(opt =>
                {
                    opt.SpecUrl("/openapi/v1.json");
                    opt.DocumentTitle = "BzRental API (C) Bartosz Zagalski";

                    opt.NativeScrollbars();
                    opt.PathInMiddlePanel();
                });
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();

            app.UseExceptionHandler();

            app.MapControllers();

            app.Run();
        }
    }
}
