using System.ComponentModel.DataAnnotations;

namespace DatingApp.API.DTO
{
    public class UserForRegistetDto
    {
        [Required,StringLength(8,MinimumLength=4,ErrorMessage="username length must b greater then 4 and less then 8")]
        public string Username { get; set; }
        [Required,StringLength(8,MinimumLength=4,ErrorMessage="password length must b greater then 4 and less then 8")]
        public string Password { get; set; }
    }
}