import z from "zod";
const changeStatusValidation = z.object({
    body: z.object({
        status: z.enum(['in-progress', 'blocked'])
    })

});

export const UserValidations = {
    changeStatusValidation
};