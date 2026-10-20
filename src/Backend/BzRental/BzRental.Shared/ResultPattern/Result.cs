using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Shared.ResultPattern
{
    public sealed class Result : BaseResult
    {
        private Result(
            bool isSuccess,
            List<Error>? errors,
            FailureType? failureType)

            : base(isSuccess, errors, failureType)
        {
        }

        public static Result Success()
        {
            return new Result(true, null, null);
        }

        public static Result Failure(
            List<Error> errors,
            FailureType failureType = ResultPattern.FailureType.BadRequest)
        {
            return new Result(false, errors, failureType);
        }

        public static Result Failure(
            Error error,
            FailureType failure = ResultPattern.FailureType.BadRequest)
        {
            return Result.Failure(new List<Error>() { error }, failure);
        }

        public static implicit operator Result(Error error)
        {
            return Result.Failure(error, error.HintFailureType ?? ResultPattern.FailureType.BadRequest);
        }
    }
}
