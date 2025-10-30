import Joi from "joi";


export const createReportSchema = Joi.object({
  articleId: Joi.string().required(),
  raison: Joi.string().valid(...REPORT_RAISONS).required(),
  details: Joi.string().allow("").max(1000),
});
