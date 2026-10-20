using BzRental.Shared.ResultPattern;
using FluentValidation;
using FluentValidation.Results;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Shared.Extensions
{
    /// <summary>
    /// Extension methods for dealing with FluentValidation.
    /// </summary>
    public static class ValidationExtensions
    {
        /// <summary>
        /// Converts the Fluent <see cref="ValidationResult"/> to the BzRental's <see cref="Result"/> from the result pattern.
        /// </summary>
        /// <param name="valResult"></param>
        /// <returns></returns>
        public static Result ToBzRentalResult(this ValidationResult valResult)
        {
            if (valResult.IsValid)
                return Result.Success();

            return Result.Failure(valResult.Errors.Select(x => new Error
            {
                Message = $"{x.PropertyName} - {x.ErrorMessage}",
                Code = x.ErrorCode
            }).ToList(), FailureType.Validation);
        }

        /// <summary>
        /// Validates the specified instance using the FluentValidation.Validate() method and converts
        /// the result to the BzRental's <see cref="Result"/> from the result pattern.
        /// </summary>
        /// <typeparam name="T">Type of the model being validated</typeparam>
        /// <param name="validator"></param>
        /// <param name="instance">Instance to validate</param>
        /// <returns>
        /// BzRental's <see cref="Result"/>
        /// </returns>
        public static Result ValidateToBzRentalResult<T>(
            this IValidator<T> validator,
            T instance)
        {
            return validator.Validate(instance).ToBzRentalResult();
        }

        /// <summary>
        /// Validates the specified instance using the FluentValidation.ValidateAsync() method and converts
        /// the result to the BzRental's <see cref="Result"/> from the result pattern.
        /// </summary>
        /// <typeparam name="T">Type of the model being validated</typeparam>
        /// <param name="validator"></param>
        /// <param name="instance">Instance to validate</param>
        /// <returns>
        /// BzRental's <see cref="Result"/> in an async Task.
        /// </returns>
        public static async Task<Result> ValidateToBzRentalResultAsync<T>(
            this IValidator<T> validator,
            T instance)
        {
            return (await validator.ValidateAsync(instance)).ToBzRentalResult();
        }
    }
}
