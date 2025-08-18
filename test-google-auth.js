// Test Google authentication flow
const jwt = require('jsonwebtoken');

// Mock the JWT generation (same as in the backend)
function generateToken(userId, role = 'customer') {
  const jwtSecret = 'your-secret-key'; // This should match your actual secret
  return jwt.sign(
    { userId, role },
    jwtSecret,
    { expiresIn: '24h' }
  );
}

// Mock the EdgeAuthValidator token validation
function validateToken(token) {
  try {
    const jwtSecret = 'your-secret-key';
    const decoded = jwt.verify(token, jwtSecret);
    
    if (!decoded.userId || !decoded.role) {
      return { isValid: false, error: 'Invalid token payload' };
    }

    return {
      isValid: true,
      user: {
        _id: decoded.userId,
        role: decoded.role,
        email: decoded.email,
      }
    };
  } catch (error) {
    console.error('JWT decode error:', error);
    return { isValid: false, error: 'Invalid token' };
  }
}

// Test the flow
console.log('Testing Google authentication flow...');

// Simulate a user
const userId = '507f1f77bcf86cd799439011';
const role = 'customer';

// Generate token
const token = generateToken(userId, role);
console.log('Generated token:', token.substring(0, 50) + '...');

// Validate token
const validation = validateToken(token);
console.log('Token validation result:', validation);

// Test EdgeAuthValidator style validation
function simulateEdgeAuthValidation(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return { isValid: false, error: 'Invalid token format' };
    }

    const payload = parts[1];
    const decoded = JSON.parse(Buffer.from(payload, 'base64').toString());
    
    if (!decoded.userId || !decoded.role) {
      return { isValid: false, error: 'Invalid token payload' };
    }

    return {
      isValid: true,
      user: {
        _id: decoded.userId,
        role: decoded.role,
        email: decoded.email,
      }
    };
  } catch (error) {
    console.error('JWT decode error:', error);
    return { isValid: false, error: 'Invalid token' };
  }
}

const edgeValidation = simulateEdgeAuthValidation(token);
console.log('EdgeAuthValidator validation result:', edgeValidation);

console.log('✅ Google auth flow test completed');
