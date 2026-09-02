# Configuration: environment, Sanctum, and AI keys

This area documents how the backend integrates with Google’s Generative Language (Gemini) API and what environment configuration is required for it to work. It focuses on the AIService, which encapsulates outbound calls, error handling, and the contract it returns to callers.

## Architecture

- Entry point: application code instantiates `App\Services\AIService` and calls `generate($prompt)`.
- Configuration: `AIService` reads `GEMINI_API_KEY` and `GEMINI_MODEL` from environment at construction.
- Outbound HTTP: uses Laravel’s `Http` facade to call Google’s Generative Language API at `https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={GEMINI_API_KEY}`.
- Data flow: prompt string → POST body `contents[0].parts[0].text` → Gemini response JSON → extracts candidate text → expects JSON in that text → decodes and returns structured array with status, model, response, and usage.
- Error handling: non-2xx, invalid JSON in model output, connection timeouts, and unexpected throwables are converted to a consistent failure shape.

## backend/app/Services/AIService.php

Responsibility
- Encapsulates all interaction with the Gemini API, including URL construction from environment, request timeouts/retries, response shaping, and error normalization.

Environment
- Requires `GEMINI_API_KEY` and `GEMINI_MODEL` to be set. These are read in `__construct()` and used to build the request URL: `https://generativelanguage.googleapis.com/v1beta/models/{$this->model}:generateContent?key={$this->apikey}`.

Public API
- Method: `generate(string $prompt): array`
- Input: `$prompt` is the text sent to Gemini. It is placed at `contents[0].parts[0].text` per the v1beta API.
- Behavior:
  - Issues `POST` with:
    - Timeouts: `timeout(150)` seconds total, `connectTimeout(20)` seconds to establish connection.
    - Retries: `retry(3, 2000)` → up to 3 retries with 2000 ms backoff between attempts.
    - Body:
      - `{
          "contents": [
            {
              "parts": [
                { "text": "<prompt>" }
              ]
            }
          ]
        }`
  - On non-successful HTTP response (`$response->successful()` is false): returns
    - `[
        "status" => false,
        "message" => $response->body()
      ]`
  - On success: parses JSON body to `$data`, extracts candidate text at `$data['candidates'][0]['content']['parts'][0]['text'] ?? ''`.
    - Attempts to `json_decode` that text; if decoding fails, returns
      - `[
          "status" => false,
          "message" => "Gemini returned invalid JSON.",
          "raw_response" => $text
        ]`
    - If decoding succeeds, returns
      - `[
          "status" => true,
          "model" => $this->model,
          "response" => $json,
          "usage" => $data['usageMetadata'] ?? []
        ]`
  - On connection timeout (`ConnectionException`): returns
    - `[
        "status" => false,
        "message" => "Gemini API timeout. Please try again."
      ]`
  - On any other throwable: returns
    - `[
        "status" => false,
        "message" => $e->getMessage()
      ]`

Auth/Authorization
- Outbound auth is via the `key` query parameter in the request URL built from `GEMINI_API_KEY`. There is no additional bearer token or header-based auth in this service.

Dependencies
- `Illuminate\Support\Facades\Http` for HTTP client, timeouts, retries.
- `Illuminate\Http\Client\ConnectionException` for timeout error handling.

Contract for Callers
- Success shape:
  - `status: true`
  - `model: string` (from `GEMINI_MODEL`)
  - `response: array` (decoded from the model’s returned text)
  - `usage: array` (from `$data['usageMetadata']` if present, otherwise empty array)
- Failure shapes include:
  - Non-2xx: `{ status: false, message: <raw response body> }`
  - Invalid JSON in model output: `{ status: false, message: "Gemini returned invalid JSON.", raw_response: <text> }`
  - Connection timeout: `{ status: false, message: "Gemini API timeout. Please try again." }`
  - Unexpected errors: `{ status: false, message: <exception message> }`

Notes on Response Parsing
- The service assumes Gemini returns at least one candidate with a content part containing `text` at index `[0]`. Missing or differently structured responses will result in an empty `$text` and likely a JSON decode failure.

## Gotchas
- Ensure `GEMINI_API_KEY` and `GEMINI_MODEL` are set in the runtime environment; missing values will build an invalid URL and cause failures that surface as non-successful HTTP or other exceptions.
- The service expects the model’s `text` to be valid JSON. If your prompts elicit natural language, you will get `Gemini returned invalid JSON.` with the raw response attached. Design prompts to force JSON-only output if you depend on `response` being an array.
- Retries apply to transport-level/transient failures per Laravel HTTP client behavior; application-level 4xx/5xx from Gemini are not retried and return the raw body in `message`.
- Timeouts are relatively high (`timeout(150)`) to accommodate long generations; be mindful of upstream request time budgets to avoid tying up workers.
- The API key is sent via query string; avoid logging full URLs to prevent leaking credentials.