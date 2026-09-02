<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Http\Client\ConnectionException;

class AIService
{
	
	protected $apikey;
	protected $model;
	protected $url;
    
    public function __construct()
    {
		
        $this->apikey=env('GEMINI_API_KEY');
		$this->model=env('GEMINI_MODEL');
		$this->url = "https://generativelanguage.googleapis.com/v1beta/models/{$this->model}:generateContent?key={$this->apikey}";
    }
    /**
     * Bootstrap any application services.
     */
    
	public function generate($prompt)
	{
		try {

			$response = Http::timeout(150)
				->connectTimeout(20)
				->retry(3, 2000)
				->post($this->url, [
					"contents" => [
						[
							"parts" => [
								[
									"text" => $prompt
								]
							]
						]
					]
				]);

			if (!$response->successful()) {

				return [
					"status" => false,
					"message" => $response->body()
				];
			}

			$data = $response->json();

			$text = $data['candidates'][0]['content']['parts'][0]['text'] ?? '';

			$json = json_decode($text, true);

			if (json_last_error() !== JSON_ERROR_NONE) {
				return [
					"status" => false,
					"message" => "Gemini returned invalid JSON.",
					"raw_response" => $text
				];
			}

			return [
				"status" => true,
				"model" => $this->model,
				"response" => $json,
				"usage" => $data['usageMetadata'] ?? []
			];

		} catch (ConnectionException $e) {

			return [
				"status" => false,
				"message" => "Gemini API timeout. Please try again."
			];

		} catch (\Throwable $e) {

			return [
				"status" => false,
				"message" => $e->getMessage()
			];
		}
	}
}
