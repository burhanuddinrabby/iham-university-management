import status from "http-status";
import { ZodError } from "zod";
import { TErrorSources, TGenericErrorResponse } from "../interfaces/error.type";

const handleZodError = (err: ZodError): TGenericErrorResponse => {
    const statusCode = status.BAD_REQUEST;
    const errorSources: TErrorSources = err.issues.map((issue) => {
        return {
            errorPath: String(issue?.path[issue.path.length - 1]),
            errorMessage: issue?.message
        };
    });

    return {
        statusCode,
        message: 'Validation Error',
        errorSources
    }
}

export default handleZodError;