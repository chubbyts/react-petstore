export class HttpError {
  // http status code, undefined if there was no response (e.g. network error)
  readonly status?: number;
  title: string;
  detail?: string;
  instance?: string;
  constructor({ title, detail, instance }: { title: string; detail?: string; instance?: string }) {
    // oxlint-disable functional/immutable-data
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
    // oxlint-disable-next-line functional/immutable-data
    this.invalidParameters = invalidParameters;
  }
}

export class BadRequest extends BadRequestOrUnprocessableEntity {
  override readonly status = 400;
}

export class InternalServerError extends HttpError {
  override readonly status = 500;
}

export class NetworkError extends HttpError {}

export class NotFound extends HttpError {
  override readonly status = 404;
}

export class Unauthorized extends HttpError {
  override readonly status = 401;
}

export class UnprocessableEntity extends BadRequestOrUnprocessableEntity {
  override readonly status = 422;
}

export const createInvalidParametersByName = (
  httpErrorOrUndefined: HttpError | undefined,
): Map<string, Array<InvalidParameter>> => {
  return (
    httpErrorOrUndefined && httpErrorOrUndefined instanceof BadRequestOrUnprocessableEntity
      ? (httpErrorOrUndefined.invalidParameters ?? [])
      : []
  ).reduce((map: Map<string, Array<InvalidParameter>>, invalidParameter: InvalidParameter) => {
    // oxlint-disable-next-line functional/immutable-data
    map.set(invalidParameter.name, [...(map.get(invalidParameter.name) ?? []), invalidParameter]);

    return map;
  }, new Map<string, Array<InvalidParameter>>());
};
