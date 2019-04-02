using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.DTO;
using DatingApp.API.EF;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
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
        public async Task<IEnumerable<UserForListDto>> GetUsers([FromQuery]UserPrams userPrams)
        {
            var currentUserId = int.Parse(User.FindFirst((ClaimTypes.NameIdentifier)).Value);

            var _user = await _repo.GetUser(currentUserId);

            if (string.IsNullOrEmpty(userPrams.Gender))
            {
                userPrams.Gender = _user.Gender == "male" ? "female" : "male";
            }
            userPrams.UserId=currentUserId;
            var users = await _repo.GetUsers(userPrams);
            var userForReturn = _mapper.Map<IEnumerable<UserForListDto>>(users);
            Response.AddPagination(users.CurrentPage, users.PageSize,
                users.TotalCount, users.TotalPages);
            return userForReturn;
        }

        [HttpGet("{id}", Name = "GetUser")]
        public async Task<IActionResult> GetUser(int id)
        {
            return Ok(_mapper.Map<UserForDetailDto>(await _repo.GetUser(id)));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id,
        UpdatingUserDto userDto)
        {
            if (id != int.Parse(User.FindFirst((ClaimTypes.NameIdentifier)).Value))
                return Unauthorized();

            var userFormRepo = await _repo.GetUser(id);
            _mapper.Map(userDto, userFormRepo);
            if (await _repo.SaveAll())
                return NoContent();

            throw new System.Exception($"User Updating {id} failed to save!");
        }
        [HttpPost("{id}/like/{recipientId}")]
        public async Task<IActionResult> GetLike(int id, int recipientId)
        {
            if (id != int.Parse(User.FindFirst((ClaimTypes.NameIdentifier)).Value))
                return Unauthorized();
                var like = await _repo.GetLike(id, recipientId);
                if(like!=null)
                return BadRequest("You already like this person");

                if(await _repo.GetUser(recipientId) == null)
                return BadRequest("Not found");

                like = new Like{
                    LikerId =id,
                    LikeeId=recipientId
                };
                _repo.Add<Like>(like);

                if(await _repo.SaveAll())
                return Ok(like);

                return BadRequest("Failed to like user");
        }
        
    }
}