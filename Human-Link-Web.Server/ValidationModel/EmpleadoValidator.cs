namespace Human_Link_Web.Server.ValidationModel
{
    using FluentValidation;
    using Human_Link_Web.Server.Models;

    public class EmpleadoValidator : AbstractValidator<Empleado>
    {
        public EmpleadoValidator()
        {
            RuleFor(e => e.Nombre)
                .NotEmpty().WithMessage("El nombre es obligatorio.")
                .Length(1, 100).WithMessage("El nombre debe tener entre 1 y 100 caracteres.");

            RuleFor(e => e.Cargo)
                .NotEmpty().WithMessage("El cargo es obligatorio.")
                .Length(1, 50).WithMessage("El cargo debe tener entre 1 y 50 caracteres.");

            RuleFor(e => e.Salario)
                .GreaterThanOrEqualTo(0).WithMessage("El salario debe ser un valor positivo .");

            RuleFor(e => e.Departamento)
                .NotEmpty().WithMessage("El departamento es obligatorio.");

            RuleFor(e => e.Fechacontratacion)
                .NotNull().WithMessage("La fecha de contratación es obligatoria.")
                .LessThanOrEqualTo(DateOnly.FromDateTime(DateTime.Now)).WithMessage("La fecha de contratación no puede ser posterior a la fecha actual.");

            RuleFor(e => e.Fechaterminacioncontrato)
                .GreaterThanOrEqualTo(DateOnly.FromDateTime(DateTime.Now)).WithMessage("La fecha de terminación del contrato debe ser posterior a la fecha de contratación.");
        }
    }

}
