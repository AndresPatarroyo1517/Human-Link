﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Human_Link_Web.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Human_Link_Web.Server.Custom;

namespace Human_Link_Web.Server.Controllers
{
    [Route("HumanLink/[controller]")]
    [AllowAnonymous]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly HumanLinkContext _context;
        private readonly Utilidades _utilidades;

        public LoginController(HumanLinkContext context, Utilidades _utilidades)
        {
            this._context = context;
            this._utilidades = _utilidades;
        }

        // POST: api/Login
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Usuario>> PostLogin(Login userLogin)
        {
            //var user = await _context.Usuarios.FindAsync(usuario.Idusuario);
            Console.WriteLine(userLogin.Usuario);
            var user = await _context.Usuarios.FirstOrDefaultAsync(u => u.Usuario1 == userLogin.Usuario);
            Console.WriteLine(user);
            if (user == null)
            {
                return NotFound("Usuario y/o clave incorrectos Usuario");
            }

            // Cambiar comparacion cuando se implemente la encriptación
            var claveValida = user.Clave == userLogin.Clave ? true : false;
            if (!claveValida)
            {
                //return Unauthorized("Clave incorrecta");
                return NotFound("Usuario y/o clave incorrectos Clave");
            }

            // Antes de retornar OK, implementar la creacion de token de sesion, como JWT
            var sesion = new
            {
                mensaje = "Acceso concedido",
                usuario = user.Usuario1,
                token = _utilidades.generarJWT(user)
            };

            return Ok(sesion);
        }

    }
}
