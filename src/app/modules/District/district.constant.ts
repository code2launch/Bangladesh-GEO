export const districtFilterableFields = [
  "searchTerm",
  "bbsCode",
  "nameEn",
  "nameBn",
  "divisionId",
];

export const districtSearchableFields = ["nameEn", "nameBn", "bbsCode"];

export const districtIncludes = {
  division: {
    select: { id: true, nameEn: true, nameBn: true },
  },
  _count: {
    select: { upazilas: true, postOffices: true },
  },
};
