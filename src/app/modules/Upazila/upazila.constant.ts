export const upazilaFilterableFields = [
  "searchTerm",
  "bbsCode",
  "nameEn",
  "nameBn",
  "districtId",
  "divisionId",
];

export const upazilaSearchableFields = ["nameEn", "nameBn", "bbsCode"];

export const upazilaIncludes = {
  district: {
    select: { id: true, nameEn: true, nameBn: true },
  },
  division: {
    select: { id: true, nameEn: true, nameBn: true },
  },
  _count: {
    select: { postOffices: true },
  },
};
