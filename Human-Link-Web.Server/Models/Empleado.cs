namespace Human_Link_Web.Server.Models;

public partial class Empleado
{
    public int Idempleado { get; set; }

    public string? Nombre { get; set; }

    public string? Cargo { get; set; }

    public int? Salario { get; set; }

    public string? Departamento { get; set; }

    public DateOnly? Fechacontratacion { get; set; }

    public DateOnly? Fechaterminacioncontrato { get; set; }

    public int? EmpleadoUsuario { get; set; }

    public virtual Usuario? EmpleadoUsuarioNavigation { get; set; }

    public virtual ICollection<Nomina> Nominas { get; set; } = new List<Nomina>();
}
