import { RequestValidationException } from '../exceptions/request-validation.exception.js';
import type { ValidationIssue } from '../types/validation-issue.type.js';

function formatPath(path: ValidationIssue['path']): string {
  return (path ?? [])
    .map((segment) => (typeof segment === 'object' ? segment.key : segment))
    .map(String)
    .join('.');
}

// exceptionFactory for StandardSchemaValidationPipe: turns schema issues into a DomainException.
export function buildRequestValidationException(
  issues: readonly ValidationIssue[],
): RequestValidationException {
  const detail = issues
    .map((issue) => {
      const path = formatPath(issue.path);
      return path ? `${path}: ${issue.message}` : issue.message;
    })
    .join('; ');

  return new RequestValidationException(detail);
}
