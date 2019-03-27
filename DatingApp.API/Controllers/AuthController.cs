using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.DTO;
using DatingApp.API.EF;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace DatingApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _auth;
        private readonly IConfiguration _config;
        private readonly IMapper _mapper;

        public AuthController(IAuthRepository auth, IConfiguration config,
        IMapper mapper)
        {
            _mapper = mapper;
            _config = config;
            _auth = auth;
        }

        [HttpPost]
        public async Task<IActionResult> Register(UserForRegistetDto userForRegistetDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            userForRegistetDto.Username = userForRegistetDto.Username.ToLower();
            if (await _auth.UserExists(userForRegistetDto.Username))
            {
                return BadRequest("User Name Already Exists");
            }

            var user = await _auth.Register(
                new Models.User { Username = userForRegistetDto.Username },
                userForRegistetDto.Password);

            return Ok(new { Created = user });
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login(UserForLoginDto userForLoginDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var userFromRepo = await _auth.Login(userForLoginDto.Username, userForLoginDto.Password);
            if (userFromRepo == null)
                return Unauthorized();
            var claims = new[]{
                new Claim(ClaimTypes.NameIdentifier, userFromRepo.Id.ToString()),
                new Claim(ClaimTypes.Name, userFromRepo.Username)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetSection("AppSettings:Token").Value));

            var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = cred
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var user = _mapper.Map<UserForListDto>(userFromRepo);
            return Ok(new { token = tokenHandler.WriteToken(token), user = user });


        }
    }
}