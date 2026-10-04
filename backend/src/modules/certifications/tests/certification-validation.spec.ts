import { describe, expect, it } from 'vitest';
import { RequestValidationException } from '../../../common/exceptions/request-validation.exception.js';
import { RequestValidationPipe } from '../../../common/pipes/request-validation.pipe.js';
import { CERTIFICATION_VALIDATION_MESSAGES } from '../constants/certification.constants.js';
import { createCertificationSchema } from '../requests/create-certification.request.js';
import { updateCertificationSchema } from '../requests/update-certification.request.js';

const validBody = {
  name: 'AWS Solutions Architect',
  issuingOrganization: 'Amazon',
  issueDate: '2024-05-10',
};

const createPipe = new RequestValidationPipe(createCertificationSchema);
const updatePipe = new RequestValidationPipe(updateCertificationSchema);

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function daysFromToday(days: number): string {
  return formatDate(new Date(Date.now() + days * 24 * 60 * 60 * 1000));
}

describe('Certification validation messages', () => {
  it('reports every required field in Spanish when the body is empty', () => {
    expect(
      createCertificationSchema.safeParse({
        name: '',
        issuingOrganization: '',
        issueDate: '',
      }).error?.issues,
    ).toEqual([
      expect.objectContaining({
        path: ['name'],
        message: CERTIFICATION_VALIDATION_MESSAGES.required,
      }),
      expect.objectContaining({
        path: ['issuingOrganization'],
        message: CERTIFICATION_VALIDATION_MESSAGES.required,
      }),
      expect.objectContaining({
        path: ['issueDate'],
        message: CERTIFICATION_VALIDATION_MESSAGES.required,
      }),
    ]);
  });

  it('returns the errors as field and message pairs through the pipe', () => {
    try {
      createPipe.transform({ ...validBody, name: '' });
      throw new Error('Expected the validation to fail');
    } catch (error) {
      expect(error).toBeInstanceOf(RequestValidationException);
      expect((error as RequestValidationException).errors).toEqual([
        { field: 'name', message: CERTIFICATION_VALIDATION_MESSAGES.required },
      ]);
    }
  });

  it('reports missing fields with the required message', () => {
    const issues = createCertificationSchema.safeParse({}).error?.issues;

    expect(issues?.map((issue) => issue.message)).toEqual([
      CERTIFICATION_VALIDATION_MESSAGES.required,
      CERTIFICATION_VALIDATION_MESSAGES.required,
      CERTIFICATION_VALIDATION_MESSAGES.required,
    ]);
  });

  it('reports only the affected field when a single field is invalid', () => {
    const issues = createCertificationSchema.safeParse({
      ...validBody,
      issueDate: '',
    }).error?.issues;

    expect(issues).toHaveLength(1);
    expect(issues?.[0]).toMatchObject({
      path: ['issueDate'],
      message: CERTIFICATION_VALIDATION_MESSAGES.required,
    });
  });

  it('rejects values made only of spaces', () => {
    const issues = createCertificationSchema.safeParse({
      ...validBody,
      name: '   ',
      issuingOrganization: '\t ',
    }).error?.issues;

    expect(issues?.map((issue) => issue.path[0])).toEqual([
      'name',
      'issuingOrganization',
    ]);
    expect(issues?.every((issue) => issue.message === CERTIFICATION_VALIDATION_MESSAGES.required)).toBe(true);
  });

  it('reports a single message for an invalid date', () => {
    for (const issueDate of ['not-a-date', '2025-02-30', '10/05/2024', '2024-5-1']) {
      const issues = createCertificationSchema.safeParse({
        ...validBody,
        issueDate,
      }).error?.issues;

      expect(issues).toHaveLength(1);
      expect(issues?.[0]?.message).toBe(
        CERTIFICATION_VALIDATION_MESSAGES.invalidDate,
      );
    }
  });
});

describe('Certification length limits', () => {
  it('accepts a name of 150 characters and rejects 151', () => {
    expect(
      createCertificationSchema.safeParse({
        ...validBody,
        name: 'a'.repeat(150),
      }).success,
    ).toBe(true);

    const issues = createCertificationSchema.safeParse({
      ...validBody,
      name: 'a'.repeat(151),
    }).error?.issues;

    expect(issues).toHaveLength(1);
    expect(issues?.[0]).toMatchObject({
      path: ['name'],
      message: CERTIFICATION_VALIDATION_MESSAGES.nameTooLong,
    });
  });

  it('accepts an organization of 100 characters and rejects 101', () => {
    expect(
      createCertificationSchema.safeParse({
        ...validBody,
        issuingOrganization: 'a'.repeat(100),
      }).success,
    ).toBe(true);

    const issues = createCertificationSchema.safeParse({
      ...validBody,
      issuingOrganization: 'a'.repeat(101),
    }).error?.issues;

    expect(issues).toHaveLength(1);
    expect(issues?.[0]).toMatchObject({
      path: ['issuingOrganization'],
      message: CERTIFICATION_VALIDATION_MESSAGES.organizationTooLong,
    });
  });

  it('counts the length after trimming the spaces', () => {
    expect(
      createCertificationSchema.safeParse({
        ...validBody,
        name: ` ${'a'.repeat(150)} `,
      }).success,
    ).toBe(true);
  });
});

describe('Certification issue date', () => {
  it('accepts today and rejects tomorrow', () => {
    const today = formatDate(new Date());

    expect(
      createCertificationSchema.safeParse({ ...validBody, issueDate: today })
        .success,
    ).toBe(true);

    const issues = createCertificationSchema.safeParse({
      ...validBody,
      issueDate: daysFromToday(2),
    }).error?.issues;

    expect(issues).toHaveLength(1);
    expect(issues?.[0]).toMatchObject({
      path: ['issueDate'],
      message: CERTIFICATION_VALIDATION_MESSAGES.futureDate,
    });
  });

  it('converts a valid date to a Date at midnight UTC', () => {
    const result = createPipe.transform(validBody);

    expect(result.issueDate).toBeInstanceOf(Date);
    expect(result.issueDate.toISOString()).toBe('2024-05-10T00:00:00.000Z');
  });
});

describe('Certification sanitization', () => {
  const hostileValues = [
    '<script>alert(1)</script>',
    "'; DROP TABLE certifications;--",
    'O\'Reilly "Cloud" <b>Architect</b>',
  ];

  it.each(hostileValues)(
    'keeps %s as plain text without altering it',
    (value) => {
      const result = createPipe.transform({
        ...validBody,
        name: value,
        issuingOrganization: value,
      });

      expect(result.name).toBe(value);
      expect(result.issuingOrganization).toBe(value);
    },
  );
});

describe('Certification validation when editing', () => {
  it('applies the same rules to the fields present in an update', () => {
    expect(updatePipe.transform({ name: ' Updated ' })).toEqual({
      name: 'Updated',
    });

    const issues = updateCertificationSchema.safeParse({
      name: '',
      issuingOrganization: 'a'.repeat(101),
      issueDate: daysFromToday(2),
    }).error?.issues;

    expect(issues?.map((issue) => issue.message)).toEqual([
      CERTIFICATION_VALIDATION_MESSAGES.required,
      CERTIFICATION_VALIDATION_MESSAGES.organizationTooLong,
      CERTIFICATION_VALIDATION_MESSAGES.futureDate,
    ]);
  });

  it('accepts the limits when editing', () => {
    expect(
      updateCertificationSchema.safeParse({
        name: 'a'.repeat(150),
        issuingOrganization: 'a'.repeat(100),
        issueDate: formatDate(new Date()),
      }).success,
    ).toBe(true);
  });
});
