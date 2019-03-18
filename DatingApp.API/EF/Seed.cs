using System.Collections.Generic;
using DatingApp.API.Models;
using Newtonsoft.Json;

namespace DatingApp.API.EF
{
    public class Seed
    {
        private readonly DataContext _context;
        public Seed(DataContext context)
        {
            _context = context;
        }

        public void SeedUsers()
        {
            var userData = System.IO.File.ReadAllText("EF/userSeedData.json");
            var users=JsonConvert.DeserializeObject<List<User>>(userData);
            foreach(var user in users)
            {
                CreatePasswordHash("Password",out byte[] passwordHash,out byte[] passwordSalt);

                user.PasswordHash=passwordHash;
                user.PasswordSalt=passwordSalt;
                user.Username=user.Username.ToLower();

                _context.Users.Add(user);
            }

            _context.SaveChanges();
        }
        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }
    }
}