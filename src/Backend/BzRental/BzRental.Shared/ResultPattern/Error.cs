using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace BzRental.Shared.ResultPattern
{
    public sealed class Error
    {
        public Error(string code, string message, FailureType? hintFailureType = null)
        {
            this.Code = code;
            this.Message = message;
            this.HintFailureType = hintFailureType;
        }

        public Error()
        {
        }

        public string Message { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;

        [JsonIgnore]
        public FailureType? HintFailureType { get; set; }

        public override string ToString()
        {
            return $"{Code}: {Message}";
        }
    }
}
