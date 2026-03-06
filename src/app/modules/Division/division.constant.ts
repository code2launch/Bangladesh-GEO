export const divisionFilterableFields = [
  "searchTerm",
  "bbsCode",
  "nameEn",
  "nameBn",
];

export const divisionSearchableFields = ["nameEn", "nameBn", "bbsCode"];

export const divisionIncludes = {
  _count: {
    select: {
      districts: true,
      upazilas: true,
      postOffices: true,
    },
  },
};
