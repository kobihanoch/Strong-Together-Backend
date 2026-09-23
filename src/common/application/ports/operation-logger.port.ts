/** Records operational events from application use cases. */
export abstract class OperationLogger {
  abstract info(context: object, message: string): void;
  abstract warn(context: object, message: string): void;
  abstract error(context: object, message: string): void;
}
