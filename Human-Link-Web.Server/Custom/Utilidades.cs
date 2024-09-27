using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Human_Link_Web.Server.Models;
using Microsoft.AspNetCore.Authentication.Cookies;

namespace Human_Link_Web.Server.Custom
{
    public class Utilidades
    {
        private readonly IConfiguration _configuration;
        public Utilidades(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string encriptarSHA256(string texto)
        {
            using (SHA256 sha256Hash = SHA256.Create())
            {
                // Computar el hash
                byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(texto));

                // Convertir el array de bytes a String
                StringBuilder builder = new StringBuilder();
                for (int i = 0; i < bytes.Length; i++)
                {
                    builder.Append(bytes[i].ToString("x2"));
                }
                return builder.ToString();
            }
            
        }

        public string generarJWT(Usuario usuario)
        {
            // Crear la información del usuario para el token
            var userClaims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, usuario.Idusuario.ToString()),
                new Claim(ClaimTypes.Name, usuario.Usuario1!),
                new Claim("isAdmin", usuario.Isadmin.ToString())
            };

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:key"]!));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            // Crear detalle del token
            var jwtConfig = new JwtSecurityToken(
                    claims: userClaims,
                    expires: DateTime.UtcNow.AddDays(1),
                    signingCredentials: credentials
                );

            return new JwtSecurityTokenHandler().WriteToken(jwtConfig);
        }
    }
}
