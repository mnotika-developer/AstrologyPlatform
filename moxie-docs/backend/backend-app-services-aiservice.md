# Operational configuration for Gemini AIService and Laravel Sanctum

This area documents the runtime configuration that powers AI calls to Google Gemini and API authentication via Laravel Sanctum. It explains which environment variables are read, how they are used at runtime, the control flow and failure modes you will see in code.

## Architecture

- Entry points
  - AI: `backend/app/Services/AIService.php` constructs a request URL from `GEMINI_API_KEY` and `GEMINI_MODEL` and performs HTTP calls to Google’s Generative Language API.
  - Auth: Sanctum settings are read from `backend/config/sanctum.php`, which consumes `SANCTUM_STATEFUL_DOMAINS` and `SANCTUM_TOKEN_PREFIX` and configures guards and middleware.
- Data/control flow
  - AIService: on instantiation, reads `GEMINI_API_KEY` and `GEMINI_MODEL` from env and builds `https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={apikey}`. `generate($prompt)` performs a POST and returns a normalized array with `status`, `model`, `response`, and optional `usage`, or an error shape.
  - Sanctum: configuration defines which domains are treated as stateful for SPA cookie-based auth, which guard(s) are used for authentication, optional token prefixing, and middleware applied around session/cookie/CSRF handling.
- Related docs
  - Root `README.md` mentions Sanctum and AI integration but does not define runtime env. This page fills that gap.

## backend/app/Services/AIService.php

Responsibility
- Encapsulates calls to Google Gemini’s Generative Language API using Laravel’s HTTP client. Builds the URL from environment variables and returns a structured response or error details.

Environment variables
- GEMINI_API_KEY: API key passed as the `key` query parameter on the endpoint.
- GEMINI_MODEL: Model name interpolated into the path: `v1beta/models/{GEMINI_MODEL}:generateContent`.

Runtime behavior
- Constructor
  - Reads `env('GEMINI_API_KEY')` and `env('GEMINI_MODEL')` into `$this->apikey` and `$this->model`.
  - Constructs `$this->url` = `https://generativelanguage.googleapis.com/v1beta/models/{$this->model}:generateContent?key={$this->apikey}`.
- generate(string $prompt)
  - HTTP client settings: `timeout(120)`, `connectTimeout(20)`, `retry(3, 2000)` (3 attempts with 2s backoff between attempts).
  - POST body: `{ "contents": [ { "parts": [ { "text": $prompt } ] } ] }`.
  - Error handling
    - If `$response->successful()` is false: returns `['status' => false, 'message' => $response->body()]`.
    - On malformed model output: parses `$data = $response->json()` then extracts `$text = $data['candidates'][0]['content']['parts'][0]['text'] ?? ''`. Attempts `json_decode($text, true)`. If `json_last_error() !== JSON_ERROR_NONE`, returns `['status' => false, 'message' => 'Gemini returned invalid JSON.', 'raw_response' => $text]`.
    - On `ConnectionException`: returns `['status' => false, 'message' => 'Gemini API timeout. Please try again.']`.
    - On any other `\Throwable`: returns `['status' => false, 'message' => $e->getMessage()]`.
  - Success response
    - Returns `['status' => true, 'model' => $this->model, 'response' => $json, 'usage' => $data['usageMetadata'] ?? []]`.

Operational notes and failure modes
- Missing or empty GEMINI_API_KEY/GEMINI_MODEL
  - No explicit validation; the URL will be constructed with empty query or model segment. Google API will likely return a non-2xx error and the method returns `status: false` with the raw body of that error.
- Unexpected Gemini payload shape
  - If `candidates[0].content.parts[0].text` is missing, `$text` becomes `''`, causing `json_decode('')` to yield `null` with no error; however, `json_last_error()` will not necessarily flag this as an error. The code checks `json_last_error() !== JSON_ERROR_NONE` and will mark an error only if JSON is invalid; empty string decodes to `null` with an error flag of `JSON_ERROR_SYNTAX`, triggering the invalid JSON path and returning `raw_response`.
- Response contract to callers
  - Always returns an array; callers must check the boolean `status`. On success, `response` is the decoded JSON returned by the model from inside the `text` field, not the raw Gemini response. `usage` may be an empty array if absent.

## backend/config/sanctum.php

Responsibility
- Configures Laravel Sanctum for both SPA cookie-based and token-based authentication pathways, drawing defaults and overrides from environment variables.

Environment variables
- SANCTUM_STATEFUL_DOMAINS
  - Parsed via `explode(',', env('SANCTUM_STATEFUL_DOMAINS', sprintf('%s%s', 'localhost,localhost:3000,127.0.0.1,127.0.0.1:8000,::1', Sanctum::currentApplicationUrlWithPort(),)))`.
  - If not provided, defaults include local addresses plus `Sanctum::currentApplicationUrlWithPort()`.
- SANCTUM_TOKEN_PREFIX
  - Defaults to empty string: `env('SANCTUM_TOKEN_PREFIX', '')`.

Runtime behavior
- 'stateful'
  - Requests from these domains/hosts will receive stateful API authentication cookies. Intended for SPA frontends communicating with the API and expecting session/cookie auth.
- 'guard'
  - Uses `['web']`, meaning Sanctum will check the `web` guard first when authenticating a request. If none of the guards authenticate, Sanctum will fall back to a bearer token present on the request.
- 'expiration'
  - `null`, so issued tokens do not expire by this setting (token `expires_at` attributes are overridden by this if set, first-party sessions unaffected).
- 'token_prefix'
  - Optional prefix added to new tokens to aid secret scanning tools.
- 'middleware'
  - Applies `AuthenticateSession::class`, `EncryptCookies::class`, and `ValidateCsrfToken::class` when authenticating a first-party SPA with Sanctum.

Operational notes and failure modes
- Misconfigured SANCTUM_STATEFUL_DOMAINS
  - If your SPA origin is not listed, it will not receive stateful cookies; authentication will silently behave like a stateless API, often surfacing as CSRF or session issues in the browser.
- Token prefixing
  - Changing `SANCTUM_TOKEN_PREFIX` only affects newly issued tokens; existing tokens remain unchanged.
- Expiration
  - With `expiration => null`, tokens do not automatically expire via config. If your application expects rotation/expiry, you must enforce it elsewhere.

## backend/README.md

This is the standard Laravel upstream README and does not define application-specific environment variables or configuration for AI or Sanctum. Refer instead to the sections above.

## README.md (repository root)

Describes the overall platform and mentions “Sanctum Authentication” and “AI integration” but does not provide operational environment configuration. The required variables and their effects are documented in this page.

## Gotchas

- AIService assumes Gemini returns a JSON string inside `candidates[0].content.parts[0].text`.
  - If your prompts do not instruct the model to produce strict JSON, you will hit the "Gemini returned invalid JSON." error path with the raw text attached. Ensure prompts are crafted to return valid JSON when consumed by `AIService`.
- No default values for GEMINI_API_KEY and GEMINI_MODEL.
  - In non-local environments, forgetting to set either will result in non-2xx responses from Google; the service will return `status: false` with the raw error body. Validate these are present during boot/deploy.
- Timeouts and retries
  - `connectTimeout(20)` and `timeout(120)` with `retry(3, 2000)` can lead to ~6+ minutes worst-case under repeated connect stalls. Be mindful when calling `generate()` from request/response paths with stricter SLAs.
- Sanctum stateful domains
  - For local development with non-standard ports or hostnames, extend `SANCTUM_STATEFUL_DOMAINS` accordingly; otherwise, SPA auth will fail in ways that look like CSRF/config errors.
- Token lifetime
  - With `expiration` set to `null`, personal access tokens do not expire. If rotating credentials is a requirement, implement rotation policy or set a non-null expiration and handle re-issuance.

## Quick checklist

- Set GEMINI_API_KEY and GEMINI_MODEL in the backend environment.
- Confirm your SPA origin is included in SANCTUM_STATEFUL_DOMAINS.
- Optionally set SANCTUM_TOKEN_PREFIX for secret scanning friendliness.
- Verify prompt contracts produce valid JSON for AIService consumers.
- Account for the AIService timeout/retry behavior in calling contexts.