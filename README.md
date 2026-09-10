# FitCheck

An early-stage social fashion platform exploring how college students can discover what people around them are actually wearing.

FitCheck started as a personal project built around a simple idea: campus fashion is highly social, but most outfit inspiration online feels disconnected from the people, places, and occasions around you.

The initial prototype focuses on UCLA and experiments with a daily participation loop: post what you're wearing, then unlock the campus feed.

> **Project status:** Early-stage personal prototype / MVP exploration.

## The Idea

FitCheck is designed around a "post to unlock" model.

Students take a photo of their outfit for the day, optionally tag what they're wearing and where they're headed, and then unlock a feed showing outfits from other students on campus.

The goal was to explore whether participation could create a more authentic, hyper-local fashion community rather than another passive social feed.

## Current Prototype

The prototype explores:

- Google authentication for user access
- A multi-step onboarding experience
- In-app camera capture for daily outfit posts
- Outfit categorization by occasion and campus location
- Brand tagging for individual fits
- A daily "post to unlock" campus feed
- Feed filtering by contexts such as class, going out, game day, and internships
- Lightweight reactions, saves, and upvotes
- Campus trend discovery
- Firebase/Firestore persistence
- AI-assisted image moderation to check whether submissions are fashion-related
- User feedback collection

Some feed content and interaction behavior are currently simulated as part of the MVP rather than representing a production social network.

## Product Thinking

A key question behind FitCheck was:

**How do you create enough contribution in a social product for the feed itself to become valuable?**

Instead of allowing users to passively consume content immediately, the prototype tests a contribution-first loop:

`Take today's fit → Post → Unlock today's campus feed → Discover`

I was interested in whether this mechanic could encourage daily participation while keeping the content timely and locally relevant.

## Tech Stack

- **React 19**
- **TypeScript**
- **Vite**
- **Firebase Authentication**
- **Cloud Firestore**
- **Google Gemini API**
- **Motion**
- **Lucide React**
- **Tailwind CSS tooling**

## AI Image Moderation

The prototype also experiments with multimodal AI moderation.

After a user captures a photo, the image can be evaluated to determine whether it appears to contain an outfit, clothing, accessories, or fashion styling before allowing it into the feed.

This was an early experiment in using AI as a lightweight trust-and-safety layer rather than as the core product experience.

## Current Stage

FitCheck is not a finished production application.

This repository represents early product and engineering exploration, including:

- validating the core user flow
- experimenting with contribution incentives
- building the first mobile-first interface
- testing Firebase-backed user and submission flows
- exploring AI-assisted content moderation

## Future Directions

Potential next steps include:

- Replace sample feed content with fully user-generated submissions
- Build persistent reactions, saves, and voting
- Make daily posting logic account-specific rather than device-specific
- Improve authentication and UCLA community verification
- Move image storage out of Firestore documents into dedicated cloud storage
- Add personalized campus trend discovery
- Improve moderation and abuse-reporting systems
- Run user testing around the "post to unlock" mechanic
- Expand beyond a single campus if the behavior proves useful

## Running Locally

### Prerequisites

- Node.js
- Firebase project configuration
- Gemini API key

Clone the repository:

```bash
git clone https://github.com/saraatrehann-sys/fitcheck.git
cd fitcheck
