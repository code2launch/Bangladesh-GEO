export const postOfficeFilterableFields = [
  "searchTerm",
  "nameEn",
  "postCode",
  "upazilaName",
  "divisionId",
  "districtId",
  "upazilaId",
];

export const postOfficeSearchableFields = ["nameEn", "postCode", "upazilaName"];

export const postOfficeIncludes = {
  division: {
    select: { id: true, nameEn: true, nameBn: true },
  },
  district: {
    select: { id: true, nameEn: true, nameBn: true },
  },
  upazila: {
    select: { id: true, nameEn: true, nameBn: true },
  },
};
