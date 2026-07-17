<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('appointments', function (Blueprint $table) {

            $table->foreignId('availability_id')
                  ->nullable()
                  ->after('astrologer_id')
                  ->constrained('availabilities')
                  ->nullOnDelete();

        });
    }

    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {

            $table->dropForeign(['availability_id']);
            $table->dropColumn('availability_id');

        });
    }
};