## Dependencies & Technologies

### Styles
- TailwindCSS
- Shadcn

### Fonts
- Next.js Font Optimization

### Icons
- Lucide

### Working with APIs
- Axios

### Working with Forms
- React Hook Form

### Validation
- Zod

### Client State Management
- Redux

### Server State Management
- TanStack Query

### Toast Notifications
- React Toastify



## Pages

### Auth Pages
- `/login` — Login page with email/password form and social login
- `/signup` — Registration page with name, email, password form
- `/forgot-password` — Enter email to receive OTP code
- `/verify-otp` — Enter 6-digit OTP code sent to email
- `/reset-password` — Set new password after OTP verification

### Main Pages
- `/dashboard` — Dashboard home after login
- `/onboarding` — Multi-step questionnaire for new users
- `/invite/accept` — Accept or decline a team invitation
- `/forbidden` — 403 access denied page

### Root
- `/` — Landing page (redirects to dashboard or login)

### Layouts
- `(auth)/layout.tsx` — Centered card layout, no sidebar
- `(main)/layout.tsx` — Sidebar + topbar layout
- `layout.tsx` — Root layout with providers, fonts, direction
