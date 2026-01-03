/**
 * Shared test utilities for verification scripts
 */

let failures = 0;
let passes = 0;

export function test(name, fn) {
  try {
    fn();
    console.log(`✅ PASS: ${name}`);
    passes++;
  } catch (error) {
    console.log(`❌ FAIL: ${name}`);
    console.log(`   ${error.message}`);
    failures++;
  }
}

export function expect(value) {
  return {
    toBe(expected) {
      if (value !== expected) {
        throw new Error(`Expected ${expected}, got ${value}`);
      }
    },
    toBeDefined() {
      if (value === undefined) {
        throw new Error('Expected value to be defined');
      }
    },
    toContain(item) {
      if (!Array.isArray(value) || !value.includes(item)) {
        throw new Error(`Expected array ${JSON.stringify(value)} to contain ${item}`);
      }
    },
    toMatch(regex) {
      if (!regex.test(value)) {
        throw new Error(`Expected ${value} to match ${regex}`);
      }
    }
  };
}

export function getTestStats() {
  return { failures, passes };
}

export function resetTestStats() {
  failures = 0;
  passes = 0;
}
