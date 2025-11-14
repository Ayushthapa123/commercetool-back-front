/* A mapping of countries to their respective provinces.
  Each country key maps to an array of provinces, including the first, middle, and last entries for sampling.*/
const countryProvinceMap = {
  // TODO had to comment out other countries because only UK is supported with GBP currency.
  // Netherlands: [
  //   "Drenthe", // First province
  //   "North Brabant", // Middle province
  //   "South Holland", // Last province
  // ],
  // Spain: ["Álava/Araba", "Gipuzkoa", "Bizkaia"],
  // France: [
  //   "Auvergne-Rhône-Alpes",
  //   "Hauts-de-France",
  //   "Provence-Alpes-Côte-d’Azur",
  // ],
  // Italy: ["Abruzzo", "Lombardy", "Veneto"],
  "United Kingdom": ["Cambridgeshire", "Central Bedfordshire", "Wrexham"],
  // Germany: ["Baden-Württemberg", "Lower Saxony", "Thuringia"],
  // Belgium: ["Antwerp", "Limburg", "West Flanders"],
};

export default countryProvinceMap;
