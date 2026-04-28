<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Dashboard') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            @if (session('status') === 'preferences-updated')
                <div class="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                    <span class="block sm:inline">Your preferences have been saved successfully!</span>
                </div>
            @endif

            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900 dark:text-gray-100">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Profile Section -->
                        <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-100 dark:border-gray-600">
                            <h3 class="text-lg font-bold mb-4 text-indigo-600 dark:text-indigo-400">Profile Information</h3>
                            <div class="space-y-2">
                                <p><span class="font-semibold">Name:</span> {{ $user->name }}</p>
                                <p><span class="font-semibold">Phone:</span> {{ $user->profile?->phone ?? 'Not provided' }}</p>
                                <p><span class="font-semibold">Address:</span> {{ $user->profile?->address ?? 'Not provided' }}</p>
                            </div>
                        </div>

                        <!-- Preferences Section -->
                        <div class="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg border border-gray-100 dark:border-gray-600">
                            <h3 class="text-lg font-bold mb-4 text-indigo-600 dark:text-indigo-400">System Preferences (JSONB)</h3>
                            
                            <form action="{{ route('user.preferences.update') }}" method="POST" class="space-y-6">
                                @csrf
                                @method('PUT')

                                <!-- Theme Preference -->
                                <div>
                                    <label for="theme" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Interface Theme</label>
                                    <select name="theme" id="theme" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                                        <option value="light" {{ ($user->preferences['theme'] ?? 'light') === 'light' ? 'selected' : '' }}>Light Mode</option>
                                        <option value="dark" {{ ($user->preferences['theme'] ?? 'light') === 'dark' ? 'selected' : '' }}>Dark Mode</option>
                                    </select>
                                </div>

                                <!-- Notifications Preference -->
                                <div class="flex items-center justify-between">
                                    <span class="flex-grow flex flex-col">
                                        <span class="text-sm font-medium text-gray-900 dark:text-gray-100">Email Notifications</span>
                                        <span class="text-sm text-gray-500 dark:text-gray-400">Receive alerts about system updates.</span>
                                    </span>
                                    <button type="button" 
                                            onclick="this.nextElementSibling.click(); this.classList.toggle('bg-gray-200'); this.classList.toggle('bg-indigo-600'); this.firstElementChild.classList.toggle('translate-x-0'); this.firstElementChild.classList.toggle('translate-x-5');"
                                            class="{{ ($user->preferences['notifications'] ?? false) ? 'bg-indigo-600' : 'bg-gray-200' }} relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                        <span class="{{ ($user->preferences['notifications'] ?? false) ? 'translate-x-5' : 'translate-x-0' }} pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"></span>
                                    </button>
                                    <input type="checkbox" name="notifications" class="hidden" {{ ($user->preferences['notifications'] ?? false) ? 'checked' : '' }}>
                                </div>

                                <div class="pt-4">
                                    <button type="submit" class="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200">
                                        Save Preferences
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
