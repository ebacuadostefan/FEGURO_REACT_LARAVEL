import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import ErrorHandler from "../../../handler/ErrorHandler";
import { useNavigate } from 'react-router-dom';
import { Gender } from "../../../interfaces/users/Gender";
import { Role } from "../../../interfaces/users/Role";
import { UserFieldErrors } from "../../../interfaces/users/UserFieldErrors";
import GenderService from "../../../services/users/genderService";
import RoleService from "../../../services/users/roleService";
import UserService from "../../../services/users/userService";

interface UserFormProps {
  setSubmitForm: React.MutableRefObject<(() => void) | null>;
  setLoadingStore: (loading: boolean) => void;
  onUserAdded: (message: string) => void;
}

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === "string");

// Helper to safely sanitize errors response to expected type
const sanitizeErrors = (errors: any): UserFieldErrors => {
  const sanitized: UserFieldErrors = {};
  if (typeof errors === "object" && errors !== null) {
    for (const key in errors) {
      if (Object.prototype.hasOwnProperty.call(errors, key)) {
        if (isStringArray(errors[key])) {
          sanitized[key as keyof UserFieldErrors] = errors[key];
        }
      }
    }
  }
  return sanitized;
};

const UserForm = ({
  setSubmitForm,
  setLoadingStore,
  onUserAdded,
}: UserFormProps) => {
  const [state, setState] = useState({
    loadingGenders: true,
    loadingRoles: true,
    genders: [] as Gender[],
    roles: [] as Role[],
    avatar: "" as string | File,
    name: "",
    gender: "",
    email: "",
    password: "",
    password_confirmation: "",
    role_type: "",
    errors: {} as UserFieldErrors,
  });

  const navigate = useNavigate();

  const [avatarPreview, setAvatarPreview] = useState<string>("");

  const handleResetNecessaryFields = () => {
    setState((prevState) => ({
      ...prevState,
      avatar: "" as string | File,
      name: "",
      gender: "",
      email: "",
      password: "",
      password_confirmation: "",
      role_type: "",
      errors: {} as UserFieldErrors,
    }));
    setAvatarPreview("");
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name } = e.target;

    if (name === "avatar" && e.target instanceof HTMLInputElement) {
      const file = e.target.files && e.target.files[0];
      if (file) {
        const previewUrl = URL.createObjectURL(file);
        setAvatarPreview(previewUrl);

        setState((prevState) => ({
          ...prevState,
          avatar: file,
          // Clear avatar errors on new file select
          errors: { ...prevState.errors, avatar: undefined },
        }));
      } else {
        setAvatarPreview("");
        setState((prevState) => ({
          ...prevState,
          avatar: "",
          errors: { ...prevState.errors, avatar: undefined },
        }));
      }
    } else {
      const { value } = e.target;
      setState((prevState) => ({
        ...prevState,
        [name]: value,
        errors: { ...prevState.errors, [name]: undefined },
      }));
    }
  };

  const handleLoadGenders = () => {
    GenderService.fetchGenders()
      .then((res) => {
        if (res.status === 200) {
          setState((prevState) => ({
            ...prevState,
            genders: res.data.genders,
          }));
        } else {
          console.error(
            "Unexpected status error while loading genders: ",
            res.status
          );
        }
      })
      .catch((error) => {
        ErrorHandler(error, null);
      })
      .finally(() => {
        setState((prevState) => ({
          ...prevState,
          loadingGenders: false,
        }));
      });
  };

  const handleLoadRoles = () => {
    RoleService.fetchRoles()
      .then((res) => {
        if (res.status === 200) {
          setState((prevState) => ({
            ...prevState,
            roles: res.data.roles,
          }));
        } else {
          console.error(
            "Unexpected status error while fetching roles: ",
            res.status
          );
        }
      })
      .catch((error) => {
        ErrorHandler(error, null);
      })
      .finally(() => {
        setState((prevState) => ({
          ...prevState,
          loadingRoles: false,
        }));
      });
  };

  const handleCancelButton = () => {
    navigate('/users');
  };

  const handleStoreUser = (e: FormEvent) => {
    e.preventDefault();

    setLoadingStore(true);

    const formData = new FormData();
    formData.append("name", state.name);
    formData.append("gender", state.gender);
    formData.append("email", state.email);
    formData.append("password", state.password);
    formData.append("password_confirmation", state.password_confirmation);
    formData.append("role_type", state.role_type);

    if (state.avatar && state.avatar instanceof File) {
      formData.append("avatar", state.avatar);
    }

    UserService.storeUser(formData)
      .then((res) => {
        if (res.status === 200) {
          handleResetNecessaryFields();
          onUserAdded(res.data.message);
          navigate('/users');
        } else {
          console.error(
            "Unexpected status error while storing user: ",
            res.status
          );
        }
      })
      .catch((error) => {
        if (error.response?.status === 422) {
          const sanitizedErrors = sanitizeErrors(error.response.data.errors);
          setState((prevState) => ({
            ...prevState,
            errors: sanitizedErrors,
          }));
        } else {
          ErrorHandler(error, null);
        }
      })
      .finally(() => {
        setLoadingStore(false);
      });
  };

  useEffect(() => {
    if (state.password_confirmation && state.password !== state.password_confirmation) {
        setState((prevState) => ({
        ...prevState,
        errors: {
            ...prevState.errors,
            password_confirmation: ['Passwords do not match'],
        }
        }));
    } else {
        setState((prevState) => {
        const newErrors = { ...prevState.errors };
        delete newErrors.password_confirmation;
        return { ...prevState, errors: newErrors };
        });
    }
    }, [state.password, state.password_confirmation]);

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    handleLoadGenders();
    handleLoadRoles();

    setSubmitForm.current = () => {
      if (formRef.current) {
        formRef.current.requestSubmit();
      }
    };
  }, [setSubmitForm]);

  return (
    <>
      <form
        ref={formRef}
        onSubmit={handleStoreUser}
        encType="multipart/form-data"
        noValidate
      >
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-8 offset-md-2">
              {/* Name */}
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Full Name
                </label>
                <input
                  type="text"
                  className={`form-control ${state.errors.name ? "is-invalid" : ""}`}
                  name="name"
                  id="name"
                  value={state.name}
                  onChange={handleInputChange}
                />
                {state.errors.name && (
                  <div className="invalid-feedback">{state.errors.name[0]}</div>
                )}
              </div>

              {/* Gender */}
              <div className="mb-3">
                <label htmlFor="gender" className="form-label">
                  Gender
                </label>
                <select
                  className={`form-select ${state.errors.gender ? "is-invalid" : ""}`}
                  name="gender"
                  id="gender"
                  value={state.gender}
                  onChange={handleInputChange}
                >
                  <option value="">Select Gender</option>
                  {state.loadingGenders ? (
                    <option disabled>Loading...</option>
                  ) : (
                    state.genders.map((gender) => (
                      <option key={gender.id} value={gender.id}>
                        {gender.gender}
                      </option>
                    ))
                  )}
                </select>
                {state.errors.gender && (
                  <div className="invalid-feedback">{state.errors.gender[0]}</div>
                )}
              </div>

              {/* Role */}
              <div className="mb-3">
                <label htmlFor="role" className="form-label">
                  Role
                </label>
                <select
                  className={`form-select ${state.errors.role ? "is-invalid" : ""}`}
                  name="role_type"
                  id="role"
                  value={state.role_type}
                  onChange={handleInputChange}>
                  <option value="">Select Role</option>
                  {state.loadingRoles ? (
                    <option disabled>Loading...</option>
                  ) : (
                    state.roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.role_type}
                      </option>
                    ))
                  )}
                </select>
                {state.errors.role && (
                  <div className="invalid-feedback">{state.errors.role[0]}</div>
                )}
              </div>

              {/* Email */}
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email address
                </label>
                <input
                  type="email"
                  className={`form-control ${state.errors.email ? "is-invalid" : ""}`}
                  name="email"
                  id="email"
                  value={state.email}
                  onChange={handleInputChange}
                />
                {state.errors.email && (
                  <div className="invalid-feedback">{state.errors.email[0]}</div>
                )}
              </div>

              {/* Password */}
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className={`form-control ${state.errors.password ? "is-invalid" : ""}`}
                  name="password"
                  id="password"
                  value={state.password}
                  onChange={handleInputChange}
                />
                {state.errors.password && (
                  <div className="invalid-feedback">{state.errors.password[0]}</div>
                )}
              </div>

              {/* Password Confirmation */}
              <div className="mb-3">
                <label htmlFor="password_confirmation" className="form-label">
                  Confirm Password
                </label>
                <input
                  type="password"
                  className={`form-control ${
                    state.errors.password_confirmation ? "is-invalid" : ""
                  }`}
                  name="password_confirmation"
                  id="password_confirmation"
                  value={state.password_confirmation}
                  onChange={handleInputChange}
                />
                {state.errors.password_confirmation && (
                  <div className="invalid-feedback">
                    {state.errors.password_confirmation[0]}
                  </div>
                )}
              </div>

              {/* Profile */}
              <div className="mb-3">
                <label htmlFor="avatar" className="form-label">
                  Profile
                </label>
                <input
                  type="file"
                  className={`form-control ${state.errors.avatar ? "is-invalid" : ""}`}
                  name="avatar"
                  id="avatar"
                  accept="image/*"
                  onChange={handleInputChange}
                />
                {state.errors.avatar && (
                  <div className="invalid-feedback">
                    {typeof state.errors.avatar[0] === "string"
                      ? state.errors.avatar[0]
                      : String(state.errors.avatar[0])}
                  </div>
                )}
                {avatarPreview && (
                  <img
                    src={avatarPreview}
                    alt="Avatar Preview"
                    className="img-thumbnail mt-2"
                    style={{ maxWidth: "200px" }}
                  />
                )}
              </div>
                <div className="d-flex justify-content-end gap-2">
                    <button onClick={handleCancelButton} type="button" className="btn btn-secondary">Cancel</button>
                    <button type="submit" className="btn btn-primary" disabled={state.loadingRoles || state.loadingGenders}>Submit</button>
                </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default UserForm;