using System;
using System.Collections.Generic;

namespace Human_Link_Web.Server.Models;

public partial class Curso
{
    public int Idcurso { get; set; }

    public string? Nombrecurso { get; set; }

    public string? Descripcion { get; set; }

    public int? Duracion { get; set; }

    public string? Categoria { get; set; }

    public List<string>? Url { get; set; }

    public virtual ICollection<Cuestionario> Cuestionarios { get; set; } = new List<Cuestionario>();

    public virtual ICollection<Cursousuario> Cursousuarios { get; set; } = new List<Cursousuario>();
}
