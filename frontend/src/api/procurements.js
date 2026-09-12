import apiClient from "./client";

export const submitProcurement = ({
  surveyNumber,
  crop,
  expectedWeightQuintals,
  bankAccountNumber,
  ifsc,
}) =>
  apiClient.post("/procurements", {
    surveyNumber,
    crop,
    expectedWeightQuintals: Number(expectedWeightQuintals),
    bankAccountNumber,
    ifsc,
  });

export const getMyProcurements = () => apiClient.get("/procurements/mine");
