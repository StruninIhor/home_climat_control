﻿// <auto-generated />
using System;
using HomeClimatControl.Web.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace HomeClimatControl.Web.Migrations
{
    [DbContext(typeof(ClimatDbContext))]
    partial class ClimatDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "3.1.3");

            modelBuilder.Entity("HomeClimatControl.Web.Domain.Entities.SensorRecord", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<DateTime>("Date")
                        .HasColumnType("TEXT");

                    b.Property<float?>("Humidity")
                        .HasColumnType("REAL");

                    b.Property<float?>("Pressure")
                        .HasColumnType("REAL");

                    b.Property<float?>("Temperature")
                        .HasColumnType("REAL");

                    b.HasKey("Id");

                    b.ToTable("SensorRecords");
                });
#pragma warning restore 612, 618
        }
    }
}