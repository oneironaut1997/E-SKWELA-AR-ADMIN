<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('home');

Route::get('dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// User Management Routes
Route::middleware(['auth', 'verified'])->group(function () {
    // User List
    Route::get('users', function () {
        return Inertia::render('Users/UserList');
    })->name('users.index');
    
    // Create User
    Route::get('users/create', function () {
        return Inertia::render('Users/CreateUser');
    })->name('users.create');
    
    // Edit User
    Route::get('users/{id}/edit', function ($id) {
        return Inertia::render('Users/EditUser', [
            'userId' => $id
        ]);
    })->name('users.edit');
});

// AR Content Management Routes
Route::middleware(['auth', 'verified'])->group(function () {
    // Content List
    Route::get('content', function () {
        return Inertia::render('Content/ContentList');
    })->name('content.index');
    
    // Create Content
    Route::get('content/create', function () {
        return Inertia::render('Content/CreateContent');
    })->name('content.create');
    
    // Edit Content
    Route::get('content/{id}/edit', function ($id) {
        return Inertia::render('Content/EditContent', [
            'id' => $id
        ]);
    })->name('content.edit');
});

// Quiz Management Routes
Route::middleware(['auth', 'verified'])->group(function () {
    // Quiz List
    Route::get('quizzes', function () {
        return Inertia::render('Quizzes/QuizList');
    })->name('quizzes.index');
    
    // Create Quiz
    Route::get('quizzes/create', function () {
        return Inertia::render('Quizzes/CreateQuiz');
    })->name('quizzes.create');
    
    // Edit Quiz
    Route::get('quizzes/{id}/edit', function ($id) {
        return Inertia::render('Quizzes/EditQuiz', [
            'quizId' => (int) $id
        ]);
    })->name('quizzes.edit');
    
    // Quiz Builder
    Route::get('quizzes/{id}/builder', function ($id) {
        return Inertia::render('Quizzes/QuizBuilder', [
            'quizId' => (int) $id
        ]);
    })->name('quizzes.builder');
    
    // Quiz Preview
    Route::get('quizzes/{id}/preview', function ($id) {
        return Inertia::render('Quizzes/QuizPreview', [
            'quizId' => (int) $id
        ]);
    })->name('quizzes.preview');
    
    // Quiz Attempts
    Route::get('quizzes/{id}/attempts', function ($id) {
        return Inertia::render('Quizzes/QuizAttempts', [
            'quizId' => (int) $id
        ]);
    })->name('quizzes.attempts');
});

// Analytics Routes
Route::middleware(['auth', 'verified'])->group(function () {
    // Analytics Dashboard
    Route::get('analytics', function () {
        return Inertia::render('Analytics/AnalyticsDashboard');
    })->name('analytics.index');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
