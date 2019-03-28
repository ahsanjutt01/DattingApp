using System;
using System.ComponentModel.DataAnnotations;

namespace DatingApp.API.DTO
{
    public class UserForRegisterDto
    {
        [Required, StringLength(10, MinimumLength = 4, ErrorMessage = "username length must b greater then 4 and less then 8")]
        public string Username { get; set; }
        [Required, StringLength(8, MinimumLength = 4, ErrorMessage = "password length must b greater then 4 and less then 8")]
        public string Password { get; set; }
        [Required]
        public string City { get; set; }
        [Required]
        public string Country { get; set; }
        [Required]
        public string Gender { get; set; }
        [Required]
        public string KnownAs { get; set; }
        [Required]
        public DateTime DateOfBirth { get; set; }
        public DateTime Created { get; set; } = DateTime.Now;
        public DateTime LastActive { get; set; } = DateTime.Now;
    }
}