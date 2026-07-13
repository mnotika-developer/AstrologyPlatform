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
        Schema::create('horoscope_reports', function (Blueprint $table) {
			$table->id();

			$table->foreignId('user_id')->constrained()->onDelete('cascade');

			$table->string('full_name');
			$table->date('date_of_birth');
			$table->time('birth_time')->nullable();
			$table->string('birth_place');

			$table->string('zodiac_sign')->nullable();

			$table->longText('prompt')->nullable();
			$table->longText('report');

			$table->string('report_type')->default('general');

			$table->timestamps();
		});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('horoscope_reports');
    }
};
