# E-Skwela AR - Admin Dashboard

A comprehensive admin dashboard for managing the E-Skwela AR educational platform. Built with Laravel and Vue.js, this application provides administrators with tools to manage content, users, quizzes, and analytics for the AR learning experience.

## 🚀 Features

- **User Management**: Create, edit, and manage student and teacher accounts
- **Content Management**: Upload and organize AR learning materials
- **Quiz Builder**: Create interactive quizzes with multiple question types
- **Analytics Dashboard**: Track student progress and engagement metrics
- **Authentication**: Secure login with email verification
- **Responsive Design**: Modern UI that works on desktop and mobile devices

## 🛠 Tech Stack

### Backend
- **Laravel 12.0** - PHP web framework
- **PHP 8.2+** - Server-side scripting language
- **Inertia.js 2.0** - Modern monolith approach
- **SQLite/MySQL** - Database options

### Frontend
- **Vue.js 3.5.13** - Progressive JavaScript framework
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS 4.1.1** - Utility-first CSS framework
- **Vite 7.0.4** - Fast build tool and dev server

### UI Components & Libraries
- **Reka UI** - Vue component library
- **Lucide Vue Next** - Beautiful icons
- **Chart.js + Vue-ChartJS** - Data visualization
- **VueUse** - Vue composition utilities

### Development Tools
- **Laravel Sail** - Docker development environment
- **Laravel Pail** - Real-time log monitoring
- **Laravel Pint** - Code style fixer
- **PHPUnit** - Testing framework
- **ESLint + Prettier** - Code formatting and linting

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **PHP 8.2 or higher**
- **Composer** (PHP dependency manager)
- **Node.js 18+ and npm** (for frontend assets)
- **SQLite** (default) or **MySQL/PostgreSQL** (optional)
- **Git** (for version control)

### Optional but Recommended
- **Docker & Docker Compose** (for Laravel Sail)
- **VS Code** with PHP and Vue extensions

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ar-eskwela/admin
```

### 2. Install PHP Dependencies

```bash
composer install
```

### 3. Install Node.js Dependencies

```bash
npm install
```

### 4. Environment Setup

```bash
# Copy the environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### 5. Database Setup

The application uses SQLite by default. The database file will be created automatically.

```bash
# Create SQLite database (if not exists)
touch database/database.sqlite

# Run migrations
php artisan migrate

# Seed the database with sample data (optional)
php artisan db:seed
```

#### Using MySQL/PostgreSQL (Optional)

If you prefer MySQL or PostgreSQL, update your `.env` file:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=eskwela_admin
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

### 6. Build Frontend Assets

```bash
# For development
npm run dev

# For production
npm run build
```

## 🏃‍♂️ Running the Application

### Development Mode

#### Option 1: Using Laravel's Built-in Development Command (Recommended)
```bash
composer run dev
```

This command starts multiple services concurrently:
- Laravel development server (http://localhost:8000)
- Queue worker
- Log monitoring (Pail)
- Vite development server for hot reloading

#### Option 2: Manual Setup
```bash
# Terminal 1: Start Laravel server
php artisan serve

# Terminal 2: Start Vite dev server (in another terminal)
npm run dev

# Terminal 3: Start queue worker (optional, in another terminal)
php artisan queue:work
```

### Using Laravel Sail (Docker)

```bash
# Start Docker containers
./vendor/bin/sail up -d

# Run migrations
./vendor/bin/sail artisan migrate

# Install npm dependencies
./vendor/bin/sail npm install

# Start development server
./vendor/bin/sail npm run dev
```

### Production Mode

```bash
# Build assets for production
npm run build

# Optimize Laravel for production
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Start with a process manager like Supervisor
```

## 📁 Project Structure

```
admin/
├── app/                    # Laravel application code
│   ├── Http/Controllers/   # Request handlers
│   ├── Models/            # Eloquent models
│   └── Providers/         # Service providers
├── config/                # Configuration files
├── database/              # Migrations, seeders, factories
├── public/                # Web server document root
├── resources/             # Frontend resources
│   ├── css/              # Stylesheets
│   ├── js/               # Vue.js application
│   │   ├── components/   # Vue components
│   │   ├── pages/        # Inertia.js pages
│   │   ├── layouts/      # Page layouts
│   │   └── types/        # TypeScript definitions
│   └── views/            # Blade templates
├── routes/               # Route definitions
├── storage/              # File storage
├── tests/                # Test files
├── composer.json         # PHP dependencies
├── package.json          # Node.js dependencies
└── vite.config.ts        # Vite configuration
```

## 🔧 Available Scripts

### Composer Scripts
```bash
composer run dev          # Start development environment
composer run dev:ssr      # Start with SSR support
composer run test         # Run PHPUnit tests
```

### NPM Scripts
```bash
npm run dev              # Start Vite dev server
npm run build            # Build for production
npm run build:ssr        # Build with SSR support
npm run format           # Format code with Prettier
npm run format:check     # Check code formatting
npm run lint             # Lint and fix code with ESLint
```

### Artisan Commands
```bash
php artisan serve        # Start development server
php artisan migrate      # Run database migrations
php artisan db:seed      # Seed database with sample data
php artisan queue:work   # Start queue worker
php artisan pail         # Monitor logs in real-time
php artisan tinker       # Interactive PHP shell
```

## 🧪 Testing

```bash
# Run all tests
composer run test

# Run specific test file
php artisan test tests/Feature/Auth/AuthenticationTest.php

# Run tests with coverage
php artisan test --coverage
```

## 🔒 Authentication

The application includes a complete authentication system:

- **Registration**: Create new admin accounts
- **Login/Logout**: Secure session management
- **Email Verification**: Verify email addresses
- **Password Reset**: Reset forgotten passwords
- **Profile Management**: Update user profiles and passwords

Default login credentials (after seeding):
- Email: `admin@example.com`
- Password: `password`

## 🎨 Customization

### Styling
- Modify `resources/css/app.css` for global styles
- Update `tailwind.config.js` for Tailwind customization
- Components use Tailwind utility classes

### Components
- Vue components are located in `resources/js/components/`
- Pages are in `resources/js/pages/`
- Layouts are in `resources/js/layouts/`

### Configuration
- Laravel config files are in `config/`
- Environment variables in `.env`
- Vite configuration in `vite.config.ts`

## 🚀 Deployment

### Production Checklist

1. **Environment Setup**
   ```bash
   cp .env.example .env.production
   # Update production values in .env.production
   ```

2. **Install Dependencies**
   ```bash
   composer install --no-dev --optimize-autoloader
   npm ci
   ```

3. **Build Assets**
   ```bash
   npm run build
   ```

4. **Optimize Laravel**
   ```bash
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   php artisan migrate --force
   ```

5. **Set Permissions**
   ```bash
   chmod -R 755 storage bootstrap/cache
   ```

### Web Server Configuration

#### Apache
```apache
<VirtualHost *:80>
    DocumentRoot /path/to/admin/public
    ServerName your-domain.com
    
    <Directory /path/to/admin/public>
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

#### Nginx
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/admin/public;
    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

## 🐛 Troubleshooting

### Common Issues

**1. Permission Errors**
```bash
sudo chown -R $USER:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache
```

**2. Vite Not Loading in Development**
- Ensure `npm run dev` is running
- Check if port 5173 is available
- Verify `APP_URL` in `.env` matches your local URL

**3. Database Connection Issues**
- Verify database credentials in `.env`
- Ensure database server is running
- Check if SQLite file exists and is writable

**4. Composer Memory Issues**
```bash
php -d memory_limit=-1 /usr/local/bin/composer install
```

**5. Node.js Version Issues**
```bash
# Use Node Version Manager
nvm use 18
npm install
```

## 📚 Additional Resources

- [Laravel Documentation](https://laravel.com/docs)
- [Vue.js Guide](https://vuejs.org/guide/)
- [Inertia.js Documentation](https://inertiajs.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev/guide/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow PSR-12 coding standards for PHP
- Use TypeScript for new JavaScript code
- Write tests for new features
- Update documentation as needed
- Run `composer run test` and `npm run lint` before committing

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation and troubleshooting guide

---

**E-Skwela AR Admin Dashboard** - Empowering education through augmented reality technology.