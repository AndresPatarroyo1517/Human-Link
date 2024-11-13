namespace Human_Link_Web.Server.ValidationModel
{
    using FluentValidation;
    using Human_Link_Web.Server.Models;

    public class UsuarioValidator : AbstractValidator<Usuario>
    {
        public UsuarioValidator()
        {
            RuleFor(u => u.Usuario1)
                .NotEmpty().WithMessage("El nombre de usuario es obligatorio.")
                .Length(3, 50).WithMessage("El nombre de usuario debe tener entre 3 y 50 caracteres.");

            RuleFor(u => u.Correo)
                .NotEmpty().WithMessage("El correo electrónico es obligatorio.")
                .EmailAddress().WithMessage("El correo electrónico no tiene un formato válido.");

            RuleFor(u => u.Isadmin)
                .NotNull();

            RuleFor(u => u.Isemailverified)
                .NotNull();

            RuleFor(u => u.Clave)
                .NotEmpty().WithMessage("La clave es obligatoria.")
                .MinimumLength(3).WithMessage("La clave debe tener al menos 3 caracteres.");
        }
    }

}
