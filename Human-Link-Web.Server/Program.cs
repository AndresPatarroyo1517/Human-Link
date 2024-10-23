 using Human_Link_Web.Server.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Human_Link_Web.Server.Custom;
using Microsoft.AspNetCore.Authentication.Cookies;

namespace Human_Link_Web.Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            builder.Services.AddEntityFrameworkNpgsql().AddDbContext<HumanLinkContext>(options =>{options.UseNpgsql(builder.Configuration.GetConnectionString("HLContext"));});
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowSpecificOrigin", builder =>
                {
                    builder.WithOrigins("https://localhost:5173") 
                           .AllowAnyMethod()  
                           .AllowAnyHeader()
                           .AllowCredentials(); 
                });
            });

            builder.Services.AddSingleton<Utilidades>();
            builder.Services.AddScoped<PasswordHasher>();

            builder.Services.AddAuthentication(config =>
            {
                config.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
            }).AddJwtBearer(config =>
            {
                config.RequireHttpsMetadata = false;
                config.SaveToken = true;
                config.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero,
                    IssuerSigningKey = new SymmetricSecurityKey
                    (Encoding.UTF8.GetBytes(builder.Configuration["Jwt:key"]!))
                };
            })
            .AddCookie(config => {
                config.LoginPath = "/HumanLink/Login/login";
                config.SlidingExpiration = true;
                config.ExpireTimeSpan = TimeSpan.FromDays(1);
            });

            builder.Services.AddAuthorization(options =>
            {
                // Se define como opciones de autorización AdminPolicy y AllPolicy
                // AdminPolicy: solo permite el consumo del endpoint a los usuarios logeados y con rol administrador
                // AllPolicy: solo permite el consumo del endpoint a usuarios logeados, ya sea adminnistrador o empleado
                options.AddPolicy("AdminPolicy", policy => policy.RequireRole("Admin"));
                options.AddPolicy("AllPolicy", policy => policy.RequireRole("Empleado", "Admin"));
            });

            var app = builder.Build();

            app.UseDefaultFiles();
            app.UseStaticFiles();
            

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }
            app.UseMiddleware<JwtCookieMiddleware>();
            app.UseHttpsRedirection();

            app.UseAuthentication();

            app.UseCors("AllowSpecificOrigin");
            
            app.UseRouting();

            app.UseAuthorization();

            app.MapControllers();

            app.MapFallbackToFile("/index.html");

            app.Run();
        }
    }
}
