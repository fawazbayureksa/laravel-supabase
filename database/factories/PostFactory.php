<?php

namespace Database\Factories;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PostFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'thread_id' => null,
            'parent_id' => null,
            'body' => $this->faker->paragraph(),
            'visibility' => $this->faker->randomElement(['public', 'followers', 'private']),
            'likes_count' => $this->faker->numberBetween(0, 100),
            'comments_count' => $this->faker->numberBetween(0, 50),
            'reposts_count' => $this->faker->numberBetween(0, 20),
            'saves_count' => $this->faker->numberBetween(0, 10),
            'views_count' => $this->faker->numberBetween(0, 1000),
            'is_edited' => false,
        ];
    }
}