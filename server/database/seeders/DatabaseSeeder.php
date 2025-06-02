<?php

namespace Database\Seeders;

use App\Models\Gender;
use App\Models\Role;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $roles = [
            ['role_type' => 'administrator'],
            ['role_type' => 'manager'],
            ['role_type' => 'cashier'],
        ];

        $genders = [
            ['gender' => 'Male'],
            ['gender' => 'Female'],
            ['gender' => 'Others'],
        ];

        Role::insert($roles);
        Gender::insert($genders);

        // Create 10 Dummy Users
        User::factory(10)->create();
    }
}
