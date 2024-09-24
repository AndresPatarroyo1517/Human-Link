using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Human_Link_Web.Server.Models;

public partial class HumanLinkContext : DbContext
{
    public HumanLinkContext()
    {
    }

    public HumanLinkContext(DbContextOptions<HumanLinkContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Curso> Cursos { get; set; }

    public virtual DbSet<Cursousuario> Cursousuarios { get; set; }

    public virtual DbSet<Empleado> Empleados { get; set; }

    public virtual DbSet<Nomina> Nominas { get; set; }

    public virtual DbSet<Usuario> Usuarios { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseNpgsql("Host=ep-empty-grass-a5tf5v7l.us-east-2.aws.neon.tech;port=5432;Username=HumanLink_owner;Password=WTaAkc0Uh3XY;Database=HumanLink");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Curso>(entity =>
        {
            entity.HasKey(e => e.Idcurso).HasName("cursos_pkey");

            entity.ToTable("cursos");

            entity.Property(e => e.Idcurso).HasColumnName("idcurso");
            entity.Property(e => e.Categoria)
                .HasMaxLength(10)
                .HasColumnName("categoria");
            entity.Property(e => e.Descripcion)
                .HasMaxLength(200)
                .HasColumnName("descripcion");
            entity.Property(e => e.Duracion).HasColumnName("duracion");
            entity.Property(e => e.Nombrecurso)
                .HasMaxLength(50)
                .HasColumnName("nombrecurso");
            entity.Property(e => e.Url)
                .HasMaxLength(100)
                .HasColumnName("url");
        });

        modelBuilder.Entity<Cursousuario>(entity =>
        {
            entity.HasKey(e => e.Idcuremp).HasName("cursousuario_pkey");

            entity.ToTable("cursousuario");

            entity.Property(e => e.Idcuremp).HasColumnName("idcuremp");
            entity.Property(e => e.Fechainicio).HasColumnName("fechainicio");
            entity.Property(e => e.Idcurso).HasColumnName("idcurso");
            entity.Property(e => e.Idusuario).HasColumnName("idusuario");
            entity.Property(e => e.Progreso).HasColumnName("progreso");

            entity.HasOne(d => d.IdcursoNavigation).WithMany(p => p.Cursousuarios)
                .HasForeignKey(d => d.Idcurso)
                .HasConstraintName("cursousuario_idcurso_fkey");

            entity.HasOne(d => d.IdusuarioNavigation).WithMany(p => p.Cursousuarios)
                .HasForeignKey(d => d.Idusuario)
                .HasConstraintName("cursousuario_idusuario_fkey");
        });

        modelBuilder.Entity<Empleado>(entity =>
        {
            entity.HasKey(e => e.Idempleado).HasName("empleado_pkey");

            entity.ToTable("empleado");

            entity.Property(e => e.Idempleado).HasColumnName("idempleado");
            entity.Property(e => e.Cargo)
                .HasMaxLength(20)
                .HasColumnName("cargo");
            entity.Property(e => e.Departamento)
                .HasMaxLength(30)
                .HasColumnName("departamento");
            entity.Property(e => e.EmpleadoUsuario).HasColumnName("empleado_usuario");
            entity.Property(e => e.Fechacontratacion).HasColumnName("fechacontratacion");
            entity.Property(e => e.Fechaterminacioncontrato).HasColumnName("fechaterminacioncontrato");
            entity.Property(e => e.Nombre)
                .HasMaxLength(50)
                .HasColumnName("nombre");
            entity.Property(e => e.Salario).HasColumnName("salario");

            entity.HasOne(d => d.EmpleadoUsuarioNavigation).WithMany(p => p.Empleados)
                .HasForeignKey(d => d.EmpleadoUsuario)
                .HasConstraintName("empleado_empleado_usuario_fkey");
        });

        modelBuilder.Entity<Nomina>(entity =>
        {
            entity.HasKey(e => e.Idnomina).HasName("nomina_pkey");

            entity.ToTable("nomina");

            entity.Property(e => e.Idnomina).HasColumnName("idnomina");
            entity.Property(e => e.Bonificacion).HasColumnName("bonificacion");
            entity.Property(e => e.Horasextra).HasColumnName("horasextra");
            entity.Property(e => e.Idempleado).HasColumnName("idempleado");
            entity.Property(e => e.Totalnomina).HasColumnName("totalnomina");

            entity.HasOne(d => d.IdempleadoNavigation).WithMany(p => p.Nominas)
                .HasForeignKey(d => d.Idempleado)
                .HasConstraintName("nomina_idempleado_fkey");
        });

        modelBuilder.Entity<Usuario>(entity =>
        {
            entity.HasKey(e => e.Idusuario).HasName("usuario_pkey");

            entity.ToTable("usuario");

            entity.Property(e => e.Idusuario).HasColumnName("idusuario");
            entity.Property(e => e.Correo)
                .HasMaxLength(50)
                .HasColumnName("correo");
            entity.Property(e => e.Emailverificationtoken)
                .HasMaxLength(255)
                .HasColumnName("emailverificationtoken");
            entity.Property(e => e.Failedloginattempts)
                .HasDefaultValue(0)
                .HasColumnName("failedloginattempts");
            entity.Property(e => e.Isadmin).HasColumnName("isadmin");
            entity.Property(e => e.Isemailverified)
                .HasDefaultValue(false)
                .HasColumnName("isemailverified");
            entity.Property(e => e.Islockedout)
                .HasDefaultValue(false)
                .HasColumnName("islockedout");
            entity.Property(e => e.Lockoutend)
                .HasColumnType("timestamp without time zone")
                .HasColumnName("lockoutend");
            entity.Property(e => e.Passwordhash)
                .HasMaxLength(255)
                .HasColumnName("passwordhash");
            entity.Property(e => e.Passwordresettoken)
                .HasMaxLength(255)
                .HasColumnName("passwordresettoken");
            entity.Property(e => e.Passwordresettokenexpiration)
                .HasColumnType("timestamp without time zone")
                .HasColumnName("passwordresettokenexpiration");
            entity.Property(e => e.Passwordsalt)
                .HasMaxLength(255)
                .HasColumnName("passwordsalt");
            entity.Property(e => e.Usuario1)
                .HasMaxLength(30)
                .HasColumnName("usuario");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
