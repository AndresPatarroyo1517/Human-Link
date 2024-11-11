namespace Human_Link_Web.Server.ValidationModel
{
    using FluentValidation;
    using Human_Link_Web.Server.Models;

    public class CursoValidator : AbstractValidator<Curso>
    {
        public CursoValidator()
        {
            RuleFor(c => c.Nombrecurso)
                .NotEmpty().WithMessage("El nombre del curso es obligatorio.")
                .Length(1, 200).WithMessage("El nombre del curso debe tener entre 1 y 200 caracteres.");

            RuleFor(c => c.Descripcion)
                .NotEmpty().WithMessage("La descripción es obligatoria.")
                .Length(1, 500).WithMessage("La descripción debe tener entre 1 y 500 caracteres.");

            RuleFor(c => c.Duracion)
                .GreaterThan(0).WithMessage("La duración del curso debe ser mayor que 0.");


            RuleFor(c => c.Categoria)
                .NotEmpty().WithMessage("La categoría del curso es obligatoria.");

            RuleFor(c => c.Url)
                .NotNull().WithMessage("Las URLs son obligatorias.");
        }
    }

}
