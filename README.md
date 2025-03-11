# Sentiment Analysis Application

A frontend application that allows users to analyze the sentiment of text using the Hugging Face Inference API.

## Features

- Text input field with character count and validation (max 500 characters)
- Integration with Hugging Face's sentiment analysis API
- Display of sentiment results (positive, negative, neutral) in a modal
- Responsive design that works on mobile and desktop
- Error handling and loading states

## Technology Stack

- **Framework**: Next.js with TypeScript
- **Styling**: SCSS modules for component-specific styling
- **Icons**: React Icons
- **HTTP Client**: Axios
- **Code Quality**: ESLint, Prettier, and Husky for pre-commit hooks

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- A Hugging Face API key (get one at [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens))

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

3. Run the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. Enter text (up to 500 characters) in the text input field.
2. Enter your Hugging Face API key in the API key field.
3. Click the "Analyze Sentiment" button.
4. View the sentiment analysis results in the modal that appears.

## Development Challenges

During the development of this application, several challenges were faced:

1. **API Integration**: Working with the Hugging Face API required understanding their specific request/response format and error handling.

2. **State Management**: Managing the various states of the application (idle, loading, success, error) required careful planning to ensure a smooth user experience.

3. **Modal Implementation**: Creating an accessible modal with proper keyboard navigation and focus management required attention to detail.

4. **Responsive Design**: Ensuring the application looks and works well on various screen sizes required careful CSS planning.

5. **TypeScript Integration**: Properly typing the API responses and application state helped catch potential errors early but required careful planning.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
