namespace Human_Link_Web.Server.Models;

public partial class Usuario
{
    public int Idusuario { get; set; }

    public string? Usuario1 { get; set; }

    public string? Correo { get; set; }

    public bool? Isadmin { get; set; }

    public bool? Isemailverified { get; set; }

    public string? Clave { get; set; }

    public virtual ICollection<Cursousuario> Cursousuarios { get; set; } = new List<Cursousuario>();

    public virtual ICollection<Empleado> Empleados { get; set; } = new List<Empleado>();
}
