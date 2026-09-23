import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

/** Represents the parse success value. */
type ParseSuccess = {
  success: true;
  data: {
    body?: unknown;
    query?: unknown;
    params?: unknown;
  };
};

/** Represents the parse failure value. */
type ParseFailure = {
  success: false;
  error: {
    issues?: Array<{ message?: string }>;
  };
};

/** Represents the compatible schema value. */
type CompatibleSchema = {
  safeParse(input: unknown): ParseSuccess | ParseFailure;
};

@Injectable()
export class ValidateRequestPipe implements PipeTransform {
  constructor(private readonly schema: CompatibleSchema) {}
  transform(value: unknown) {
    const result = this.schema.safeParse(value);

    if (!result.success) {
      throw new BadRequestException(result.error.issues?.[0]?.message || 'Invalid Input');
    }

    return result.data;
  }
}
