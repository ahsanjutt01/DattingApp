namespace DatingApp.API.DTO
{
    using System;
    using Microsoft.AspNetCore.Http;

    public class PhotoForCreationDto
    {
        public string Url { get; set; }
        public IFormFile File { get; set; }
        public string Description { get; set; }
        public DateTime Added { get; set; } = DateTime.Now;
        public string PublicId { get; set; }
    }
}