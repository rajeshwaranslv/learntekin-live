import React, { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import firebase from "../../firebase";
import { loginFailure, loginSuccess } from "../../store/authActions";
import AuthLayout from "./ui/AuthLayout";
import AuthInput from "./ui/AuthInput";
import AuthButton from "./ui/AuthButton";
import SocialLoginButton from "./ui/SocialLoginButton";

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="auth-social-svg" aria-hidden="true">
    <path
      fill="#EA4335"
      d="M12 10.2v3.9h5.4c-.2 1.3-1.5 3.8-5.4 3.8-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.2.8 3.9 1.5l2.7-2.6C17 3.3 14.7 2.2 12 2.2 6.6 2.2 2.2 6.6 2.2 12s4.4 9.8 9.8 9.8c5.6 0 9.3-3.9 9.3-9.4 0-.6-.1-1-.1-1.5H12z"
    />
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" className="auth-social-svg" aria-hidden="true">
    <path
      fill="#0A66C2"
      d="M20.4 20.4h-3.5V14c0-1.5 0-3.5-2.1-3.5-2.1 0-2.4 1.6-2.4 3.4v6.5H8.9V9h3.3v1.6h.1c.5-.9 1.6-1.9 3.4-1.9 3.6 0 4.2 2.4 4.2 5.4v6.3zM5 7.4c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm1.8 13H3.2V9h3.6v11.4z"
    />
  </svg>
);

function Login() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const googleProvider = useMemo(() => new firebase.auth.GoogleAuthProvider(), []);
  const linkedInProvider = useMemo(
    () => new firebase.auth.OAuthProvider("linkedin.com"),
    []
  );

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      remember: true,
      resetEmail: "",
    },
  });

  const emailValue = watch("email");
  const passwordValue = watch("password");
  const resetEmailValue = watch("resetEmail");

  const handleLogin = async (values) => {
    const { email, password, remember } = values;
    const persistence = remember
      ? firebase.auth.Auth.Persistence.LOCAL
      : firebase.auth.Auth.Persistence.SESSION;

    setIsLoading(true);
    try {
      await firebase.auth().setPersistence(persistence);
      const userCredential = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);
      dispatch(loginSuccess(userCredential.user));
      toast.success("Login successful. Welcome back!");
      history.push("/");
    } catch (error) {
      dispatch(loginFailure(error.message));
      toast.error(error.message || "Unable to login.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (providerName) => {
    setSocialLoading(providerName);
    try {
      const provider =
        providerName === "google" ? googleProvider : linkedInProvider;
      const credential = await firebase.auth().signInWithPopup(provider);
      dispatch(loginSuccess(credential.user));
      toast.success("Signed in successfully.");
      history.push("/");
    } catch (error) {
      toast.error(
        error.message || "Social login failed. Please check provider setup."
      );
    } finally {
      setSocialLoading("");
    }
  };

  const handlePasswordReset = async () => {
    const emailToReset = getValues("resetEmail") || getValues("email");
    if (!emailToReset) {
      toast.error("Enter your email first to receive reset instructions.");
      return;
    }

    setIsResetting(true);
    try {
      await firebase.auth().sendPasswordResetEmail(emailToReset);
      toast.success("Password reset email sent.");
      setShowForgot(false);
    } catch (error) {
      toast.error(error.message || "Unable to send reset email.");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <AuthLayout
      formTitle="Welcome Back"
      formSubtitle="Sign in to continue your learning journey."
    >
      <motion.form
        onSubmit={handleSubmit(handleLogin)}
        className="auth-form"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <AuthInput
          id="login-email"
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
          id="login-password"
          label="Password"
          type="password"
          autoComplete="current-password"
          ariaLabel="Password"
          value={passwordValue}
          registration={register("password", {
            required: "Password is required.",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters.",
            },
          })}
          error={errors.password}
        />

        <div className="auth-row">
          <label className="auth-checkbox">
            <input
              type="checkbox"
              aria-label="Remember me"
              {...register("remember")}
            />
            <span>Remember Me</span>
          </label>
          <button
            type="button"
            onClick={() => setShowForgot((prev) => !prev)}
            className="auth-forgot-link auth-forgot-button"
            aria-label="Forgot password"
          >
            Forgot password?
          </button>
        </div>

        <AnimatePresence initial={false}>
          {showForgot ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="auth-reset-box"
            >
              <AuthInput
                id="reset-email"
                label="Reset Email"
                type="email"
                autoComplete="email"
                ariaLabel="Reset email"
                value={resetEmailValue}
                registration={register("resetEmail", {
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address.",
                  },
                })}
                error={errors.resetEmail}
              />
              <div className="auth-reset-action">
                <AuthButton
                  type="button"
                  variant="secondary"
                  onClick={handlePasswordReset}
                  loading={isResetting}
                  aria-label="Send reset email"
                >
                  Send reset email
                </AuthButton>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <AuthButton
          type="submit"
          loading={isLoading}
          disabled={!isValid || isLoading}
          aria-label="Login"
        >
          Login
        </AuthButton>

        <div className="auth-divider">
          <span>or continue with</span>
        </div>

        <div className="auth-social-grid">
          <SocialLoginButton
            label="Google"
            ariaLabel="Continue with Google"
            icon={<GoogleIcon />}
            disabled={Boolean(socialLoading)}
            onClick={() => handleSocialLogin("google")}
          />
          <SocialLoginButton
            label="LinkedIn"
            ariaLabel="Continue with LinkedIn"
            icon={<LinkedInIcon />}
            disabled={Boolean(socialLoading)}
            onClick={() => handleSocialLogin("linkedin")}
          />
        </div>

        <p className="auth-note">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="auth-text-link"
          >
            Sign Up
          </Link>
        </p>
      </motion.form>
    </AuthLayout>
  );
}

export default Login;
