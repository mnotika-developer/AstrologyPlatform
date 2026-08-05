<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('birth_profiles', function (Blueprint $table) {

            $table->boolean('birth_time_known')->default(true)->after('date_of_birth');

            $table->string('country')->after('time_of_birth');

            $table->string('state')->nullable()->after('country');

            $table->string('city')->after('state');

            $table->dropColumn('place_of_birth');
        });
    }

    public function down(): void
    {
        Schema::table('birth_profiles', function (Blueprint $table) {

            $table->dropColumn([
                'birth_time_known',
                'country',
                'state',
                'city'
            ]);

            $table->string('place_of_birth');
        });
    }
};