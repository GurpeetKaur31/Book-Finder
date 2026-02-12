using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using dotnetapp.Models;
using dotnetapp.Data;

namespace dotnetapp.Services
{
    public interface IAuthService
    {
        public Task<(int, string)> Registration(User model, string role);

        public Task<(int, object)> Login(LoginModel model);
    }
}
