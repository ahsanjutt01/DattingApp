using System;

namespace DatingApp.API.DTO
{
    public class MessageToReturnDto
    {
        public int Id { get; set; }
        public int SenderId { get; set; }
        public string SenderKnownAs { get; set; }
        public string SenderPotoUrl { get; set; }
        public int RecipientId { get; set; }
        public string RecipientKnownAs { get; set; }
        public string RecipientPotoUrl { get; set; }
        public string Content { get; set; }
        public DateTime? DateRead { get; set; }
        public bool IsRead { get; set; }
        public DateTime MessageSent { get; set; }
        
    }
}