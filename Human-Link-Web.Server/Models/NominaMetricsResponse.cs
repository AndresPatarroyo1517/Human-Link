namespace Human_Link_Web.Server.Models
{
    public class NominaMetricsResponse
    {
        public decimal TotalNomina { get; set; }
        public decimal PromedioHorasExtras { get; set; }
        public decimal TotalBonificacion { get; set; }
        public int EmpleadosSinBonificacion { get; set; }
        public int EmpleadosConBonificacion { get; set; }
        public int EmpleadosSinHorasExtras { get; set; }
        public int EmpleadosConHorasExtras { get; set; }
        public decimal PorcentajeEmpleadosSinBonificacion { get; set; }
        public decimal PorcentajeEmpleadosConBonificacion { get; set; }
        public decimal PorcentajeEmpleadosSinHorasExtras { get; set; }
        public decimal PorcentajeEmpleadosConHorasExtras { get; set; }
    }
}
