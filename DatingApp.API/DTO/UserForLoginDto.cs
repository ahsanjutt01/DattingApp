using System;
using System.ComponentModel.DataAnnotations;

namespace DatingApp.API.DTO
{
    public class UserForLoginDto
    {
        [Required, StringLength(10, MinimumLength = 4, ErrorMessage = "Username Must b Specify in the 4 or 8 characters")]
        public string Username { get; set; }
        [Required, StringLength(8, MinimumLength = 4, ErrorMessage = "Password Must b Specify in the 4 or 8 characters")]
        public string Password { get; set; }
    }
}