// UserForm.tsx
import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
  RefObject,
  useCallback,
} from "react";
import ErrorHandler from "../../../handler/ErrorHandler";
import { useNavigate, useParams } from "react-router-dom";
import { Gender } from "../../../interfaces/users/Gender";
import { Role } from "../../../interfaces/users/Role";
import { UserFieldErrors } from "../../../interfaces/users/UserFieldErrors";
import GenderService from "../../../services/users/genderService";
import RoleService from "../../../services/users/roleService";
import UserService from "../../../services/users/userService";
import ToastNotification from "../../ToastNotification";

interface UserFormProps {
  setSubmitForm?: RefObject<(() => void) | null | undefined>;
  setLoadingStore?: (value: boolean) => void;
  onUserSubmitSuccess?: (message: string) => void;
}

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === "string");

const sanitizeErrors = (errors: any): UserFieldErrors => {
  const sanitized: UserFieldErrors = {};
  if (typeof errors === "object" && errors !== null) {
    for (const key in errors) {
      if (Object.prototype.hasOwnProperty.call(errors, key)) {
        const errorKey = key as keyof UserFieldErrors;
        if (isStringArray(errors[key])) {
          sanitized[errorKey] = errors[key];
        } else if (typeof errors[key] === 'string') {
          sanitized[errorKey] = [errors[key]];
        }
      }
    }
  }
  return sanitized;
};


const UserForm = ({
  setSubmitForm,
  setLoadingStore,
  onUserSubmitSuccess,
}: UserFormProps) => {
  const { user_id: userIdParam } = useParams<{ user_id?: string }>();
  const navigate = useNavigate();

  const isEditMode = Boolean(userIdParam);
  const userId = userIdParam ? parseInt(userIdParam, 10) : null;

  const [state, setState] = useState({
    loadingGenders: true,
    loadingRoles: true,
    loadingUser: isEditMode,
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

  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const formRef = useRef<HTMLFormElement>(null);

  const [toastState, setToastState] = useState({
    isVisible: false,
    message: "",
    type: "success" as "success" | "error",
  });

  const showToast = useCallback((message: string, type: "success" | "error") => {
    setToastState({ message, type, isVisible: true });
  }, []);

  const handleCloseToast = () => {
    setToastState((prev) => ({ ...prev, isVisible: false }));
  };

  const handleResetNecessaryFields = () => {
    setState((prevState) => ({
      ...prevState,
      avatar: "" as string | File,
      name: "",
      gender: "",
      email: "",
      password: "",
      password_confirmation: "",
      role_type: prevState.roles.length > 0 && !isEditMode ? prevState.role_type : "",
      errors: {} as UserFieldErrors,
    }));
    setAvatarPreview("");
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name } = e.target;

    if (name === "avatar" && e.target instanceof HTMLInputElement) {
      const files = e.target.files;
      const file = files && files[0];
      if (file) {
        const previewUrl = URL.createObjectURL(file);
        setAvatarPreview(previewUrl);
        setState((prevState) => ({
          ...prevState,
          avatar: file,
          errors: { ...prevState.errors, [name]: undefined },
        }));
      } else {
        const originalAvatarUrl = (isEditMode && typeof state.avatar === 'string')
          ? state.avatar
          : "";
        setAvatarPreview(originalAvatarUrl);
        setState((prevState) => ({
          ...prevState,
          avatar: originalAvatarUrl,
          errors: { ...prevState.errors, [name]: undefined },
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

  useEffect(() => {
    GenderService.fetchGenders()
      .then((res) => {
        if (res.status === 200) setState((prev) => ({ ...prev, genders: res.data.genders }));
        else {
            console.error("Error loading genders:", res.status);
            showToast(`Failed to load genders (Status: ${res.status})`, "error");
        }
      })
      .catch((err) => {
        ErrorHandler(err, null);
        showToast(err.message || "An error occurred while fetching genders.", "error");
      })
      .finally(() => setState((prev) => ({ ...prev, loadingGenders: false })));

    RoleService.fetchRoles()
      .then((res) => {
        if (res.status === 200) setState((prev) => ({ ...prev, roles: res.data.roles }));
        else {
            console.error("Error loading roles:", res.status);
            showToast(`Failed to load roles (Status: ${res.status})`, "error");
        }
      })
      .catch((err) => {
        ErrorHandler(err, null);
        showToast(err.message || "An error occurred while fetching roles.", "error");
      })
      .finally(() => setState((prev) => ({ ...prev, loadingRoles: false })));
  }, [showToast]);

  useEffect(() => {
    if (isEditMode && userId) {
      setState(prevState => ({ ...prevState, loadingUser: true }));
      UserService.getUser(userId)
        .then((res) => {
          if (res && res.user) {
            const userData = res.user as any;

            let genderValueToSet = "";
            if (userData.gender_id !== undefined && userData.gender_id !== null) {
                genderValueToSet = String(userData.gender_id);
            } else if (userData.gender && typeof userData.gender === 'object' && userData.gender.id !== undefined && userData.gender.id !== null) {
                genderValueToSet = String(userData.gender.id);
            } else if (userData.gender !== undefined && userData.gender !== null && ! (typeof userData.gender === 'object') ) {
                genderValueToSet = String(userData.gender);
            }

            let roleValueToSet = "";
            if (userData.role_id !== undefined && userData.role_id !== null) {
                roleValueToSet = String(userData.role_id);
            } else if (userData.role && typeof userData.role === 'object' && userData.role.id !== undefined && userData.role.id !== null) {
                roleValueToSet = String(userData.role.id);
            } else if (userData.role_type && typeof userData.role_type === 'object' && userData.role_type.id !== undefined && userData.role_type.id !== null) {
                roleValueToSet = String(userData.role_type.id);
            } else if (userData.role && !(typeof userData.role === 'object')) {
                roleValueToSet = String(userData.role);
            } else if (userData.role_type && !(typeof userData.role_type === 'object')) {
                roleValueToSet = String(userData.role_type);
            }

            setState((prevState) => ({
              ...prevState,
              name: userData.name || "",
              gender: genderValueToSet,
              email: userData.email || "",
              role_type: roleValueToSet,
              avatar: userData.avatar || "",
            }));
            
            if (userData.avatar) {
              const apiBaseUrl = import.meta.env.VITE_SERVER_BASE_URL; 
              setAvatarPreview(`${apiBaseUrl}/storage/avatars/${userData.avatar}`);
            }
          } else {
             const errorMessage = `User data not found or in unexpected format for user ID ${userId}`;
             console.error(errorMessage, res);
             showToast(errorMessage, "error");
             ErrorHandler({ message: `Failed to load user data for ID ${userId}. Ensure your API returns data in { user: { ... } } format.` }, navigate);
          }
        })
        .catch((error) => {
            const message = error.response?.data?.message || error.message || "Failed to load user data.";
            showToast(message, "error");
            ErrorHandler(error, navigate);
        })
        .finally(() => setState(prevState => ({ ...prevState, loadingUser: false })));
    }
  }, [isEditMode, userId, navigate, showToast]);

   useEffect(() => {
    if (setSubmitForm) {
      setSubmitForm.current = () => {
        if (formRef.current) formRef.current.requestSubmit();
      };
    }
    return () => {
      if (setSubmitForm && setSubmitForm.current) setSubmitForm.current = null;
    };
  }, [setSubmitForm, formRef]);

  useEffect(() => {
    if (state.password) {
      if (state.password_confirmation && state.password !== state.password_confirmation) {
        setState((prevState) => ({
          ...prevState,
          errors: { ...prevState.errors, password_confirmation: ["Passwords do not match"] },
        }));
      } else if (!state.password_confirmation) {
         setState((prevState) => ({
          ...prevState,
          errors: { ...prevState.errors, password_confirmation: ["Please confirm your new password"] },
        }));
      } else {
        setState((prevState) => {
          const newErrors = { ...prevState.errors };
          delete newErrors.password_confirmation;
          return { ...prevState, errors: newErrors };
        });
      }
    } else {
      setState((prevState) => {
        const newErrors = { ...prevState.errors };
        delete newErrors.password_confirmation;
        if(isEditMode) delete newErrors.password;
        return { ...prevState, errors: newErrors };
      });
    }
  }, [state.password, state.password_confirmation, isEditMode]);


  const handleCancelButton = () => navigate("/users");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (setLoadingStore) setLoadingStore(true);

    const formData = new FormData();
    formData.append("name", state.name);
    formData.append("gender", state.gender);
    formData.append("email", state.email);
    formData.append("role_type", state.role_type);

    if (state.password) {
      formData.append("password", state.password);
      formData.append("password_confirmation", state.password_confirmation);
    }
    if (state.avatar && state.avatar instanceof File) {
      formData.append("avatar", state.avatar);
    }

    const submissionPromise = (isEditMode && userId)
      ? UserService.updateUser(userId, formData)
      : UserService.storeUser(formData);

    submissionPromise
      .then((res) => {
        if (res.status === 200 || (res.status === 201 && !isEditMode)) {
          const successMessage = res.data?.message || (isEditMode ? "User updated successfully!" : "User added successfully!");
          if (!isEditMode) {
            handleResetNecessaryFields();
          }
          showToast(successMessage, "success");
          if (onUserSubmitSuccess) {
            onUserSubmitSuccess(successMessage);
          }

          setTimeout(() => {
            navigate("/users");
          }, 1500);

        } else {
          if (res.data?.errors) {
            setState(prev => ({ ...prev, errors: sanitizeErrors(res.data.errors) }));
          } else {
            const errorMessage = res.data?.message || `Operation failed with unexpected status: ${res.status}`;
            showToast(errorMessage, "error");
          }
        }
      })
      .catch((error) => {
        if (error.response?.status === 422 && error.response.data?.errors) {
          setState((prevState) => ({ ...prevState, errors: sanitizeErrors(error.response.data.errors) }));
        } else {
          const message = error.response?.data?.message || error.message || "An unexpected error occurred during submission.";
          showToast(message, "error");
        }
      })
      .finally(() => {
        if (setLoadingStore) setLoadingStore(false);
      });
  };

  if (state.loadingUser && isEditMode) {
    return <div className="container text-center mt-5"><p>Loading user data...</p></div>;
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      encType="multipart/form-data"
      noValidate>
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-8 offset-md-2 shadow-sm rounded-2">
            <h2 className="my-3">{isEditMode ? "Edit User" : "Add New User"}</h2>

            {/* Avatar Input */}
            <div className="mb-3">
              {avatarPreview && (
                <div className="mt-2">
                  <img src={avatarPreview} alt="Avatar Preview" className="img-thumbnail" style={{ maxWidth: "128px", maxHeight: "128px", clipPath: "circle()", objectFit: 'cover' }} />
                </div>
              )}
              <label htmlFor="avatar" className="form-label">Profile Picture (Optional)</label>
              <input type="file" className={`form-control ${state.errors.avatar ? "is-invalid" : ""}`}
                name="avatar" id="avatar" accept="image/*" onChange={handleInputChange} />
              {state.errors.avatar && <div className="invalid-feedback">{Array.isArray(state.errors.avatar) ? state.errors.avatar[0] : typeof state.errors.avatar === 'string' ? state.errors.avatar : 'Invalid avatar.'}</div>}
            </div>

            {/* Name Input */}
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Full Name</label>
              <input
                type="text"
                className={`form-control ${state.errors.name ? "is-invalid" : ""}`}
                name="name" id="name" value={state.name} onChange={handleInputChange}
              />
              {state.errors.name && <div className="invalid-feedback">{state.errors.name[0]}</div>}
            </div>

            {/* Gender Select */}
            <div className="mb-3">
              <label htmlFor="gender" className="form-label">Gender</label>
              <select
                className={`form-select ${state.errors.gender ? "is-invalid" : ""}`}
                name="gender" id="gender" value={state.gender} onChange={handleInputChange}>
                <option value="">Select Gender</option>
                {state.loadingGenders ? <option disabled>Loading...</option> :
                  state.genders.map((g) => <option key={g.id} value={g.id}>{g.gender}</option>)}
              </select>
              {state.errors.gender && <div className="invalid-feedback">{state.errors.gender[0]}</div>}
            </div>

            {/* Role Select */}
            <div className="mb-3">
              <label htmlFor="role_type" className="form-label">Role</label>
              <select
                className={`form-select ${state.errors.role ? "is-invalid" : ""}`}
                name="role_type" id="role_type" value={state.role_type} onChange={handleInputChange}>
                <option value="">Select Role</option>
                {state.loadingRoles ? <option disabled>Loading...</option> :
                  state.roles.map((r) => <option key={r.id} value={r.id}>{r.role_type}</option>)}
              </select>
              {state.errors.role && <div className="invalid-feedback">{state.errors.role[0]}</div>}
            </div>

            {/* Email Input */}
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email address</label>
              <input
                type="email"
                className={`form-control ${state.errors.email ? "is-invalid" : ""}`}
                name="email" id="email" value={state.email} onChange={handleInputChange}
              />
              {state.errors.email && <div className="invalid-feedback">{state.errors.email[0]}</div>}
            </div>

            {/* Password Input */}
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className={`form-control ${state.errors.password ? "is-invalid" : ""}`}
                name="password" id="password" value={state.password} onChange={handleInputChange}
                placeholder={isEditMode ? "Leave blank to keep current" : ""}
              />
              {state.errors.password && <div className="invalid-feedback">{state.errors.password[0]}</div>}
            </div>

            {/* Confirm Password Input */}
            <div className="mb-3">
              <label htmlFor="password_confirmation" className="form-label">Confirm Password</label>
              <input
                type="password"
                className={`form-control ${state.errors.password_confirmation ? "is-invalid" : ""}`}
                name="password_confirmation" id="password_confirmation" value={state.password_confirmation} onChange={handleInputChange}
                placeholder={isEditMode && !state.password ? "Leave blank" : "Confirm password"}
              />
              {state.errors.password_confirmation && <div className="invalid-feedback">{state.errors.password_confirmation[0]}</div>}
            </div>

            {/* Action Buttons */}
            <div className="d-flex justify-content-end mb-3">
              <button type="button" className="btn btn-secondary me-2" onClick={handleCancelButton}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={state.loadingGenders || state.loadingRoles || (isEditMode && state.loadingUser) || (setLoadingStore !== undefined && state.loadingUser /* This condition might need adjustment based on when setLoadingStore is true */ )}>
                {isEditMode ? "Update User" : "Save User"}
              </button>
            </div>
          </div>
        </div>
        {/* Toast Notification */}
        <ToastNotification
          message={toastState.message}
          type={toastState.type}
          onClose={handleCloseToast}
          isVisible={toastState.isVisible}
        />
      </div>
    </form>
  );
};

export default UserForm;