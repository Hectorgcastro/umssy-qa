import type { CityOption } from "./city-option.types";
import type { PersonalInfoValues } from "./personal-info-values.types";
import type { ProfilePhotoFieldProps } from "./profile-photo-field-props.types";

export interface PersonalInfoFormProps {
  initialValues: PersonalInfoValues;
  cities?: CityOption[];
  isSaving?: boolean;
  photo?: ProfilePhotoFieldProps;
  onSubmit: (values: PersonalInfoValues) => void;
}
