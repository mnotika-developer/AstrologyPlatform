<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\BirthProfileRepository;
use App\Repositories\Contracts\BirthProfileRepositoryInterface;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
	{
		$this->app->bind(

			BirthProfileRepositoryInterface::class,

			BirthProfileRepository::class

		);
	}

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
