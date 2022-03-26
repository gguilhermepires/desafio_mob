// export declare class UserNotFound {
//   public message: string;
//   public name: string;
//   public stack: string;
//   constructor(message?: string);
// }

export class UserNotFound {
  constructor(message: string) {
    const error = Error(message);
    Object.defineProperty(error, 'message', { get() {return message; } });
    Object.defineProperty(error, 'name', { get() {return 'UserNotFound'; } });
    Error.captureStackTrace(error, UserNotFound);
    return error;
  }
}
export class InvalidUserProfile {
  constructor(message: string) {
    const error = Error(message);
    Object.defineProperty(error, 'message', { get() {return message; } });
    Object.defineProperty(error, 'name', { get() {return 'InvalidUserProfile'; } });
    Error.captureStackTrace(error, UserNotFound);
    return error;
  }
}

