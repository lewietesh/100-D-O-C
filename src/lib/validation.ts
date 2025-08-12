// lib/validation.ts
export interface PasswordStrength {
  isValid: boolean;
  score: number; // 0-5
  feedback: string[];
  checks: {
    length: boolean;
    hasLetters: boolean;
    hasNumbers: boolean;
    hasSpecialChars: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
  };
}

export function validatePassword(password: string): PasswordStrength {
  const checks = {
    length: password.length >= 8,
    hasLetters: /[a-zA-Z]/.test(password),
    hasNumbers: /[0-9]/.test(password),
    hasSpecialChars: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
  };

  const feedback: string[] = [];
  let score = 0;

  if (!checks.length) {
    feedback.push('Password must be at least 8 characters long');
  } else {
    score += 1;
  }

  if (!checks.hasLetters) {
    feedback.push('Password must contain letters');
  } else {
    score += 1;
  }

  if (!checks.hasNumbers) {
    feedback.push('Password must contain numbers');
  } else {
    score += 1;
  }

  if (!checks.hasUppercase) {
    feedback.push('Consider adding uppercase letters for stronger security');
  } else {
    score += 1;
  }

  if (!checks.hasLowercase) {
    feedback.push('Consider adding lowercase letters for stronger security');
  } else {
    score += 1;
  }

  if (!checks.hasSpecialChars) {
    feedback.push('Consider adding special characters for stronger security');
  } else {
    score += 1;
  }

  // Minimum requirements for basic validation
  const isValid = checks.length && checks.hasLetters && checks.hasNumbers;

  if (isValid && feedback.length === 0) {
    feedback.push('Strong password!');
  }

  return {
    isValid,
    score,
    feedback,
    checks,
  };
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateAuthForm(values: {
  email: string;
  password: string;
  confirmPassword?: string;
}): Record<string, string> {
  const errors: Record<string, string> = {};

  // Email validation
  if (!values.email) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(values.email)) {
    errors.email = 'Please enter a valid email address';
  }

  // Password validation
  if (!values.password) {
    errors.password = 'Password is required';
  } else {
    const passwordValidation = validatePassword(values.password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.feedback[0];
    }
  }

  // Confirm password validation (for registration)
  if (values.confirmPassword !== undefined) {
    if (!values.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (values.password !== values.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
  }

  return errors;
}

export function validateVerificationCode(code: string): string | null {
  if (!code) {
    return 'Verification code is required';
  }
  if (code.length < 6) {
    return 'Verification code must be at least 6 characters';
  }
  return null;
}

export function validateResetEmail(email: string): string | null {
  if (!email) {
    return 'Email is required';
  }
  if (!isValidEmail(email)) {
    return 'Please enter a valid email address';
  }
  return null;
}