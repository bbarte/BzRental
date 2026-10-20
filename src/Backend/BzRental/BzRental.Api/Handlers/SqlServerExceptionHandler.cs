using BzRental.Shared.Contracts.Dtos.ResultPattern;
using BzRental.Shared.Errors;
using BzRental.Shared.ResultPattern;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace BzRental.Api.Handlers
{
    public sealed class SqlServerExceptionHandler : IExceptionHandler
    {
        private const int ForeignKeyErrorNumber = 547;

        public async ValueTask<bool> TryHandleAsync(
            HttpContext httpContext,
            Exception exception,
            CancellationToken cancellationToken)
        {
            if (exception is DbUpdateException dbUpdateEx &&
                dbUpdateEx.InnerException is SqlException sqlServerEx)
            {
                if (sqlServerEx.Number == ForeignKeyErrorNumber)
                {
                    Result errorResult = Result.Failure(SharedErrors.RelationsNotFound, FailureType.BadRequest);
                    ApiErrorResponseDto dto = new ApiErrorResponseDto
                    {
                        Errors = errorResult.Errors.Select(x => new ApiErrorDto
                        {
                            Code = x.Code,
                            Message = x.Message
                        }).ToList()
                    };

                    httpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
                    await httpContext.Response.WriteAsJsonAsync(dto, cancellationToken);

                    return true;
                }
            }

            return false;
        }
    }
}
