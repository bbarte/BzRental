using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BzRental.DbAccess.Migrations
{
    /// <inheritdoc />
    public partial class MakeTheDailyPriceInProductRentingsNullable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<decimal>(
                name: "DailyPrice",
                table: "ProductRentings",
                type: "decimal(19,2)",
                precision: 19,
                scale: 2,
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(19,2)",
                oldPrecision: 19,
                oldScale: 2);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<decimal>(
                name: "DailyPrice",
                table: "ProductRentings",
                type: "decimal(19,2)",
                precision: 19,
                scale: 2,
                nullable: false,
                defaultValue: 0m,
                oldClrType: typeof(decimal),
                oldType: "decimal(19,2)",
                oldPrecision: 19,
                oldScale: 2,
                oldNullable: true);
        }
    }
}
