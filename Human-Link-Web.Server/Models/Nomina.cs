using System;
using System.Collections.Generic;

namespace Human_Link_Web.Server.Models;

public partial class Nomina
{
    public int Idnomina { get; set; }

    public int? Bonificacion { get; set; }

    public int? Horasextra { get; set; }

    public int? Totalnomina { get; set; }

    public int? Idempleado { get; set; }

    public virtual Empleado? IdempleadoNavigation { get; set; }
}
