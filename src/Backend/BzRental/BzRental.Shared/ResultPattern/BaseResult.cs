using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Shared.ResultPattern
{
    public abstract class BaseResult
    {
        protected BaseResult(
            bool isSuccess,
            List<Error>? errors,
            FailureType? failureType)
        {
            if (isSuccess && failureType != null)
            {
                throw new ResultPatternException("A successful result cannot have a specified failure type!");
            }

            if (!isSuccess && failureType == null)
            {
                throw new ResultPatternException("A failed result must have a specified failure type!");
            }

            IsSuccess = isSuccess;
            Errors = errors ?? new List<Error>();
            FailureType = failureType;
        }

        public bool IsSuccess { get; }
        public bool IsFailure => !IsSuccess;
        public FailureType? FailureType { get; }
        public List<Error> Errors { get; }
    }
}
