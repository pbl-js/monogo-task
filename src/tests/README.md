# Testing Documentation

This project uses [Vitest](https://vitest.dev/) for testing.

## Running Tests

You can run tests using the following npm scripts:

- `npm test` - Run all tests once
- `npm run test:watch` - Run tests in watch mode (tests will re-run when files change)
- `npm run test:ui` - Run tests with the Vitest UI

## Test Structure

Tests are organized in `__tests__` directories next to the code they're testing. For example:

- `src/utils/validation.ts` - Source code
- `src/utils/__tests__/validation.test.ts` - Tests for validation.ts

## Writing Tests

When writing tests, follow these conventions:

1. Use descriptive test names that explain what the test is checking
2. Group related tests using `describe` blocks
3. Use `it` for individual test cases
4. Use `expect` with appropriate matchers for assertions

Example:

```typescript
import { describe, it, expect } from 'vitest';
import { someFunction } from '../someFile';

describe('someFunction', () => {
  it('should return expected result when given valid input', () => {
    const result = someFunction('valid input');
    expect(result).toBe(expectedValue);
  });

  it('should throw an error when given invalid input', () => {
    expect(() => someFunction(null)).toThrow();
  });
});
```

## Test Coverage

To run tests with coverage reporting:

```bash
npm test -- --coverage
```

This will generate a coverage report in the `coverage` directory.
