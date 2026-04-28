<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Dashboard') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Profile Section -->
                        <div class="bg-gray-50 p-4 rounded-lg border border-gray-100">
                            <h3 class="text-lg font-bold mb-4 text-indigo-600">Profile Information</h3>
                            <div class="space-y-2">
                                <p><span class="font-semibold">Name:</span> {{ $user->name }}</p>
                                <p><span class="font-semibold">Phone:</span> {{ $user->profile?->phone ?? 'Not provided' }}</p>
                                <p><span class="font-semibold">Address:</span> {{ $user->profile?->address ?? 'Not provided' }}</p>
                            </div>
                        </div>

                        <!-- Preferences Section -->
                        <div class="bg-gray-50 p-4 rounded-lg border border-gray-100">
                            <h3 class="text-lg font-bold mb-4 text-indigo-600">System Preferences (JSONB)</h3>
                            <div class="space-y-4">
                                <div class="flex items-center justify-between">
                                    <span>Theme:</span>
                                    <span class="px-3 py-1 rounded-full text-xs font-bold {{ ($user->preferences['theme'] ?? 'light') === 'dark' ? 'bg-gray-800 text-white' : 'bg-yellow-100 text-yellow-800' }}">
                                        {{ ucfirst($user->preferences['theme'] ?? 'light') }}
                                    </span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span>Notifications:</span>
                                    <span class="px-3 py-1 rounded-full text-xs font-bold {{ ($user->preferences['notifications'] ?? false) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800' }}">
                                        {{ ($user->preferences['notifications'] ?? false) ? 'Enabled' : 'Disabled' }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
