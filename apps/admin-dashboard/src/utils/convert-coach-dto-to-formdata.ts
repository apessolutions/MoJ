import type { CreateCoachDTO } from 'src/types/coach';

export const convertCreateCoachDtoToFormData = (
  coachDto: CreateCoachDTO,
  isUpdate?: boolean
): FormData => {
  const formData = new FormData();

  const appendFormData = (key: string, value: any) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value.toString());
    }
  };

  appendFormData('name_ar', coachDto.name_ar);
  appendFormData('name_en', coachDto.name_en);
  appendFormData('email', coachDto.email);
  appendFormData('dialing_code', coachDto.dialing_code);
  appendFormData('phone', coachDto.phone.replace(coachDto.dialing_code, ''));
  appendFormData('password', coachDto.password);
  appendFormData('job_title', coachDto.job_title);
  appendFormData('biography_ar', coachDto.biography_ar);
  appendFormData('biography_en', coachDto.biography_en);
  appendFormData('date_of_birth', coachDto.date_of_birth);
  appendFormData('gender', coachDto.gender);
  appendFormData('country_id', coachDto.country_id);

  coachDto.experiences.forEach((experience, index) => {
    appendFormData(`experiences[${index}][title_ar]`, experience.title_ar);
    appendFormData(`experiences[${index}][title_en]`, experience.title_en);
    appendFormData(`experiences[${index}][type]`, experience.type);
    appendFormData(`experiences[${index}][from_date]`, experience.from_date);
    appendFormData(`experiences[${index}][to_date]`, experience.to_date);
    appendFormData(`experiences[${index}][location]`, experience.location);
  });

  coachDto.services.forEach((service, index) => {
    appendFormData(`services[${index}][id]`, service.id);
  });

  coachDto.locales.forEach((locale, index) => {
    appendFormData(`locales[${index}][id]`, locale.id);
  });

  coachDto.limitations.forEach((limitation, index) => {
    appendFormData(`limitations[${index}][id]`, limitation.id);
  });

  coachDto.countries_of_operation.forEach((country, index) => {
    appendFormData(`countries_of_operation[${index}][country_id]`, country.country_id);
    appendFormData(`countries_of_operation[${index}][commission]`, country.commission);
    appendFormData(`countries_of_operation[${index}][status]`, country.status);
  });

  coachDto.attachments.forEach((file, index) => {
    if (file instanceof File) {
      formData.append(`attachments[${index}]`, file);
    }
  });

  if (coachDto.profile_picture instanceof File) {
    formData.append('profile_picture', coachDto.profile_picture);
  }
  if (isUpdate) {
    formData.append('_method', 'PUT');
  }

  return formData;
};
