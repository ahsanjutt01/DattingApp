using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.EF
{
    public class DataContext:DbContext
    {
        public DataContext(DbContextOptions<DataContext> options):base(options) {}

        public DbSet<Value> Values { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<Like> Likes { get; set; }
        public DbSet<Message> Messages { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<Like>().HasKey(l=> new {l.LikerId,l.LikeeId});
            builder.Entity<Like>().HasOne(u=>u.Liker)
                .WithMany(u => u.Likers).HasForeignKey(l=>l.LikerId)
                .OnDelete(DeleteBehavior.Restrict);
            
            builder.Entity<Like>().HasOne(u=>u.Likee)
                .WithMany(u => u.Likees).HasForeignKey(l=>l.LikeeId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Message>()
                .HasOne(x=> x.Sender).WithMany(m=>m.MessagesSent)
                .OnDelete(DeleteBehavior.Restrict);
            builder.Entity<Message>()
                .HasOne(x=> x.Recipient).WithMany(m=>m.MessagesReceived)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}