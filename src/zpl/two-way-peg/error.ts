// TODO: Implement custom error
class TwoWayPegError extends Error {
  public errorCode: number;
  public errorName: string;
  public errorMessage: string;

  constructor(error: object) {
    const _errorCode = 0;
    const _errorName = "Something went wrong";
    const _errorMessage = "Something went wrong";

    if (error instanceof Error) {
      console.error(error);
    }

    super(_errorMessage);

    this.errorCode = _errorCode;
    this.errorName = _errorName;
    this.errorMessage = _errorMessage;
  }
}

export default TwoWayPegError;
