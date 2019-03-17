using Microsoft.AspNetCore.Http;

namespace DatingApp.API.Helpers
{
    public static class Extentions
    {
        public static void ApplicationError(this HttpResponse httpResponse, string message)
        {
            httpResponse.Headers.Add("Application-Error", message);
            httpResponse.Headers.Add("Acces-Control-Expose-Header","Application-Error");
            httpResponse.Headers.Add("Access-Control-Allow-Origin","*");
        }
    }
}