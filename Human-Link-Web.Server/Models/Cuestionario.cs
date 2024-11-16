namespace Human_Link_Web.Server.Models;

public partial class Cuestionario
{
    public int IdCuestionario { get; set; }

    public int? Idcurso { get; set; }

    public List<string>? Urlcuestionario { get; set; }

    public virtual Curso? IdcursoNavigation { get; set; }
}
