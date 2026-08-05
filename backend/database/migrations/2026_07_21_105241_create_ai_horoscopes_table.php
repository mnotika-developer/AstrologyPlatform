<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ai_horoscopes', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('birth_profile_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();

            $table->string('model')->default('gemini-2.5-flash');

            $table->longText('prompt');

            $table->json('response');

            $table->integer('input_tokens')->nullable();
            $table->integer('output_tokens')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ai_horoscopes');
    }
};