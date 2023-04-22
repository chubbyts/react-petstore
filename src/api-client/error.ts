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
  details?: Object;
}

export class HttpErrorWithInvalidParameters extends HttpError {
  invalidParameters: Array<InvalidParameter>;
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
    this.invalidParameters = invalidParameters ?? [];
  }
}

export class BadRequest extends HttpErrorWithInvalidParameters {}

export class InternalServerError extends HttpError {}

export class NetworkError extends HttpError {}

export class NotFound extends HttpError {}

export class UnprocessableEntity extends HttpErrorWithInvalidParameters {}
