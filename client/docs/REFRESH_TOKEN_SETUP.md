# Refresh Token Implementation Guide

## Frontend Implementation ✅

The frontend refresh token interceptor is already implemented in `src/lib/axiosInstance.ts`.

### How it works:

1. When any API request returns 401 (Unauthorized), the interceptor catches it
2. It automatically calls `/auth/refresh-token` endpoint
3. The refresh token is sent via HTTP-only cookie (withCredentials: true)
4. If successful, it saves the new access token and retries the original request
5. If refresh fails, it redirects to login page

## Backend Requirements ⚠️

### 1. Refresh Token Endpoint

You need to implement this endpoint in your backend:

**Endpoint:** `POST /api/v1/auth/refresh-token`

**Request:**

- Headers: None (refresh token is in HTTP-only cookie)
- Body: Empty or `{}`

**Response (Success - 200):**

```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "new-jwt-access-token-here"
  }
}
```

**Response (Failure - 401):**

```json
{
  "success": false,
  "message": "Invalid or expired refresh token"
}
```

### 2. Cookie Configuration

Make sure your backend sets the refresh token as an HTTP-only cookie:

```javascript
// Example for Express.js
app.post("/api/v1/auth/refresh-token", (req, res) => {
  const refreshToken = req.cookies.refreshToken; // or req.cookies.erp_refresh_token

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: "No refresh token found",
    });
  }

  // Verify refresh token and generate new access token
  // ...

  res.json({
    success: true,
    data: {
      accessToken: newAccessToken,
    },
  });
});
```

### 3. Cookie Settings (Important!)

The refresh token cookie must have these settings:

- `httpOnly: true` - Prevents XSS attacks
- `secure: true` - Send only over HTTPS (in production)
- `sameSite: 'strict'` or `sameSite: 'lax'` - CSRF protection
- `maxAge`: Match your refresh token expiration (e.g., 7 days)

### 4. Login Endpoint Update

Make sure your login endpoint sets the refresh token cookie:

```javascript
POST /api/v1/auth/login

Response:
- Set cookie: refresh_token (HTTP-only, 7 days expiration)
- Body: { accessToken, user }
```

## Testing the Implementation

1. Login to the application
2. Wait for the access token to expire (check token expiration time)
3. Make any API request
4. The frontend should automatically:
   - Detect the 401 error
   - Call `/auth/refresh-token`
   - Retry the original request with the new token
   - Continue without requiring user to login again

## Common Issues

### Issue: "Direct login redirect instead of refresh"

**Cause:** Backend doesn't have `/auth/refresh-token` endpoint
**Solution:** Implement the endpoint as described above

### Issue: "Refresh token not being sent"

**Cause:** Cookie not configured properly
**Solution:** Ensure `withCredentials: true` is set in axios config (already done ✅)

### Issue: "CORS errors"

**Cause:** Backend CORS not configured to accept credentials
**Solution:** Configure CORS:

```javascript
app.use(
  cors({
    origin: "http://localhost:5173", // Your frontend URL
    credentials: true,
  }),
);
```

## Current Frontend Status ✅

- Token refresh interceptor: Implemented
- Request queuing: Implemented (prevents multiple refresh calls)
- Auto-retry: Implemented
- Logout on refresh failure: Implemented
- Permissions storage: Fixed
