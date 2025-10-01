# JSCAD 3D Box Generator

## Description

A single page application that uses the JSCAD framework for generating parametric 3D models suitable for 3D printing. The application features an interactive form with inputs for creating custom hollow boxes with precise dimensions and wall thickness specifications optimized for 3D printing.

## Features

- **Parametric 3D Modeling**: Generate hollow boxes with customizable dimensions
- **Real-time Preview**: See your model update instantly as you change parameters
- **3D Printing Optimization**: Built-in validation for wall thickness and layer height
- **Interactive Form Controls**: 5 input parameters for complete customization:
  - Wall Thickness (mm)
  - Layer Height (mm)
  - Box Width (mm)
  - Box Depth (mm)
  - Box Height (mm)
- **Export Ready**: Generate models ready for 3D printing (STL export capability)
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

- **Vite** - Fast build tool and development server
- **TypeScript** - Type-safe JavaScript development
- **TailwindCSS** - Utility-first CSS framework for styling
- **@jscad/modeling** - 3D modeling library for parametric design
- **JSCAD** - [OpenJSCAD.org](https://github.com/jscad/OpenJSCAD.org/tree/master?tab=readme-ov-file)

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (version 16 or higher)
- **npm** (comes with Node.js)

## Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <your-repository-url>
   cd openjscad-demo
   ```

2. **Navigate to the application directory**:
   ```bash
   cd openjscad-app
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

## Running the Application

### Development Mode

To start the development server with hot reload:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Production Build

To build the application for production:

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

## Usage

1. **Open the application** in your web browser
2. **Adjust parameters** using the form controls:
   - Set your desired wall thickness (recommended: 1-3mm for most 3D printers)
   - Configure layer height to match your 3D printer settings
   - Enter the box dimensions (width, depth, height)
3. **Preview your model** in real-time on the right side of the screen
4. **Validate parameters** - the app will warn you if settings aren't suitable for 3D printing
5. **Export your model** (when STL export is fully implemented)

## Project Structure

```
openjscad-app/
├── src/
│   ├── components/
│   │   ├── ParameterForm.ts      # Interactive form component
│   │   └── ModelViewer.ts        # 3D model preview component
│   ├── types.ts                  # TypeScript type definitions
│   ├── modelGenerator.ts         # JSCAD model generation logic
│   ├── main.ts                   # Application entry point
│   └── style.css                 # TailwindCSS styles
├── package.json                  # Project dependencies and scripts
├── tailwind.config.js           # TailwindCSS configuration
├── postcss.config.js            # PostCSS configuration
├── tsconfig.json                # TypeScript configuration
└── vite.config.ts               # Vite configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run linting (if configured)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For support or questions, please open an issue in the GitHub repository.
