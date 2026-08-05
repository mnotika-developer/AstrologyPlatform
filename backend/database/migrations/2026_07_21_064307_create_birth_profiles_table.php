<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('birth_profiles', function (Blueprint $table) {

            $table->id();

            $table->foreignId('user_id')
                  ->unique()
                  ->constrained()
                  ->onDelete('cascade');

            $table->string('full_name');

            $table->enum('gender', [
                'male',
                'female',
                'other'
            ]);

            $table->date('date_of_birth');

            $table->time('time_of_birth')->nullable();

            $table->string('place_of_birth');

            $table->decimal('latitude',10,7)->nullable();

            $table->decimal('longitude',10,7)->nullable();

            $table->string('timezone')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('birth_profiles');
    }
};
