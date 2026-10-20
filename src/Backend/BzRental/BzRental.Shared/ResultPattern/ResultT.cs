using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Shared.ResultPattern
{
    public sealed class Result<T> : BaseResult
    {
        private readonly T? _value;

        private Result(
            bool isSuccess,
            List<Error>? errors,
            FailureType? failureType,
            T? value)

            : base(isSuccess, errors, failureType)
        {
            if (!isSuccess && value != null)
            {
                throw new ResultPatternException("A failed result cannot hold an value!");
            }

            _value = value;
        }

        public T Value
        {
            get
            {
                if (IsFailure)
                {
                    StringBuilder sb = new StringBuilder();

                    sb.AppendLine("Tried to access the value of a failed result!\n");

                    foreach (Error error in this.Errors)
                        sb.AppendLine(error.ToString());

                    throw new ResultPatternException(sb.ToString());
                }

                return _value!;
            }
        }

        public static Result<T> Success(T value)
        {
            return new Result<T>(true, null, null, value);
        }

        public static Result<T> Failure(
            List<Error> errors,
            FailureType failureType = ResultPattern.FailureType.BadRequest)
        {
            return new Result<T>(false, errors, failureType, default);
        }

        public static Result<T> Failure(
            Error error,
            FailureType failureType = ResultPattern.FailureType.BadRequest)
        {
            return Result<T>.Failure(new List<Error>() { error }, failureType);
        }

        public Result<TOther> FailedCast<TOther>()
        {
            if (IsSuccess)
            {
                throw new ResultPatternException("A successful result cannot be converted into Result<T>.");
            }

            return Result<TOther>.Failure(
                this.Errors,
                this.FailureType!.Value);
        }

        public static implicit operator Result<T>(T value)
        {
            return Result<T>.Success(value);
        }

        public static implicit operator Result<T>(Error error)
        {
            return Result<T>.Failure(error, error.HintFailureType ?? ResultPattern.FailureType.BadRequest);
        }

        public static implicit operator Result<T>(Result result)
        {
            if (result.IsSuccess)
            {
                throw new ResultPatternException("A successful result cannot be converted into Result<T>.");
            }

            return Result<T>.Failure(
                result.Errors,
                result.FailureType!.Value);
        }

        public static implicit operator Result(Result<T> result)
        {
            if (result.IsSuccess)
            {
                throw new ResultPatternException("A successful result cannot be converted into Result<T>.");
            }

            return Result.Failure(
                result.Errors,
                result.FailureType!.Value);
        }
    }
}
