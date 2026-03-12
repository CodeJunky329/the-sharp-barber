# Luxe - Barbershop Website

Welcome to **Luxe Barbershop**, an exquisite online platform for booking premium grooming services at our luxurious barbershop. Experience the pinnacle of men's grooming with our expert barbers, state-of-the-art facilities, and seamless online booking system.

## ✨ Features

- **Elegant Booking System**: Effortlessly schedule appointments with our skilled barbers
- **Service Showcase**: Explore our comprehensive range of premium grooming services
- **User Authentication**: Secure login and account management powered by Supabase
- **Admin Dashboard**: Comprehensive management tools for barbershop operations
- **Responsive Design**: Sleek, mobile-friendly interface built with modern web technologies
- **Real-time Notifications**: Stay updated with appointment confirmations and reminders
- **Portfolio Gallery**: Showcase our work and barber expertise

## 🛠️ Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom components
- **UI Components**: Radix UI primitives
- **Backend**: Supabase (Authentication, Database, Real-time)
- **Icons**: Lucide React
- **Testing**: Vitest
- **Package Manager**: Npm

## 🚀 Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- Npm package manager
- Supabase account

### Installation

1. **Clone the repository**

   ```bash
   git clone (url)
   cd into-folder
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory and add your Supabase credentials:

   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:(whichever portnumber you use)` to view the application.

## 📖 Usage

### For Customers

- Browse our services and pricing
- Create an account or sign in
- Book appointments with preferred barbers
- Manage your bookings and receive notifications

### For Admins

- Access the admin dashboard
- Manage appointments and customer data
- Update services and pricing
- View analytics and reports

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (buttons, forms, etc.)
│   └── ...             # Feature-specific components
├── contexts/           # React contexts (Auth, etc.)
├── hooks/              # Custom React hooks
├── lib/                # Utilities and configurations
├── pages/              # Page components
└── assets/             # Static assets
```

## 🧪 Testing

Run the test suite with:

```bash
npm run test
```

## 📦 Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment.

## 🚀 Deployment

This project is configured for deployment on Vercel and Netlify. The `vercel.json` file contains the necessary configuration.


## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

- **Website**: [LUXE](https://luxebarber.netlify.app)
- **Email**: suhairsmith17@gmail.com

---

_Experience luxury grooming at its finest. Book your appointment today!_ 💈✨
