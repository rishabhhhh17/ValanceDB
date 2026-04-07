// Search Logic

export const searchDeals = (deals, query, filters) => {
  let result = deals;

  // 1. Text Search
  if (query) {
    const lowerQuery = query.toLowerCase();
    result = result.filter(deal => {
      // Check basic string fields
      const namesMatch = deal.name.toLowerCase().includes(lowerQuery) || deal.client.toLowerCase().includes(lowerQuery);
      
      // Check team array
      const teamMatch = deal.team.some(member => member.toLowerCase().includes(lowerQuery));
      
      // Check files
      const filesMatch = deal.files.some(file => file.toLowerCase().includes(lowerQuery));
      
      // Check tags
      const tagsMatch = deal.tags.some(tag => tag.toLowerCase().includes(lowerQuery));
      
      // Check sector
      const sectorMatch = deal.sector.toLowerCase().includes(lowerQuery);

      return namesMatch || teamMatch || filesMatch || tagsMatch || sectorMatch;
    });
  }

  // 2. Exact Filters
  if (filters.type && filters.type !== "All") {
    result = result.filter(deal => deal.type === filters.type);
  }
  
  if (filters.sector && filters.sector !== "All") {
    result = result.filter(deal => deal.sector === filters.sector);
  }
  
  if (filters.status && filters.status !== "All") {
    result = result.filter(deal => deal.status === filters.status);
  }

  return result;
};

// Returns unique value lists for filter dropdowns
export const getFilterOptions = (deals) => {
  return {
    types: ["All", ...new Set(deals.map(d => d.type))],
    sectors: ["All", ...new Set(deals.map(d => d.sector))],
    statuses: ["All", ...new Set(deals.map(d => d.status))]
  };
};
