using System;
using System.Collections.Generic;

namespace Human_Link_Web.Server.Models;

public partial class Cursousuario
{
    public int Idcuremp { get; set; }

    public int? Idusuario { get; set; }

    public int? Idcurso { get; set; }

    public int? Progreso { get; set; }

    public int[]? Notas { get; set; }

    public DateOnly? Fechainicio { get; set; }

    public List<int>? Notas { get; set; }

    public virtual Curso? IdcursoNavigation { get; set; }

    public virtual Usuario? IdusuarioNavigation { get; set; }
}
