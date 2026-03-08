import { validatePhone, validateEmail, validateMemberCreate } from '../middleware/validator';
import { Request, Response } from 'express';

describe('Validator Middleware', () => {
  it('should validate phone numbers', () => {
    expect(validatePhone('13800138000')).toBe(true);
    expect(validatePhone('12345678901')).toBe(false);
    expect(validatePhone('abc')).toBe(false);
  });

  it('should validate emails', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('invalid')).toBe(false);
    expect(validateEmail('')).toBe(true); // Optional
  });

  it('should validate member creation', () => {
    const req = {
      body: { name: 'Test', phone: '13800138000', company: 'Test Co' }
    } as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
    const next = jest.fn();

    validateMemberCreate(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('should reject invalid member data', () => {
    const req = { body: { name: 'Test' } } as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
    const next = jest.fn();

    validateMemberCreate(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});