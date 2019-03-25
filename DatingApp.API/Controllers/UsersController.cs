using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.DTO;
using DatingApp.API.EF;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IDatingRepository _repo;
        private readonly IMapper _mapper;

        public UsersController(IDatingRepository repo, IMapper mapper)
        {
            this._mapper = mapper;
            this._repo = repo;
        }
        [HttpGet]
        public async Task<IEnumerable<UserForListDto>> GetUsers() =>
        _mapper.Map<IEnumerable<UserForListDto>>(await _repo.GetUsers());

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            return Ok(_mapper.Map<UserForDetailDto>(await _repo.GetUser(id)));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id,
        UpdatingUserDto userDto)
        {
            if(id!=int.Parse(User.FindFirst((ClaimTypes.NameIdentifier)).Value))
            return Unauthorized();

            var userFormRepo=await _repo.GetUser(id);
            _mapper.Map(userDto, userFormRepo);
            if(await _repo.SaveAll())
            return NoContent();

            throw new System.Exception($"User Updating {id} failed to save!");
        }
    }
}