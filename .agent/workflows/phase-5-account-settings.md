---
description: Phase 5 - Account & Settings System Implementation
---

# Phase 5: Account & Settings System Implementation

**Estimated Time:** 2-3 weeks  
**Priority:** High  
**Dependencies:** Firebase Storage, Firestore, Image processing library

---

## 🎯 Objectives

Implement comprehensive account management and user settings including:
- Profile editing with image uploads
- Privacy & security settings
- Notification preferences
- Content preferences

---

## 📋 Pre-Implementation Checklist

### 1. Verify Firebase Setup

Check if Firebase is properly configured:

```bash
# Verify Firebase config exists
cat src/lib/firebase.ts
```

If not configured, you'll need to:
- Set up Firebase project at https://console.firebase.google.com
- Enable Firestore Database
- Enable Firebase Storage
- Add Firebase config to environment variables

### 2. Install Required Dependencies

// turbo
```bash
npm install react-hook-form zod @hookform/resolvers
```

// turbo
```bash
npm install react-image-crop react-dropzone
```

// turbo
```bash
npm install browser-image-compression
```

// turbo
```bash
npm install date-fns
```

### 3. Create Directory Structure

// turbo
```bash
mkdir -p src/components/account
```

// turbo
```bash
mkdir -p src/app/account/edit
```

// turbo
```bash
mkdir -p src/lib/validators
```

// turbo
```bash
mkdir -p src/hooks/account
```

---

## 🏗️ Implementation Steps

### STEP 1: Create Type Definitions

**File:** `src/lib/types/account.ts`

Create comprehensive type definitions for:
- User profile data
- Privacy settings
- Notification preferences
- Security settings

**Key Types:**
```typescript
- UserProfile
- PrivacySettings
- NotificationPreferences
- SecuritySettings
- AccountFormData
```

---

### STEP 2: Create Validation Schemas

**File:** `src/lib/validators/account.ts`

Implement Zod schemas for:
- Profile edit form validation
- Username validation (alphanumeric, 3-30 chars)
- Bio validation (max 150 chars)
- URL validation
- Email/phone validation

**Key Schemas:**
```typescript
- profileEditSchema
- usernameSchema
- bioSchema
- privacySettingsSchema
```

---

### STEP 3: Create Firebase Utilities

**File:** `src/lib/firebase/storage.ts`

Implement storage utilities:
- `uploadProfileImage(file, userId)` - Upload and compress profile photos
- `uploadCoverImage(file, userId)` - Upload cover photos
- `deleteImage(path)` - Delete old images
- Image compression (max 2MB, maintain aspect ratio)

**File:** `src/lib/firebase/account.ts`

Implement Firestore utilities:
- `updateUserProfile(userId, data)` - Update profile data
- `checkUsernameAvailability(username)` - Real-time check
- `getUserProfile(userId)` - Fetch profile
- `updatePrivacySettings(userId, settings)` - Update privacy
- `updateNotificationPreferences(userId, prefs)` - Update notifications

---

### STEP 4: Create Custom Hooks

**File:** `src/hooks/account/useProfileEdit.ts`

Features:
- Form state management
- Auto-save draft to localStorage
- Optimistic UI updates
- Error handling
- Success/error notifications

**File:** `src/hooks/account/useUsernameCheck.ts`

Features:
- Debounced username availability check (500ms)
- Loading states
- Validation feedback
- Cache previous checks

**File:** `src/hooks/account/useImageUpload.ts`

Features:
- Image upload with progress
- Image compression
- Preview generation
- Error handling
- Cancel upload

---

### STEP 5: Build Avatar Upload Component

**File:** `src/components/account/avatar-upload.tsx`

**Features:**
- Drag & drop or click to upload
- Image preview
- Crop/resize functionality (1:1 aspect ratio)
- Remove current photo option
- Loading states with progress bar
- Error states with retry

**UI Requirements:**
- Circular preview (150px diameter)
- Glassmorphism card design
- Smooth animations (scale on hover)
- Upload progress indicator
- File size validation (max 5MB)
- Format validation (JPEG, PNG, WebP)

---

### STEP 6: Build Bio Editor Component

**File:** `src/components/account/bio-editor.tsx`

**Features:**
- Multi-line textarea
- Character counter (150 max)
- Real-time validation
- Emoji picker integration
- Auto-resize textarea
- Mention suggestions (@username)
- Hashtag highlighting

**UI Requirements:**
- Clean, minimal design
- Character count turns red at 140+ chars
- Smooth expand/collapse animation
- Focus state with gradient border

---

### STEP 7: Build Profile Edit Form

**File:** `src/components/account/profile-edit-form.tsx`

**Form Fields:**
- Profile photo (AvatarUpload component)
- Cover photo (optional)
- Full name (required, max 50 chars)
- Username (required, unique, 3-30 chars)
- Bio (BioEditor component)
- Website (URL validation)
- Gender (dropdown: Male, Female, Custom, Prefer not to say)
- Pronouns (text input)
- Birthday (date picker, must be 13+)
- Email (validation, verification status)
- Phone number (optional, format validation)

**Features:**
- Real-time validation
- Debounced username availability check
- Auto-save draft every 30 seconds
- Unsaved changes warning
- Preview mode
- Reset to original values
- Submit with optimistic updates

**UI Requirements:**
- Premium glassmorphism design
- Smooth field transitions
- Inline validation messages
- Loading states for async operations
- Success/error toast notifications

---

### STEP 8: Create Account Edit Page

**File:** `src/app/account/edit/page.tsx`

**Layout:**
- Sticky header with "Edit Profile" title
- Back button
- Save button (disabled until changes made)
- Main content area with ProfileEditForm
- Responsive design (mobile-first)

**Features:**
- Load current user data
- Handle form submission
- Navigate back on success
- Confirm before leaving with unsaved changes

---

### STEP 9: Build Privacy Settings Component

**File:** `src/components/account/privacy-settings.tsx`

**Settings Groups:**

**Account Privacy:**
- [ ] Public account (toggle)
- [ ] Private account (toggle)
- Info text explaining each option

**Story Privacy:**
- [ ] Share to (Everyone, Followers, Close Friends)
- [ ] Hide story from (user selection)
- [ ] Allow story sharing (toggle)

**Comment Controls:**
- [ ] Allow comments from (Everyone, Followers, Following, Off)
- [ ] Block comments from (user selection)
- [ ] Hide offensive comments (toggle)
- [ ] Manual filter (keyword list)

**Message Controls:**
- [ ] Allow messages from (Everyone, Followers, Off)
- [ ] Message requests (toggle)

**Tagged Posts:**
- [ ] Add automatically (toggle)
- [ ] Approve tags manually (toggle)

**Activity Status:**
- [ ] Show activity status (toggle)

**UI Requirements:**
- Organized sections with headers
- Toggle switches with smooth animations
- Expandable sections
- Info tooltips
- Save button at bottom

---

### STEP 10: Build Security Settings Component

**File:** `src/components/account/security-settings.tsx`

**Features:**

**Password Management:**
- Current password field
- New password field
- Confirm password field
- Password strength indicator
- Show/hide password toggle

**Two-Factor Authentication:**
- Enable/disable 2FA toggle
- Setup wizard (QR code, backup codes)
- Verify with code input

**Login Activity:**
- List of recent login sessions
- Device info (browser, OS, location)
- Last active timestamp
- "This is me" / "This wasn't me" actions
- Log out of all other sessions button

**Account Recovery:**
- Recovery email
- Recovery phone number
- Backup codes download

**UI Requirements:**
- Security-focused design (lock icons, shields)
- Clear visual hierarchy
- Confirmation modals for sensitive actions
- Success/error feedback

---

### STEP 11: Build Blocked Accounts Component

**File:** `src/components/account/blocked-accounts.tsx`

**Features:**
- List of blocked users
- User avatar and username
- Block date
- Unblock button
- Search blocked users
- Empty state (no blocked users)
- Pagination for large lists

**File:** `src/components/account/muted-accounts.tsx`

**Features:**
- List of muted users
- Unmute button
- Search functionality
- Filter by mute type (posts, stories, messages)

---

### STEP 12: Build Notification Settings Component

**File:** `src/components/account/notification-settings.tsx`

**Notification Categories:**

**Likes:**
- [ ] Push notifications
- [ ] Email notifications
- [ ] SMS notifications

**Comments:**
- [ ] Push, Email, SMS toggles

**Follows:**
- [ ] Push, Email, SMS toggles

**Mentions:**
- [ ] Push, Email, SMS toggles

**Live Broadcasts:**
- [ ] From everyone
- [ ] From people I follow
- [ ] Off

**Stories:**
- [ ] Story views
- [ ] Story replies

**Messages:**
- [ ] Message requests
- [ ] Message notifications

**Quiet Mode:**
- [ ] Enable quiet mode (toggle)
- Start time picker
- End time picker
- Days of week selection

**UI Requirements:**
- Grouped by category
- Master toggles for each category
- Sub-toggles for channels (push, email, SMS)
- Visual indicators for enabled/disabled
- Schedule picker for quiet mode

---

### STEP 13: Build Content Preferences Component

**File:** `src/components/account/content-preferences.tsx`

**Settings:**

**Sensitive Content:**
- [ ] Limit (default)
- [ ] Allow
- Info about what's considered sensitive

**Language:**
- Preferred language dropdown
- Translation preferences

**Suggested Content:**
- [ ] Show suggested posts (toggle)
- [ ] Show suggested reels (toggle)
- [ ] Show suggested accounts (toggle)

**Data Usage:**
- [ ] Auto-play videos (toggle)
- [ ] High-quality uploads (toggle)
- [ ] Download original photos (toggle)
- [ ] Use less data (toggle)

**Accessibility:**
- [ ] Alt text reminders (toggle)
- [ ] Captions (toggle)
- [ ] Reduce motion (toggle)

---

### STEP 14: Create Main Settings Page

**File:** `src/app/account/settings/page.tsx`

**Layout:**
- Tabbed interface or accordion sections
- Sections:
  1. Edit Profile (link to /account/edit)
  2. Privacy
  3. Security
  4. Notifications
  5. Content Preferences
  6. Blocked Accounts
  7. Muted Accounts
  8. Help & Support
  9. About

**UI Requirements:**
- Clean navigation
- Active section highlighting
- Responsive layout (sidebar on desktop, tabs on mobile)
- Breadcrumb navigation

---

### STEP 15: Implement Auto-Save Functionality

**File:** `src/hooks/account/useAutoSave.ts`

**Features:**
- Save draft to localStorage every 30 seconds
- Debounced save on field changes
- Visual indicator (saving, saved, error)
- Restore draft on page load
- Clear draft on successful submit

---

### STEP 16: Add Firestore Security Rules

**File:** `firestore.rules`

Add rules for:
- Users can only read/write their own profile
- Username uniqueness enforcement
- Profile photo size limits
- Rate limiting for updates

Example:
```
match /users/{userId} {
  allow read: if request.auth != null;
  allow write: if request.auth.uid == userId;
}
```

---

### STEP 17: Add Storage Security Rules

**File:** `storage.rules`

Add rules for:
- Users can only upload to their own folder
- File size limits (5MB for images)
- File type restrictions (images only)
- Delete old images when uploading new ones

---

### STEP 18: Testing & Validation

**Manual Testing Checklist:**

Profile Edit:
- [ ] Upload profile photo (JPEG, PNG, WebP)
- [ ] Test file size validation (reject >5MB)
- [ ] Test image compression
- [ ] Change username (test availability check)
- [ ] Test duplicate username rejection
- [ ] Edit bio with 150+ characters (should prevent)
- [ ] Test URL validation
- [ ] Test email validation
- [ ] Test phone number validation
- [ ] Test form validation (required fields)
- [ ] Test auto-save (wait 30s, refresh page)
- [ ] Test unsaved changes warning
- [ ] Submit form and verify Firestore update

Privacy Settings:
- [ ] Toggle account privacy
- [ ] Change story privacy settings
- [ ] Update comment controls
- [ ] Update message controls
- [ ] Test settings persistence

Security Settings:
- [ ] Change password
- [ ] Enable 2FA
- [ ] View login activity
- [ ] Log out of other sessions

Notifications:
- [ ] Toggle notification preferences
- [ ] Set quiet mode schedule
- [ ] Test settings save

Content Preferences:
- [ ] Update sensitive content settings
- [ ] Change language
- [ ] Toggle auto-play
- [ ] Test data usage settings

**Performance Testing:**
- [ ] Test image upload speed
- [ ] Test form submission speed
- [ ] Test username availability check latency
- [ ] Test page load time
- [ ] Test with slow 3G network

**Accessibility Testing:**
- [ ] Keyboard navigation
- [ ] Screen reader compatibility
- [ ] Focus states
- [ ] ARIA labels
- [ ] Color contrast

---

### STEP 19: Add Navigation Links

Update navigation components to include:
- Link to `/account/edit` in profile dropdown
- Link to `/account/settings` in profile dropdown
- Settings icon in mobile navigation

**Files to Update:**
- `src/components/app/desktop-sidebar.tsx`
- `src/components/app/mobile-bottom-nav.tsx`
- `src/components/profile/profile-header.tsx`

---

### STEP 20: Polish & Optimization

**UI Polish:**
- [ ] Add loading skeletons for all components
- [ ] Add smooth transitions between states
- [ ] Add micro-animations (hover effects, button presses)
- [ ] Add success/error toast notifications
- [ ] Add confirmation modals for destructive actions
- [ ] Ensure consistent spacing and typography
- [ ] Test dark mode compatibility

**Performance Optimization:**
- [ ] Lazy load heavy components
- [ ] Optimize image compression settings
- [ ] Add request caching where appropriate
- [ ] Debounce expensive operations
- [ ] Add loading states to prevent multiple submissions

**Code Quality:**
- [ ] Add TypeScript types for all props
- [ ] Add JSDoc comments
- [ ] Extract reusable utilities
- [ ] Remove console.logs
- [ ] Add error boundaries

---

## 🎨 Design Guidelines

**Color Palette:**
- Primary: Gradient (purple to pink)
- Background: Dark (#0a0a0a) with glassmorphism overlays
- Text: White (#ffffff) and gray (#a0a0a0)
- Success: Green (#10b981)
- Error: Red (#ef4444)
- Warning: Yellow (#f59e0b)

**Typography:**
- Font: Inter or Outfit (Google Fonts)
- Headings: 600-700 weight
- Body: 400-500 weight
- Labels: 500 weight, uppercase, letter-spacing

**Spacing:**
- Use consistent spacing scale (4px, 8px, 16px, 24px, 32px, 48px)
- Card padding: 24px
- Section gaps: 32px
- Input padding: 12px 16px

**Animations:**
- Transitions: 200-300ms ease-in-out
- Hover scale: 1.02-1.05
- Button press: scale(0.98)
- Page transitions: fade + slide

**Components:**
- Use glassmorphism for cards
- Rounded corners: 12-16px
- Subtle shadows and borders
- Gradient accents on interactive elements

---

## 🐛 Common Issues & Solutions

**Issue:** Username availability check is too slow
**Solution:** Implement debouncing (500ms) and cache results

**Issue:** Image upload fails
**Solution:** Check file size, format, and Firebase Storage rules

**Issue:** Form doesn't save
**Solution:** Verify Firestore security rules allow write access

**Issue:** Auto-save conflicts with manual save
**Solution:** Clear auto-save draft on manual submit

**Issue:** Profile photo doesn't update immediately
**Solution:** Implement optimistic UI updates

---

## ✅ Definition of Done

Phase 5 is complete when:

- [ ] All components are implemented and styled
- [ ] All forms have proper validation
- [ ] Profile editing works end-to-end (upload, edit, save)
- [ ] Privacy settings persist to Firestore
- [ ] Security settings are functional
- [ ] Notification preferences save correctly
- [ ] Content preferences work as expected
- [ ] All manual tests pass
- [ ] Performance is acceptable (<3s page load)
- [ ] Accessibility requirements are met
- [ ] Code is reviewed and refactored
- [ ] Documentation is updated
- [ ] No console errors or warnings

---

## 📚 Next Steps

After completing Phase 5, proceed to:
- **Phase 6:** Studio & Analytics
- **Phase 7:** Stories System
- **Phase 9:** Notifications System

---

## 📝 Notes

- Keep Firebase costs in mind (storage, reads/writes)
- Consider implementing rate limiting for expensive operations
- Add analytics tracking for user settings changes
- Consider A/B testing for UI variations
- Plan for future features (account deletion, data export)
