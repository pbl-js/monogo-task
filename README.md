# Sentiment Analysis Application

A frontend application that allows users to analyze the sentiment of text using the Hugging Face Inference API.

## Features

- Text input field with character count and validation (max 500 characters)
- Integration with Hugging Face's sentiment analysis API
- Display of sentiment results (positive, negative, neutral) in a modal
- Responsive design that works on mobile and desktop
- Error handling and loading states
- Server-side API key management for enhanced security

## Technology Stack

- **Framework**: Next.js with TypeScript
- **Styling**: SCSS modules for component-specific styling
- **Icons**: React Icons
- **HTTP Client**: Axios
- **Code Quality**: ESLint, Prettier, and Husky for pre-commit and pre-push hooks

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/sentiment-analysis-app.git
cd sentiment-analysis-app
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up environment variables:

```bash
# Copy the example environment file
cp .env.example .env.local

# Edit .env.local and add your Hugging Face API key
HUGGING_FACE_API_KEY=your_hugging_face_api_key_here
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. Enter text (up to 500 characters) in the text input field.
2. Click the "Analyze Sentiment" button.
3. View the sentiment analysis results in the modal that appears.
