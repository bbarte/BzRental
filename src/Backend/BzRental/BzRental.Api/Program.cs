using BzRental.Api.Abstraction;
using BzRental.Api.Auth;
using BzRental.Api.Handlers;
using BzRental.Application.Products;
using BzRental.Application.ProductsRenting;
using BzRental.Application.Users;
using BzRental.Application.Users.Services;
using BzRental.DbAccess.Contexts;
using BzRental.DbAccess.Seeding;
using BzRental.Shared.Abstraction;
using LinqKit;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Diagnostics;
using System.Text;
using System.Text.Json.Serialization;

namespace BzRental.Api
{
    public class Program
    {
        public static async Task Main(string[] args)
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
            builder.Services.AddScoped<IUserProvider, JwtUserProvider>();
            builder.Services.AddScoped<ITokenCreationService, TokenCreationService>();

            builder.Services.AddScoped<BzRentalDbContextSeeder>();

            builder.Services
                .AddUserServices()
                .AddProductServices()
                .AddProductsRentingServices();

            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(opt =>
                {
                    opt.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = builder.Configuration["Jwt:Issuer"],
                        ValidAudience = builder.Configuration["Jwt:Audience"],
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)),
                        ClockSkew = TimeSpan.Zero
                    };
                });

            builder.Services.AddAuthorization();
            builder.Services
                .AddControllers()
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.Converters.Add(
                        new JsonStringEnumConverter()
                    );
                });
            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            builder.Services.AddOpenApi();

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("Frontend", policy =>
                {
                    policy
                        .WithOrigins(builder.Configuration["FrontendUrl"]!)
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials();
                });
            });

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

            using (IServiceScope scope = app.Services.CreateScope())
            {
                IServiceProvider services = scope.ServiceProvider;

                BzRentalDbContextSeeder seeder = services.GetRequiredService<BzRentalDbContextSeeder>();
                await seeder.Seed();
            }

            app.UseHttpsRedirection();

            app.UseCors("Frontend");

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseExceptionHandler();

            app.UseStaticFiles();

            app.MapControllers();

            app.Run();
        }
    }
}
