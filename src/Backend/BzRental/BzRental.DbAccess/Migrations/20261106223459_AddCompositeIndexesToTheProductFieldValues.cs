using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BzRental.DbAccess.Migrations
{
    /// <inheritdoc />
    public partial class AddCompositeIndexesToTheProductFieldValues : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_ProductFieldValues_FieldId",
                table: "ProductFieldValues");

            migrationBuilder.DropIndex(
                name: "IX_ProductFieldValues_ProductId",
                table: "ProductFieldValues");

            migrationBuilder.CreateIndex(
                name: "IX_ProductFieldValues_FieldId_ProductId",
                table: "ProductFieldValues",
                columns: new[] { "FieldId", "ProductId" });

            migrationBuilder.CreateIndex(
                name: "IX_ProductFieldValues_ProductId_FieldId",
                table: "ProductFieldValues",
                columns: new[] { "ProductId", "FieldId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_ProductFieldValues_FieldId_ProductId",
                table: "ProductFieldValues");

            migrationBuilder.DropIndex(
                name: "IX_ProductFieldValues_ProductId_FieldId",
                table: "ProductFieldValues");

            migrationBuilder.CreateIndex(
                name: "IX_ProductFieldValues_FieldId",
                table: "ProductFieldValues",
                column: "FieldId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductFieldValues_ProductId",
                table: "ProductFieldValues",
                column: "ProductId");
        }
    }
}
