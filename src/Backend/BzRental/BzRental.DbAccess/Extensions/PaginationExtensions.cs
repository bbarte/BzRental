using Microsoft.EntityFrameworkCore;
using BzRental.Shared.Contracts.Dtos;
using BzRental.Shared.Pagination;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.DbAccess.Extensions
{
    public static class PaginationExtensions
    {
        /// <summary>
        /// Paginates the provided IQueryable according to the provided pagination parameters.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="query"></param>
        /// <param name="pagination"></param>
        /// <returns></returns>
        public static IQueryable<T> Paginate<T>(
            this IQueryable<T> query,
            PaginationParameters pagination)
        {
            return query
                .Skip((pagination.PageNumber - 1) * pagination.PageSize)
                .Take(pagination.PageSize + 1) // bo używamy next-page pagination
                .AsQueryable();
        }

        /// <summary>
        /// <para>Converts the specified IQueryable into a paginated list.</para>
        /// <para>
        /// <b>Note:</b> in order to paginate, the provided query must be ordered by at least
        /// one property, most preferably Id. If not, InvalidOperationException is thrown.
        /// </para>
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="query"></param>
        /// <param name="pagination"></param>
        /// <returns></returns>
        /// <exception cref="InvalidOperationException">
        /// Thrown when the provided query isn't ordered.
        /// </exception>
        public static async Task<PaginatedList<T>> ToPaginatedListAsync<T>(
            this IQueryable<T> query,
            PaginationParameters pagination)
        {
            List<T> items = await query.Paginate(pagination).ToListAsync();

            bool hasNextPage = items.Count > pagination.PageSize;

            if (hasNextPage)
                items.RemoveAt(items.Count - 1);

            PaginatedList<T> paginatedList = new PaginatedList<T>()
            {
                PageNumber = pagination.PageNumber,
                PageSize = pagination.PageSize,
                HasNextPage = hasNextPage,
                Items = items
            };

            return paginatedList;
        }
    }
}
