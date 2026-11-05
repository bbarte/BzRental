using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BzRental.DbAccess.Migrations
{
    /// <inheritdoc />
    public partial class RenameHourPriceToDailyPriceOnProducts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "HourPrice",
                table: "Products",
                newName: "DailyPrice");

            migrationBuilder.RenameIndex(
                name: "IX_Products_HourPrice",
                table: "Products",
                newName: "IX_Products_DailyPrice");

            migrationBuilder.RenameColumn(
                name: "HourPrice",
                table: "ProductRentings",
                newName: "DailyPrice");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "DailyPrice",
                table: "Products",
                newName: "HourPrice");

            migrationBuilder.RenameIndex(
                name: "IX_Products_DailyPrice",
                table: "Products",
                newName: "IX_Products_HourPrice");

            migrationBuilder.RenameColumn(
                name: "DailyPrice",
                table: "ProductRentings",
                newName: "HourPrice");
        }
    }
}
