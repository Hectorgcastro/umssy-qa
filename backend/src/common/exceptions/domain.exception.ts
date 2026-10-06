export abstract class DomainException extends Error {
  constructor(
    message: string,
    readonly statusCode: number,
    readonly code?: string, //añadido
  ) {
    super(message);
    this.name = new.target.name;
  }
}
