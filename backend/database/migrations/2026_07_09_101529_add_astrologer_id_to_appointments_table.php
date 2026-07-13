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
		Schema::table('appointments', function (Blueprint $table) {
			$table->unsignedBigInteger('astrologer_id')->nullable()->after('user_id');

			$table->foreign('astrologer_id')
				  ->references('id')
				  ->on('users')
				  ->onDelete('set null');
		});
	}

	public function down(): void
	{
		Schema::table('appointments', function (Blueprint $table) {
			$table->dropForeign(['astrologer_id']);
			$table->dropColumn('astrologer_id');
		});
	}
};
