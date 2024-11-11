using FluentValidation;
using Human_Link_Web.Server.Models;

namespace Human_Link_Web.Server.ValidationModel
{
    public class NominaValidator : AbstractValidator<Nomina>
    {
        public NominaValidator()
        {

            RuleFor(n => n.Idnomina)
                .NotNull().WithMessage("El campo Idnomina es requerido.")
                .GreaterThan(0).WithMessage("El campo Idnomina debe ser mayor que 0.");

            RuleFor(n => n.Bonificacion)
                .GreaterThanOrEqualTo(0).WithMessage("La bonificación debe ser mayor que 0.");

            RuleFor(n => n.Horasextra)
                .GreaterThanOrEqualTo(0).WithMessage("Las horas extra deben ser un valor positivo.");

            RuleFor(n => n.Totalnomina)
                .GreaterThanOrEqualTo(0).WithMessage("El total de la nómina debe ser un valor positivo .");

            RuleFor(n => n.Idempleado)
                .GreaterThan(0).WithMessage("El Id del empleado debe ser un valor positivo.");
        }
    }
}
