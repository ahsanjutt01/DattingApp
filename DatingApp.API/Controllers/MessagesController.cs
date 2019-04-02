using System;
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

namespace DatingApp.API.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    [Authorize]
    [Route("api/users/{userId}/[controller]")]
    [ApiController]
    public class MessagesController : ControllerBase
    {
        private readonly IDatingRepository _repo;
        private readonly IMapper _mapper;

        public MessagesController(IDatingRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }
        [HttpGet("{id}", Name = "GetMessage")]
        public async Task<IActionResult> GetMassage(int userId, int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var messageFromRepo = await _repo.GetMessage(id);

            if (messageFromRepo == null)
                return NotFound("hhh");

            return Ok(messageFromRepo);
        }
        [HttpGet]
        public async Task<IActionResult> GetMessagesForUser(int userId,
        [FromQuery]MessagePrams messagePrams)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            messagePrams.UserId = userId;
            var messagesFromRepo = await _repo.GetMessagesForUser(messagePrams);
            // if (messagesFromRepo.Count == 0)
            // return BadRequest("no messges found");
            var messages = _mapper.Map<IEnumerable<MessageToReturnDto>>(messagesFromRepo);
            Response.AddPagination(messagesFromRepo.CurrentPage, messagesFromRepo.PageSize,
            messagesFromRepo.TotalCount, messagesFromRepo.TotalPages);

            return Ok(messages);
        }
        [HttpPost]
        public async Task<IActionResult> CreateMessage(int userId,
        MessageForCreationDto messageForCreationDto)
        {
            var sender = await _repo.GetUser(userId);
            if (sender.Id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var recipentFromRepo = await _repo.GetUser(messageForCreationDto.RecipientId);
            if (recipentFromRepo == null)
                return NotFound("Could not found user.");

            messageForCreationDto.SenderId = userId;
            var message = _mapper.Map<Message>(messageForCreationDto);

            _repo.Add(message);

            if (await _repo.SaveAll())
            {
                var messgeToReturn = _mapper.Map<MessageToReturnDto>(message);
                return new CreatedAtRouteResult("GetMessage", new { id = message.Id },
                messgeToReturn);
            }

            return BadRequest("Server error");
        }

        [HttpGet("thread/{recipentId}")]
        public async Task<IActionResult> GetMessagesThread(int userId, int recipentId)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var messagesFromRepo = await _repo.GetMessageThread(userId, recipentId);

            var messageThread = _mapper.Map<IEnumerable<MessageToReturnDto>>(messagesFromRepo);
            return Ok(messageThread);
        }
        [HttpPost("{id}")]
        public async Task<IActionResult> DeleteMessage(int id, int userId)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var messageFromRepo = await _repo.GetMessage(id);

            if (messageFromRepo.SenderId == userId)
                messageFromRepo.SenderDelete = true;

            if (messageFromRepo.RecipientId == userId)
                messageFromRepo.RecipientDelete = true;

            if (messageFromRepo.SenderDelete == true &&
            messageFromRepo.RecipientDelete == true)
                _repo.Delete(messageFromRepo);

            if (await _repo.SaveAll())
                return NoContent();

            throw new Exception("Error Deleting the Message..!");
        }
        [HttpPost("{id}/read")]
        public async Task<IActionResult> MarkMessageAsRead(int userId, int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var messageFromRepo = await _repo.GetMessage(id);

            if (messageFromRepo.RecipientId != userId)
                return Unauthorized();

            messageFromRepo.IsRead = true;
            messageFromRepo.DateRead = DateTime.Now;

            if (await _repo.SaveAll())
                return NoContent();
            throw new Exception("Error in saving the Message..!");
        }
    }
}