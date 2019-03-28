using System;
using System.Security.Claims;
using System.Threading.Tasks;
using DatingApp.API.EF;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;

namespace DatingApp.API.Helpers
{
    public class LogUserActivity : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var resultContext = await next();
            var userId=int.Parse(resultContext.HttpContext.User.
            FindFirst(ClaimTypes.NameIdentifier).Value);

            var _repo=resultContext.HttpContext.RequestServices
            .GetService<IDatingRepository>();
            var user=await _repo.GetUser(userId);
            user.LastActive=DateTime.Now;
            await _repo.SaveAll();
        }
    }
}