export class HttpError {
  title: string;
  detail?: string;
  instance?: string;
  constructor({ title, detail, instance }: { title: string; detail?: string; instance?: string }) {
    this.title = title;
    this.detail = detail;
    this.instance = instance;
  }
}

export interface InvalidParameter {
  name: string;
  reason: string;
  details?: { [key: string]: unknown };
}

export class BadRequestOrUnprocessableEntity extends HttpError {
  invalidParameters?: Array<InvalidParameter>;
  constructor({
    title,
    detail,
    instance,
    invalidParameters,
  }: {
    title: string;
    detail?: string;
    instance?: string;
    invalidParameters?: Array<InvalidParameter>;
  }) {
    super({ title, detail, instance });
    this.invalidParameters = invalidParameters;
  }
}

export class BadRequest extends BadRequestOrUnprocessableEntity {}

export class InternalServerError extends HttpError {}

export class NetworkError extends HttpError {}

export class NotFound extends HttpError {}

export class UnprocessableEntity extends BadRequestOrUnprocessableEntity {}

export const createInvalidParametersByName = (
  httpErrorOrUndefined: HttpError | undefined,
): Map<string, Array<InvalidParameter>> => {
  return (
    httpErrorOrUndefined && httpErrorOrUndefined instanceof BadRequestOrUnprocessableEntity
      ? httpErrorOrUndefined.invalidParameters ?? []
      : []
  ).reduce((map: Map<string, Array<InvalidParameter>>, invalidParameter: InvalidParameter) => {
    map.set(invalidParameter.name, [...(map.get(invalidParameter.name) ?? []), invalidParameter]);

    return map;
  }, new Map<string, Array<InvalidParameter>>());
};
