using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.EF
{
    public class DatingRepo : IDatingRepository
    {
        private readonly DataContext _context;
        public DatingRepo(DataContext context)
        {
            _context = context;

        }

        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }

        public async Task<Photo> GetCurrentMainPhoto(int userId)
        {
            return await _context.Photos.Where(u => u.UserId == userId).FirstOrDefaultAsync(p => p.IsMain);
        }

        public async Task<Like> GetLike(int userId, int recipientId)
        {
            return await _context.Likes.FirstOrDefaultAsync(u =>
            u.LikerId == userId && u.LikeeId == recipientId);
        }

        public async Task<Photo> GetPhoto(int id)
        {
            return await _context.Photos.FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<User> GetUser(int id)
        {
            return await _context.Users.Include(x => x.Photos).FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task<PagedList<User>> GetUsers(UserPrams userPrams)
        {
            var users = _context.Users.Include(x => x.Photos)
            .OrderByDescending(u => u.LastActive).AsQueryable();
            users = users.Where(u => u.Id != userPrams.UserId
            && u.Gender == userPrams.Gender);

            if (userPrams.Likers)
            {
                var userLikers = await GetUserLikes(userPrams.UserId, userPrams.Likers);
                users = users.Where(u => userLikers.Contains(u.Id));
            }
            if (userPrams.Likees)
            {
                var userLikees = await GetUserLikes(userPrams.UserId, userPrams.Likers);
                users = users.Where(u => userLikees.Contains(u.Id));
            }
            if (userPrams.MinAge != 18 || userPrams.MaxAge != 99)
            {
                var minDob = DateTime.Now.AddYears(-userPrams.MaxAge - 1);
                var maxDob = DateTime.Now.AddYears(-userPrams.MinAge - 1);
                users = users.Where(u => u.DateOfBirth >= minDob && u.DateOfBirth <= maxDob);
            }

            if (!string.IsNullOrEmpty(userPrams.OrderBy))
            {
                switch (userPrams.OrderBy)
                {
                    case "created":
                        users = users.OrderByDescending(u => u.Created);
                        break;
                    default:
                        users = users.OrderByDescending(u => u.LastActive);
                        break;
                }
            }
            return await PagedList<User>.CreateAsync(users,
            userPrams.PageNumber, userPrams.PageSize); ;
        }

        private async Task<IEnumerable<int>> GetUserLikes(int id, bool liker)
        {
            var user = await _context.Users.Include(u => u.Likers)
            .Include(u => u.Likees).FirstOrDefaultAsync(u => u.Id == id);

            if (liker)
            {
                return user.Likees.Where(u => u.LikeeId == id).Select(x => x.LikerId);
            }
            else
            {
                return user.Likers.Where(u => u.LikerId == id).Select(x => x.LikeeId);
            }
        }
        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<Message> GetMessage(int id)
        {
            return await _context.Messages.FirstOrDefaultAsync(m => m.Id == id);
        }

        public async Task<PagedList<Message>> GetMessagesForUser(MessagePrams messagePrams)
        {
            var messages = _context.Messages.Include(u => u.Sender).ThenInclude(p => p.Photos)
                            .Include(u => u.Recipient).ThenInclude(p => p.Photos)
                            .AsQueryable();

            switch (messagePrams.MessageContainer)
            {
                case "Inbox":
                    messages = messages.Where(m => m.RecipientId == messagePrams.UserId && m.RecipientDelete == false);
                    break;
                case "Outbox":
                    messages = messages.Where(m => m.SenderId == messagePrams.UserId && m.SenderDelete == false);
                    break;
                default:
                    messages = messages.Where(m => m.RecipientId == messagePrams.UserId
                    && m.RecipientDelete == false && m.IsRead == false);
                    break;
            }
            messages = messages.OrderByDescending(m => m.MessageSent);
            return await PagedList<Message>.CreateAsync(messages, messagePrams.PageNumber, messagePrams.PageSize);
        }

        public async Task<IEnumerable<Message>> GetMessageThread(int userId, int recipientId)
        {
            var messages = await _context.Messages.Include(u => u.Sender).ThenInclude(p => p.Photos)
                            .Include(u => u.Recipient).ThenInclude(p => p.Photos).
                            Where(m => m.SenderId == recipientId && m.RecipientId == userId && m.RecipientDelete == false
                            || m.RecipientId == recipientId && m.SenderId == userId && m.SenderDelete == false).
                            ToListAsync();

            return messages;
        }
    }
}