import { formatHeartRate, validateEcgData, formatTimestamp, sanitizeInput } from '../lib/utils';

describe('Utility Functions', () => {
  describe('formatHeartRate', () => {
    it('test_format_heart_rate_low', () => {
      expect(formatHeartRate(45)).toBe('45 bpm');
    });

    it('test_format_heart_rate_normal', () => {
      expect(formatHeartRate(72.5)).toBe('73 bpm');
    });

    it('test_format_heart_rate_handles_null_or_undefined', () => {
      expect(formatHeartRate(null)).toBe('N/A');
      expect(formatHeartRate(undefined)).toBe('N/A');
    });
  });

  describe('validateEcgData', () => {
    it('test_validate_ecg_missing_heart_rate', () => {
      const dataWithoutHr = {
        dataPoints: [1, 2, 3],
        duration: 30
      };
      expect(validateEcgData(dataWithoutHr)).toBe(false);
    });

    it('test_validate_ecg_accepts_valid_data', () => {
      const validData = {
        heartRate: 75,
        dataPoints: [1, 2, 3],
        duration: 30
      };
      expect(validateEcgData(validData)).toBe(true);
    });

    it('test_validate_ecg_rejects_null_or_undefined_data', () => {
      expect(validateEcgData(null)).toBe(false);
      expect(validateEcgData(undefined)).toBe(false);
    });
  });

  describe('formatTimestamp', () => {
    it('test_timestamp_formats_readably', () => {
      const timestamp = new Date('2026-04-21T02:40:00Z');
      const formatted = formatTimestamp(timestamp);
      expect(formatted).not.toBe('Invalid Date');
      expect(typeof formatted).toBe('string');
      expect(formatted.length).toBeGreaterThan(0);
      expect(formatted).toMatch(/2026/); // check year presence
    });

    it('test_format_timestamp_handles_invalid_date', () => {
      expect(formatTimestamp('invalid-date')).toBe('Invalid Date');
    });
  });

  describe('sanitizeInput', () => {
    it('test_sanitize_removes_dangerous_characters', () => {
      expect(sanitizeInput('<script>alert("xss")</script>')).toBe('scriptalert("xss")/script');
    });

    it('test_sanitize_input_trims_whitespace', () => {
      expect(sanitizeInput('   hello world   ')).toBe('hello world');
    });

    it('test_sanitize_input_handles_non_string_input', () => {
      // @ts-ignore
      expect(sanitizeInput(null)).toBe('');
    });
  });
});
