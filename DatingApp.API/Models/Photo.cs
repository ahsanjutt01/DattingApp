using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DatingApp.API.Models
{
    public class Photo
    {
        public int Id { get; set; }
        public string Url { get; set; }
        public string Description { get; set; }
        public DateTime Added { get; set; }
        public bool IsMain { get; set; }
        public User User { get; set; }
        [ForeignKey("User"), Required]
        public int UserId { get; set; }
    }
}