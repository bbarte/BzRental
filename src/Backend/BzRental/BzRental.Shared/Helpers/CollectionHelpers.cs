using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Shared.Helpers
{
    public static class CollectionHelpers
    {
        public static List<int> GetNewIds(IEnumerable<int> updatedList, IEnumerable<int> oldList)
        {
            return updatedList.Except(oldList).ToList();
        }

        public static List<int> GetRemovedIds(IEnumerable<int> updatedList, IEnumerable<int> oldList)
        {
            return oldList.Except(updatedList).ToList();
        }
    }
}
