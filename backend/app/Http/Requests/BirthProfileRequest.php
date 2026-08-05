<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BirthProfileRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }
	
	protected function prepareForValidation(): void
	{
		if($this->filled('time_of_birth')){
			$this->merge([
				'time_of_birth'=> substr($this->time_of_birth, 0, 5)
			]);
		}
		$this->merge([
			'birth_time_known' => filter_var(
				$this->birth_time_known,
				FILTER_VALIDATE_BOOLEAN
			),
		]);
	}
	

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [

            'full_name' => [
                'required',
                'string',
                'max:255'
            ],

            'relation' => [
                'required',
                Rule::in([
                    'Self',
                    'Father',
                    'Mother',
                    'Husband',
                    'Wife',
                    'Son',
                    'Daughter',
                    'Brother',
                    'Sister',
                    'Friend',
                    'Other'
                ])
            ],

            'gender' => [
                'required',
                Rule::in([
                    'male',
                    'female',
                    'other'
                ])
            ],

            'date_of_birth' => [
                'required',
                'date',
                'before_or_equal:today'
            ],

            'birth_time_known' => [
                'required',
                'boolean'
            ],

            'time_of_birth' => [
                'required_if:birth_time_known,true',
                'nullable',
                'date_format:H:i'
            ],

            'country' => [
                'required',
                'string',
                'max:100'
            ],

            'state' => [
                'nullable',
                'string',
                'max:100'
            ],

            'city' => [
                'required',
                'string',
                'max:100'
            ],

        ];
    }
	
	public function messages(): array
	{
		return [
			'time_of_birth.required_if' =>
                'Please enter birth time if it is known.',

            'date_of_birth.before_or_equal' =>
                'Date of birth cannot be in the future.',

            'relation.in' =>
                'Please select a valid relation.',

            'gender.in' =>
                'Please select a valid gender.',
		
		];
	}
}
