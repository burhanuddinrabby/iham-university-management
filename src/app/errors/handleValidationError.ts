import status from "http-status";
import { TErrorSources, TGenericErrorResponse } from "../interfaces/error.type";
import mongoose from "mongoose";

const handleValidationError = (err: mongoose.Error.ValidationError): TGenericErrorResponse => {
    const statusCode = status.BAD_REQUEST;
    const errorSources: TErrorSources = Object.values(err?.errors).map(
        (value: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
            return {
                errorPath: value.path,
                errorMessage: value.message
            }
        }
    );

    return {
        statusCode,
        message: 'Validation Error',
        errorSources
    }
}

export default handleValidationError;