# Backend Issues - OTP Verification Not Working

## 🔴 Critical Issues

### Issue #1: OTP Verification Always Returns 400 "Invalid or expired OTP"
**Status:** BLOCKING  
**Severity:** CRITICAL

**Problem:**
- User signs up successfully ✅
- OTP is sent to email
- User enters the correct OTP code
- Backend returns: `400 Bad Request: "Invalid or expired OTP"` ❌

**Test Case:**
1. Register with email: `user@gmail.com`
2. Receive OTP code (e.g., `123456`)
3. Submit correct OTP
4. Expected: ✅ Verify success, login token returned
5. Actual: ❌ `Invalid or expired OTP`

**Possible Causes:**
- [ ] OTP validation logic is broken in `/api/v1/auth/verify-otp` endpoint
- [ ] OTP is being marked as expired immediately after creation
- [ ] OTP code format mismatch (backend storing differently than frontend sending)
- [ ] Database timestamp/timezone issue causing premature expiration
- [ ] Race condition if verify endpoint is called twice
- [ ] OTP code not being generated/stored properly

**Questions for Backend Team:**
1. Is the OTP being stored in the database correctly?
2. What is the OTP expiration time (in seconds)?
3. Is there a bug in the OTP validation SQL/logic?
4. Are you comparing OTP codes correctly (string vs int)?
5. Is timezone configured correctly on server?

---

### Issue #2: Resend OTP Button Says "Sent" but No Email Arrives
**Status:** BLOCKING  
**Severity:** CRITICAL

**Problem:**
- User clicks "Resend" button
- Frontend shows: `✅ "Code sent successfully!"`
- Email inbox shows: No new email ❌

**Test Case:**
1. Go to OTP verification screen
2. Click "Resend" button
3. Expected: ✅ Email arrives with new OTP code within 1-2 minutes
4. Actual: ❌ No email received

**Possible Causes:**
- [ ] Email service (SMTP/SendGrid/etc.) is not configured
- [ ] Email credentials are invalid
- [ ] Resend endpoint (`POST /api/v1/auth/resend-verification-otp`) not sending emails
- [ ] Email is being filtered to spam/junk
- [ ] Email service quota exceeded
- [ ] Resend endpoint returning success without actually sending

**Questions for Backend Team:**
1. Is the email service (SMTP/SendGrid) configured and tested?
2. Are you getting any errors when sending emails?
3. Can you check server logs for email sending errors?
4. Is the email address being validated before sending?
5. Are you testing with real emails or just logging?

---

### Issue #3: Email Permanently Stuck as "Already Registered"
**Status:** BLOCKING  
**Severity:** HIGH

**Problem:**
- User registers with email → OTP verification fails
- User tries to register again with **same email**
- Backend returns: `422 Unprocessable Entity: "Email already registered"` ❌
- User is **stuck** - can't complete signup, can't use email again

**Test Case:**
1. Register with email: `user@gmail.com` → Success
2. Go to OTP verification screen
3. Enter OTP → Fails with "Invalid or expired OTP"
4. Go back and try to signup again with same email
5. Expected: ✅ Allow new signup attempt with same email (unverified account gets replaced)
6. Actual: ❌ "Email already registered" error

**Possible Causes:**
- [ ] No mechanism to clean up unverified accounts
- [ ] Email validation doesn't check if account is verified
- [ ] No retry/reset mechanism if OTP verification fails
- [ ] Unique constraint on email doesn't allow re-registration

**Questions for Backend Team:**
1. Can users retry signup with same unverified email?
2. Is there an admin endpoint to clean up unverified accounts?
3. How long do unverified accounts stay in the system?
4. Should we allow multiple verification attempts?

---

## 📋 Testing Checklist for Backend Team

Before marking OTP flow as fixed, verify:

- [ ] **Test 1**: Register → Receive OTP → Enter OTP → Success
- [ ] **Test 2**: Register → Receive OTP → Wait 15+ min → Enter OTP → Properly expired
- [ ] **Test 3**: Register → Resend OTP → Receive new email → Enter new OTP → Success
- [ ] **Test 4**: Register → OTP fails → Resend → New code works
- [ ] **Test 5**: Register → Let OTP expire → Resend gets new code
- [ ] **Test 6**: Invalid OTP code → Clear error message
- [ ] **Test 7**: Correct email, wrong OTP → Proper error
- [ ] **Test 8**: Register failed → Try same email again → Works

---

## 🔧 Frontend Team Workarounds

While backend is being fixed:

1. **Allow user to retry with different email:**
   - ✅ Added "Back to signup" button
   - User can change email and try again

2. **Show debug information:**
   - ✅ Added expandable "Debug Info" section
   - Users can see exact error and share with support

3. **Better error messages:**
   - ✅ Suggests checking spam folder
   - ✅ Suggests waiting 1-2 minutes
   - ✅ Explains the issue clearly

---

## 📞 Support Escalation

**Frontend Team To Backend Team:**
```
The OTP verification flow is broken. The endpoint /api/v1/auth/verify-otp 
returns "Invalid or expired OTP" even with the correct code. Additionally, 
the resend endpoint says it sends an email but the user never receives it.

This is blocking all user signups. Please investigate:
1. OTP generation/validation logic
2. Email service configuration
3. Account cleanup for failed verifications

Test case: user@example.com → receive OTP → enter OTP → error
```

---

## 🎯 Success Criteria

OTP flow is fixed when:
- ✅ User registers
- ✅ User receives OTP email within 1 minute
- ✅ User enters OTP
- ✅ Verification succeeds and login token is returned
- ✅ User can proceed to onboarding questionnaire
- ✅ Resend works and generates new code
