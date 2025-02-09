import Ajv, { Schema } from "ajv";
import { error } from "console";

const ajv = new Ajv();

export const ValidateRequest = <T>(reqBody: unknown, schema: Schema) => {
  const validatedData = ajv.compile<T>(schema);

  if (validatedData(reqBody)) {
    return false;
  }

  const errors = validatedData.errors?.map((error: any) => error.message);

  return errors && errors[0];
};
