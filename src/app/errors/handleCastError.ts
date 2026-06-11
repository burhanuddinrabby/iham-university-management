import mongoose from "mongoose";
import { TErrorSources, TGenericErrorResponse } from "../interfaces/error.type";
import status from "http-status";

const handleCastError = (err: mongoose.Error.CastError): TGenericErrorResponse => {
    const statusCode = status.BAD_REQUEST;
    const errorSources: TErrorSources = [{
        errorPath: err?.path,
        errorMessage: err?.message
    }]

    return {
        statusCode,
        message: 'Invalid Id',
        errorSources
    }
}

export default handleCastError;