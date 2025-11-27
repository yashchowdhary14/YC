# **App Name**: YC

## Core Features:

- User Authentication: Secure user authentication with email/password, Google login, and phone login (OTP), including profile data (username, fullName, email, bio, profilePhoto, followers, following, createdAt, verified).
- Firestore Database Structure: Structured data storage for users, posts, stories, reels, comments, and chats using Firestore collections.
- Firebase Storage Structure: Scalable storage of profile photos, posts, stories, reels, reels thumbnails and chat media using Firebase Storage.
- Auto Story Deletion: Automatically deletes expired stories (after 24 hours) using Cloud Functions.
- Reel Thumbnail Generation: Generates thumbnails for reels using Cloud Functions.
- Automatic Updates of Followers/Following: Keeps the followers and following count updated in the database using Cloud Functions.
- AI Caption Generation: Generates captions based on uploaded media for user consideration with optional customization. The tool will decide, using the image data and user information if any data or keywords will be added or dropped to fit into context. This is especially applicable for popular images. This would work as inspiration; the AI may extract people, objects or locations from the image that are related, it may check user trending data to decide which caption to show the user, using Google Cloud Vision + PaLM/Gemini.
- Realtime Push Notifications: Sends realtime push notifications for new comments, likes, new follower, new message and new post by followed user.
- Security Rules Enforcement: Enforces security rules for Firestore and Storage, including user profile updates, authentication requirements, chat access control, story expiration, and post/reel ownership.
- Firestore Indexing: Implements Firestore composite indexes for sorting posts/reels by createdAt, querying expiring stories, and sorting chat messages by timestamp.

## Style Guidelines:

- Primary color: #6750A4 (Deep purple).
- Background: #E9DFF7 (Light lavender).
- Accent: #B04183 (Muted rose).
- Font: Inter (Modern, readable sans-serif).
- UI Style: Modern, minimal.
- Grid layout for posts.
- Line-art icons.
- Smooth transitions.