class HttpError {
  title: string;
  detail?: string;
  instance?: string;
  constructor({ title, detail, instance }: { title: string; detail?: string; instance?: string }) {
    this.title = title;
    this.detail = detail;
    this.instance = instance;
  }
}

export default HttpError;
