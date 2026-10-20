using BzRental.Shared.Contracts.Dtos.ResultPattern;
using BzRental.Shared.ResultPattern;
using Microsoft.AspNetCore.Mvc;

namespace BzRental.Api.Extensions
{
    public static class ResultPatternExtensions
    {
        private static ActionResult GetHttpBasedOnResult(BaseResult result)
        {
            ApiErrorResponseDto dto = new ApiErrorResponseDto()
            {
                Errors = result.Errors.Select(x => new ApiErrorDto
                {
                    Code = x.Code,
                    Message = x.Message
                }).ToList()
            };

            switch (result.FailureType)
            {
                case FailureType.BadRequest:
                case FailureType.Validation:
                case FailureType.Other:
                    return new BadRequestObjectResult(dto);

                case FailureType.AccessForbidden:
                    return new ObjectResult(dto)
                    {
                        StatusCode = StatusCodes.Status403Forbidden
                    };

                case FailureType.NotFound:
                    return new NotFoundObjectResult(dto);

                case FailureType.Conflict:
                    return new ConflictObjectResult(dto);

                case FailureType.Unauthorized:
                    return new UnauthorizedObjectResult(dto);

                case FailureType.InternalServerError:
                default:
                    return new ObjectResult(dto)
                    {
                        StatusCode = StatusCodes.Status500InternalServerError
                    };
            }
        }

        /// <summary>
        /// Converts a BzRental's result pattern <see cref="Result"/> to the HTTP IActionResult with a proper status code.
        /// </summary>
        /// <param name="result"></param>
        /// <returns></returns>
        public static IActionResult ToActionResult(this Result result)
        {
            if (result.IsSuccess)
                return new NoContentResult();
            else
                return GetHttpBasedOnResult(result);
        }

        /// <inheritdoc cref="ToActionResult(Result)"/>
        public static ActionResult<T> ToActionResult<T>(this Result<T> result)
        {
            if (result.IsSuccess)
                return new OkObjectResult(result.Value);
            else
                return GetHttpBasedOnResult(result);
        }
    }
}
