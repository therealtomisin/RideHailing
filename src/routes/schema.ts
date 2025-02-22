import Joi from "joi";

const driver = Joi.string().messages({
  "string.required": "Driver is required!",
});
const id = Joi.string().messages({
  "string.required": "Driver is required!",
});
const rider = Joi.string().messages({
  "string.required": "Driver is required!",
});
const pickupLocation = Joi.object().keys({
  lat: Joi.number().required().messages({
    "number.required": "Latitude is required!",
  }),
  long: Joi.number().required().messages({
    "number.required": "Longitude is required!",
  }),
  address: Joi.string().optional(),
});
const dropoffLocation = Joi.object({
  lat: Joi.number().required().messages({
    "number.required": "Latitude is required!",
  }),
  long: Joi.number().required().messages({
    "number.required": "Longitude is required!",
  }),
  address: Joi.string().optional(),
});
const status = Joi.string().valid(
  "PENDING",
  "ACCEPTED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED"
);

export default {
  createRide: Joi.object().keys({
    rider,
    pickupLocation,
    dropoffLocation,
  }),
  updateRide: Joi.object().keys({
    id,
    rider,
    driver,
    pickupLocation,
    dropoffLocation,
    status,
  }),
};
