namespace DatingApp.API.Helpers
{
    public class MessagePrams
    {
        const int maxPageSize = 50;
        public int PageNumber { get; set; } = 1;
        private int pageSize = 10;
        public int PageSize
        {
            get { return pageSize; }
            set { pageSize = value > 50 ? maxPageSize : value; }
        }
        public int UserId { get; set; }
        public string MessageContainer { get; set; }="Unread";
    }
}