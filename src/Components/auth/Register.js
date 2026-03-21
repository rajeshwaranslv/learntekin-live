import React, { useMemo, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import firebase, { db } from "../../firebase";
import AuthLayout from "./ui/AuthLayout";
import AuthInput from "./ui/AuthInput";
import AuthButton from "./ui/AuthButton";

function Register() {
  const history = useHistory();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
      termsAccepted: false,
    },
  });

  const passwordValue = watch("password");
  const fullNameValue = watch("fullName");
  const emailValue = watch("email");
  const confirmPasswordValue = watch("confirmPassword");
  const roleValue = watch("role");

  const passwordRules = useMemo(
    () => ({
      required: "Password is required.",
      minLength: {
        value: 6,
        message: "Password must be at least 6 characters.",
      },
      pattern: {
        value: /^(?=.*[A-Za-z])(?=.*\d).{6,}$/,
        message: "Use at least one letter and one number.",
      },
    }),
    []
  );

  const handleRegister = async (values) => {
    setIsSubmitting(true);
    try {
      const { fullName, email, password, role } = values;
      const userCredential = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);

      if (userCredential.user) {
        await userCredential.user.updateProfile({ displayName: fullName });
        await db.collection("users").doc(userCredential.user.uid).set(
          {
            fullName,
            email,
            role,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true }
        );
      }

      toast.success("Registration successful. Welcome to LearnTEK!");
      history.push("/");
    } catch (error) {
      toast.error(error.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      formTitle="Create Account"
      formSubtitle="Start your skill journey with Learn TEK In."
    >
      <motion.form
        onSubmit={handleSubmit(handleRegister)}
        className="auth-form"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <AuthInput
          id="register-full-name"
          label="Full Name"
          type="text"
          autoComplete="name"
          ariaLabel="Full name"
          value={fullNameValue}
          registration={register("fullName", {
            required: "Full name is required.",
            minLength: {
              value: 3,
              message: "Full name must be at least 3 characters.",
            },
          })}
          error={errors.fullName}
        />

        <AuthInput
          id="register-email"
          label="Email"
          type="email"
          autoComplete="email"
          ariaLabel="Email address"
          value={emailValue}
          registration={register("email", {
            required: "Email is required.",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email address.",
            },
          })}
          error={errors.email}
        />

        <AuthInput
          id="register-password"
          label="Password"
          type="password"
          autoComplete="new-password"
          ariaLabel="Password"
          value={passwordValue}
          registration={register("password", passwordRules)}
          error={errors.password}
        />

        <AuthInput
          id="register-confirm-password"
          label="Confirm Password"
          type="password"
          autoComplete="new-password"
          ariaLabel="Confirm password"
          value={confirmPasswordValue}
          registration={register("confirmPassword", {
            required: "Please confirm your password.",
            validate: (value) =>
              value === passwordValue || "Passwords do not match.",
          })}
          error={errors.confirmPassword}
        />

        <div>
          <div className="auth-select-wrap">
            <select
              id="register-role"
              aria-label="Select role"
              aria-invalid={Boolean(errors.role)}
              className={`auth-input-field ${
                errors.role ? "auth-select-error" : "auth-select-field"
              }`}
              {...register("role", { required: "Please select your role." })}
            >
              <option value=""></option>
              <option value="Student">Student</option>
              <option value="Instructor">Instructor</option>
            </select>
            <label
              htmlFor="register-role"
              className={`auth-input-label ${
                roleValue
                  ? "auth-select-label-float"
                  : "auth-select-label-default"
              }`}
            >
              Select Role
            </label>
          </div>
          {errors.role ? (
            <p className="auth-input-error" role="alert">
              {errors.role.message}
            </p>
          ) : null}
        </div>

        <div>
          <label className="auth-checkbox auth-checkbox-top">
            <input
              type="checkbox"
              aria-label="Accept terms and conditions"
              className="auth-checkbox-input-top"
              {...register("termsAccepted", {
                required: "You must accept the Terms & Conditions.",
              })}
            />
            <span>
              I agree to the{" "}
                <a
                  href="#"
                  className="auth-text-link"
                >
                  Terms & Conditions
                </a>
              .
            </span>
          </label>
          {errors.termsAccepted ? (
            <p className="auth-input-error" role="alert">
              {errors.termsAccepted.message}
            </p>
          ) : null}
        </div>

        <AuthButton
          type="submit"
          loading={isSubmitting}
          disabled={!isValid || isSubmitting}
          aria-label="Register"
        >
          Register
        </AuthButton>

        <p className="auth-note">
          Already have an account?{" "}
          <Link
            to="/login"
            className="auth-text-link"
          >
            Login
          </Link>
        </p>
      </motion.form>
    </AuthLayout>
  );
}

export default Register;
