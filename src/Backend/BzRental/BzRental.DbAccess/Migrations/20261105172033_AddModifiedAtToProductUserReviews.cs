using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BzRental.DbAccess.Migrations
{
    /// <inheritdoc />
    public partial class AddModifiedAtToProductUserReviews : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "ModifiedAt",
                table: "ProductUserReviews",
                type: "datetime",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ModifiedAt",
                table: "ProductUserReviews");
        }
    }
}
