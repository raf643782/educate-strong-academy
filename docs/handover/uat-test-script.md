# UAT Test Script

User acceptance testing for the Educate Strong Academy platform. Run this before going live.

Each step has an expected result. If the result does not match, note the issue.

**Test environment**: Use the production Vercel URL (or the live domain once migrated). Do not use localhost.

**Test data**: Use a real email address you control for registration tests. Clean up test accounts from the User Manager afterward.

---

## Part 1 — Public website (no login required)

### 1.1 Homepage

1. Open the website homepage
   - Expected: Page loads, hero section visible, navigation links present
2. Click on a course in the Upcoming Cohort Spotlight
   - Expected: Course detail page loads
3. Click the "Register Interest" CTA button
   - Expected: Register Interest page loads

### 1.2 Course catalogue

1. Go to `/courses`
   - Expected: Grid of courses visible
2. Click on one course
   - Expected: Course detail page with title, description, and cohort information
3. Click "Book Now" (if Shopify is configured)
   - Expected: Shopify checkout page opens

### 1.3 Knowledge Hub

1. Go to `/knowledge`
   - Expected: Article list loads (21 articles)
2. Click on one article
   - Expected: Article page loads with title, body text

### 1.4 Exercise Library

1. Go to `/exercises`
   - Expected: Exercise list loads (29 exercises)
2. Click on one exercise
   - Expected: Exercise detail page loads

### 1.5 Event Library

1. Go to `/events`
   - Expected: Event list loads (26 events)
2. Click on one event
   - Expected: Event detail page loads

### 1.6 Coach directory

1. Go to `/coaches`
   - Expected: List of coach profiles (or empty state if no coaches yet)

### 1.7 EatStrong

1. Go to `/eatstrong`
   - Expected: Hub page with nutrition article categories
2. Click on a category
   - Expected: Article list for that category
3. Click on an article
   - Expected: Article text loads

### 1.8 Register Interest form

1. Go to `/register-interest`
2. Fill in the form with a real name, email, and message
3. Submit the form
   - Expected: Success confirmation shown
   - Expected: Notification email arrives at the team inbox (`NOTIFICATIONS_EMAIL`)
   - Expected: Confirmation email arrives at the submitted email address
   - Expected: Submission visible in Admin → Register Interest Manager

### 1.9 Certificate verification

1. Go to `/verify`
2. Enter a fake certificate code
   - Expected: "Certificate not found" or similar error — not a crash

---

## Part 2 — Registration and email verification

### 2.1 New user registration

1. Go to `/register`
2. Fill in name, email (use a real inbox you can check), and password
3. Submit
   - Expected: Success message asking you to check your email
4. Check the email inbox
   - Expected: Verification email arrives with a link
   - Expected: The link domain is `educatestrong.com` (not `localhost` or Vercel preview URL)
5. Click the verification link
   - Expected: Email verified, redirect to login or dashboard

### 2.2 Login

1. Go to `/login`
2. Enter the email and password from 2.1
3. Submit
   - Expected: Redirect to learner dashboard

### 2.3 Password reset

1. Log out
2. Go to `/forgot-password`
3. Enter the email from 2.1
4. Submit
   - Expected: "Check your email" message
5. Check inbox — reset email should arrive
6. Click the reset link — reset form should load
7. Enter a new password and submit
   - Expected: Password changed confirmation
8. Log in with the new password
   - Expected: Successful login

---

## Part 3 — Learner portal

*Log in as a Learner role account (or use an account enrolled on a test cohort).*

### 3.1 Learner dashboard

1. Log in and go to `/dashboard`
   - Expected: Dashboard loads with enrolled courses visible (or empty state if no enrolments)

### 3.2 Course documents

1. If a course with documents is available, go to `/documents`
   - Expected: Document list loads
2. Click Download on a document
   - Expected: PDF or file downloads (confirms R2 presigned URLs are working)

### 3.3 Learner CPD

1. Go to `/cpd`
   - Expected: CPD record page loads

---

## Part 4 — Admin panel

*Log in as an Admin role account.*

### 4.1 Dashboard

1. Go to `/admin`
   - Expected: Dashboard with counts and overview

### 4.2 User Manager

1. Go to `/admin/users`
   - Expected: List of registered users
2. Search for the test user created in Part 2
   - Expected: User appears in search results
3. View their role — confirm it is set correctly

### 4.3 Register Interest Manager

1. Go to `/admin/register-interest`
   - Expected: The test submission from Part 1.8 appears

### 4.4 Course Manager

1. Go to `/admin/courses`
   - Expected: List of courses
2. Open one course
   - Expected: Course detail with modules/lessons visible

### 4.5 Cohort Manager

1. Go to `/admin/cohorts`
   - Expected: List of cohorts (or empty state if none created)

### 4.6 Document upload (if R2 is configured)

1. Go to `/admin/documents`
2. Select a test PDF and upload it
   - Expected: Upload progress shown, file appears in the document list
3. Delete the test file afterward

---

## Part 5 — Security and headers

### 5.1 HTTPS

1. Open the website in a browser
   - Expected: HTTPS padlock visible, no mixed-content warnings in browser console

### 5.2 Noindex pages

1. Go to `/terms`, `/privacy`, `/refund-policy` (before legal content is approved)
   - Expected: Pages render but if you "View Source" you see `<meta name="robots" content="noindex...">`

### 5.3 Protected routes

1. While logged out, try to visit `/dashboard`, `/admin`, `/admin/users`
   - Expected: Redirect to `/login` — the page does not load without authentication

### 5.4 QA demo login

1. While logged out, go to `/qa-demo`
   - Expected: "Not available" message — the QA demo login must not be accessible in production

---

## Issues found

Record any issues here:

| # | Page / Feature | Expected | Actual | Severity |
|---|---|---|---|---|
| | | | | |

---

## Sign-off

| | |
|---|---|
| Tested by | |
| Date | |
| Build/deployment | |
| Result | Pass / Pass with issues / Fail |
