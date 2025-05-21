export function isObject(value: unknown): value is object {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export class GeopluginError extends Error {
  statusCode?: number;
  subErrors?: string[];

  constructor(message: string, statusCode?: number) {
    super(message);

    this.name = "GeopluginError";
    this.statusCode = statusCode;
  }

  toString() {
    return (
      `${this.name}: ${this.message}` +
      (this.subErrors?.length ? `\n - ${this.subErrors.join("\n - ")}` : "")
    );
  }
}

export async function createGeopluginError(
  res: Response
): Promise<GeopluginError> {
  try {
    const body: unknown = await res.clone().json();
    if (
      isObject(body) &&
      "error" in body &&
      typeof (body as any).error === "string"
    ) {
      const err = new GeopluginError(
        (body as any).error || res.statusText,
        res.status
      );

      return err;
    }
  } catch (err: unknown) {
    // Do nothing.
  }

  return new GeopluginError(res.statusText, res.status);
}
