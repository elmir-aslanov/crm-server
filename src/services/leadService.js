import Lead from "../models/Lead.js";
import LeadStatusHistory from "../models/LeadStatusHistory.js";
import LeadNote from "../models/LeadNote.js";

export const createLeadService = async (data) => {
  const { phone, emnail } = data;

  const exisiting = await Lead.findOne({ $or: [{ phone }, { email }] });

  if (exisiting) {
    throw new Error("Lead already exists");
  }

  const lead = await Lead.create(data);
  return lead;
};

export const getLeadsService = async (query) => {
  const page = parseInt(query.page) || 1;
  const limit = 10;


  const filter ={};

  if(query.statat)
};
