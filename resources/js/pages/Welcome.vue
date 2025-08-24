<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import AppLogoIcon from '@/components/AppLogoIcon.vue';
import { GraduationCap, Users, Box, FileQuestion, Sparkles, ArrowRight } from 'lucide-vue-next';
</script>

<template>
    <Head title="Welcome to AR Eskwela">
        <link rel="preconnect" href="https://rsms.me/" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
    </Head>
    <div class="flex min-h-screen flex-col items-center bg-background p-6 text-foreground lg:justify-center lg:p-8">
        <header class="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
            <nav class="flex items-center justify-end gap-4">
                <Link
                    v-if="$page.props.auth.user"
                    :href="route('dashboard')"
                    class="inline-block rounded-md border border-border px-5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                    Dashboard
                </Link>
                <template v-else>
                    <Link
                        :href="route('login')"
                        class="inline-block rounded-md border border-transparent px-5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                        Log in
                    </Link>
                    <Link
                        :href="route('register')"
                        class="inline-block rounded-md border border-border bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                        Get Started
                    </Link>
                </template>
            </nav>
        </header>
        <div class="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
            <main class="flex w-full max-w-[335px] flex-col-reverse overflow-hidden rounded-xl lg:max-w-6xl lg:flex-row lg:gap-8">
                <div class="flex-1 rounded-xl bg-card p-6 pb-12 shadow-sm border lg:p-12">
                    <!-- Logo and Brand -->
                    <div class="mb-8 flex items-center gap-3">
                        <div class="flex aspect-square size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                            <AppLogoIcon class="size-7 fill-current" />
                        </div>
                        <div>
                            <h1 class="text-2xl font-bold">AR Eskwela</h1>
                            <p class="text-sm text-muted-foreground">Admin Portal</p>
                        </div>
                    </div>

                    <!-- Welcome Content -->
                    <div class="mb-8">
                        <h2 class="mb-3 text-3xl font-bold tracking-tight lg:text-4xl">
                            Welcome to the Future of Education
                        </h2>
                        <p class="text-lg text-muted-foreground lg:text-xl">
                            Manage your AR-powered learning platform with comprehensive tools for content creation,
                            student management, and educational analytics.
                        </p>
                    </div>

                    <!-- Features List -->
                    <div class="mb-8 space-y-4">
                        <div class="flex items-start gap-4">
                            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                                <Box class="h-4 w-4" />
                            </div>
                            <div>
                                <h3 class="font-semibold">AR Content Management</h3>
                                <p class="text-sm text-muted-foreground">Upload and manage 3D models, audio files, and interactive AR experiences</p>
                            </div>
                        </div>
                        <div class="flex items-start gap-4">
                            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400">
                                <FileQuestion class="h-4 w-4" />
                            </div>
                            <div>
                                <h3 class="font-semibold">Interactive Assessments</h3>
                                <p class="text-sm text-muted-foreground">Create engaging quizzes and track student progress in real-time</p>
                            </div>
                        </div>
                        <div class="flex items-start gap-4">
                            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
                                <Users class="h-4 w-4" />
                            </div>
                            <div>
                                <h3 class="font-semibold">User Management</h3>
                                <p class="text-sm text-muted-foreground">Manage students, teachers, and administrators with role-based access</p>
                            </div>
                        </div>
                        <div class="flex items-start gap-4">
                            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400">
                                <Sparkles class="h-4 w-4" />
                            </div>
                            <div>
                                <h3 class="font-semibold">Analytics & Insights</h3>
                                <p class="text-sm text-muted-foreground">Monitor learning outcomes and platform usage with detailed analytics</p>
                            </div>
                        </div>
                    </div>

                    <!-- CTA Buttons -->
                    <div class="flex flex-col gap-3 sm:flex-row">
                        <Link
                            v-if="$page.props.auth.user"
                            :href="route('dashboard')"
                            class="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                        >
                            Go to Dashboard
                            <ArrowRight class="h-4 w-4" />
                        </Link>
                        <template v-else>
                            <Link
                                :href="route('register')"
                                class="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                            >
                                Get Started
                                <ArrowRight class="h-4 w-4" />
                            </Link>
                            <Link
                                :href="route('login')"
                                class="inline-flex items-center justify-center rounded-lg border border-border px-6 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                            >
                                Sign In
                            </Link>
                        </template>
                    </div>
                </div>
                <!-- AR Eskwela Visual Section -->
                <div class="relative flex w-full shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 p-8 lg:w-96">
                    <!-- Visual -->
                </div>
            </main>
        </div>
        <div class="hidden h-14.5 lg:block"></div>
    </div>
</template>
