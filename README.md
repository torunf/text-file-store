# JSON Editor App

A simple desktop application for editing, formatting and managing JSON files. Built with Electron.js.

## Features

- Create and edit text files
- Format JSON content
- Syntax highlighting
- Copy formatted or minified JSON to clipboard
- Auto-save functionality
- Local file storage

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 14 or higher)
- npm (comes with Node.js)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/json-editor.git
cd json-editor
```

3. Start the application:

```bash
npm start
```

## Development Setup

The application uses the following main dependencies:
- Electron: For desktop application framework
- electron-store: For local data persistence

## Project Structure

json-editor/
├── main.js # Main electron process
├── preload.js # Preload script for secure IPC
├── renderer.js # Renderer process logic
├── index.html # Application UI
├── files/ # Directory for stored text files
└── package.json # Project configuration


## Usage

1. **Creating a New File**
   - Enter a filename in the "Yeni text" input field
   - Click "Ekle" to create the file

2. **Editing Files**
   - Select a file from the left sidebar
   - Edit content in the main text area
   - Changes are saved when clicking the "Kaydet" button

3. **JSON Operations**
   - Click "Format JSON" to format the content
   - Use "Copy to Clipboard" for formatted JSON
   - Use "Copy Minified" for minified JSON

## Scripts

- `npm start`: Launch the application
- `npm install`: Install dependencies

## License

This project is licensed under the MIT License.