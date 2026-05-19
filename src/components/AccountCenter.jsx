import { Home, LogOut, PackageCheck, Pencil, ReceiptText, Save, Sparkles, UserRound, X } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";

const getAccountCopy = (language) =>
  language === "en"
    ? {
        buttonGuest: "Sign in",
        buttonMember: "Account",
        title: "Account center",
        subtitleGuest: "Log in or create your Pawberry account.",
        subtitleMember: "Profile, orders, points, and address.",
        close: "Close account center",
        email: "Email",
        emailPlaceholder: "you@example.com",
        password: "Password",
        passwordPlaceholder: "At least 8 characters",
        confirmPassword: "Confirm password",
        confirmPasswordPlaceholder: "Enter password again",
        name: "Name",
        namePlaceholder: "Berry Dog Parent",
        login: "Log in",
        register: "Create account",
        showLogin: "Already have an account",
        showRegister: "Create a new account",
        saving: "Saving...",
        save: "Save",
        edit: "Edit",
        points: "Paw points",
        address: "Address",
        addressPlaceholder: "Sunny Lane, Shanghai",
        orders: "Order status",
        logout: "Log out",
        required: "Please enter your name.",
        authRequired: "Please enter your email and password.",
        passwordTooShort: "Password must be at least 8 characters.",
        passwordMismatch: "The two passwords do not match.",
        logoutFailed: "Logout failed. Please try again.",
        authFallback: "Something went wrong. Please try again.",
        authErrors: {
          INVALID_EMAIL: "Please enter a valid email address.",
          WEAK_PASSWORD: "Password must be at least 8 characters.",
          PASSWORD_MISMATCH: "The two passwords do not match.",
          EMAIL_EXISTS: "This email is already registered.",
          INVALID_LOGIN: "Email or password is incorrect.",
          AUTH_REQUIRED: "Please log in first.",
          INVALID_SESSION: "Your login session has expired. Please log in again.",
        },
      }
    : {
        buttonGuest: "\u767b\u5f55",
        buttonMember: "\u8d26\u6237",
        title: "\u4e2a\u4eba\u4e2d\u5fc3",
        subtitleGuest: "\u767b\u5f55\u6216\u521b\u5efa Pawberry \u8d26\u6237\u3002",
        subtitleMember: "\u8d44\u6599\u3001\u8ba2\u5355\u3001\u79ef\u5206\u548c\u5730\u5740\u90fd\u5728\u8fd9\u91cc\u3002",
        close: "\u5173\u95ed\u4e2a\u4eba\u4e2d\u5fc3",
        email: "\u90ae\u7bb1",
        emailPlaceholder: "you@example.com",
        password: "\u5bc6\u7801",
        passwordPlaceholder: "\u81f3\u5c11 8 \u4e2a\u5b57\u7b26",
        confirmPassword: "\u786e\u8ba4\u5bc6\u7801",
        confirmPasswordPlaceholder: "\u518d\u8f93\u5165\u4e00\u6b21\u5bc6\u7801",
        name: "\u59d3\u540d",
        namePlaceholder: "\u8393\u8393\u94f2\u5c4e\u5b98",
        login: "\u767b\u5f55",
        register: "\u521b\u5efa\u8d26\u6237",
        showLogin: "\u5df2\u6709\u8d26\u6237",
        showRegister: "\u521b\u5efa\u65b0\u8d26\u6237",
        saving: "\u6b63\u5728\u4fdd\u5b58...",
        save: "\u4fdd\u5b58",
        edit: "\u7f16\u8f91",
        points: "\u722a\u722a\u79ef\u5206",
        address: "\u5730\u5740",
        addressPlaceholder: "\u4e0a\u6d77\u5e02 \u9633\u5149\u5c0f\u533a",
        orders: "\u8ba2\u5355\u72b6\u6001",
        logout: "\u9000\u51fa\u767b\u5f55",
        required: "\u8bf7\u586b\u5199\u59d3\u540d\u3002",
        authRequired: "\u8bf7\u586b\u5199\u90ae\u7bb1\u548c\u5bc6\u7801\u3002",
        passwordTooShort: "\u5bc6\u7801\u81f3\u5c11\u9700\u8981 8 \u4e2a\u5b57\u7b26\u3002",
        passwordMismatch: "\u4e24\u6b21\u8f93\u5165\u7684\u5bc6\u7801\u4e0d\u4e00\u81f4\u3002",
        logoutFailed: "\u9000\u51fa\u5931\u8d25\uff0c\u8bf7\u91cd\u8bd5\u3002",
        authFallback: "\u64cd\u4f5c\u5931\u8d25\uff0c\u8bf7\u7a0d\u540e\u518d\u8bd5\u3002",
        authErrors: {
          INVALID_EMAIL: "\u8bf7\u8f93\u5165\u6709\u6548\u7684\u90ae\u7bb1\u5730\u5740\u3002",
          WEAK_PASSWORD: "\u5bc6\u7801\u81f3\u5c11\u9700\u8981 8 \u4e2a\u5b57\u7b26\u3002",
          PASSWORD_MISMATCH: "\u4e24\u6b21\u8f93\u5165\u7684\u5bc6\u7801\u4e0d\u4e00\u81f4\u3002",
          EMAIL_EXISTS: "\u8fd9\u4e2a\u90ae\u7bb1\u5df2\u7ecf\u6ce8\u518c\u3002",
          INVALID_LOGIN: "\u90ae\u7bb1\u6216\u5bc6\u7801\u4e0d\u6b63\u786e\u3002",
          AUTH_REQUIRED: "\u8bf7\u5148\u767b\u5f55\u3002",
          INVALID_SESSION: "\u767b\u5f55\u5df2\u8fc7\u671f\uff0c\u8bf7\u91cd\u65b0\u767b\u5f55\u3002",
        },
      };

function authErrorMessage(error, copy) {
  if (error?.code && copy.authErrors[error.code]) return copy.authErrors[error.code];
  return copy.authFallback;
}

export function AccountButton({ open, customer, language, onClick }) {
  const copy = getAccountCopy(language);

  return (
    <button className={open ? "account-button open" : "account-button"} type="button" aria-haspopup="dialog" aria-expanded={open} onClick={onClick}>
      <span className="account-avatar-mini">
        {customer ? customer.avatar : <UserRound size={16} strokeWidth={2.7} />}
      </span>
      <span className="account-button-label">{customer ? copy.buttonMember : copy.buttonGuest}</span>
    </button>
  );
}

export function AccountCenter({
  open,
  customer,
  authLoading,
  language,
  cartCount,
  onLogin,
  onLogout,
  onSaveCustomerName,
  onSaveCustomerAddress,
  onClose,
}) {
  const copy = getAccountCopy(language);
  const nameId = useId();
  const emailId = useId();
  const passwordId = useId();
  const confirmPasswordId = useId();
  const addressId = useId();
  const [name, setName] = useState(language === "en" ? "Berry Dog Parent" : "\u8393\u8393\u94f2\u5c4e\u5b98");
  const [authMode, setAuthMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [draftName, setDraftName] = useState("");
  const [draftAddress, setDraftAddress] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!customer) return;
    const nextName = customer.name?.[language] || customer.name?.zh || "";
    const nextAddress = customer.address?.[language] || customer.address?.zh || "";
    setName(nextName);
    setDraftName(nextName);
    setDraftAddress(nextAddress);
    setEditingName(false);
    setEditingAddress(false);
  }, [customer, language]);

  useEffect(() => {
    if (customer) return;
    setAuthMode("login");
    setPassword("");
    setConfirmPassword("");
    setError("");
    setEditingName(false);
    setEditingAddress(false);
  }, [customer]);

  useEffect(() => {
    if (!open) return undefined;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const closeOnEscape = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [onClose, open]);

  if (!open) return null;

  const address = customer?.address?.[language] || customer?.address?.zh;

  const handleAuth = async (event) => {
    event.preventDefault();

    if (!email.trim() || !password) {
      setError(copy.authRequired);
      return;
    }

    if (authMode === "register" && !name.trim()) {
      setError(copy.required);
      return;
    }

    if (authMode === "register" && password.length < 8) {
      setError(copy.passwordTooShort);
      return;
    }

    if (authMode === "register" && password !== confirmPassword) {
      setError(copy.passwordMismatch);
      return;
    }

    setError("");
    setSubmitting(true);
    try {
      await onLogin({
        mode: authMode,
        email: email.trim(),
        password,
        confirmPassword,
        name: name.trim(),
      });
      setPassword("");
      setConfirmPassword("");
    } catch (authError) {
      setError(authErrorMessage(authError, copy));
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    setError("");
    setSubmitting(true);
    try {
      await onLogout();
      setAuthMode("login");
      setPassword("");
      setConfirmPassword("");
    } catch {
      setError(copy.logoutFailed);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveName = async () => {
    if (!draftName.trim()) {
      setError(copy.required);
      return;
    }

    setError("");
    setSubmitting(true);
    await onSaveCustomerName(draftName.trim());
    setSubmitting(false);
    setEditingName(false);
  };

  const handleSaveAddress = async () => {
    if (!draftAddress.trim()) {
      setError(language === "en" ? "Please enter your address." : "\u8bf7\u586b\u5199\u5730\u5740\u3002");
      return;
    }

    setError("");
    setSubmitting(true);
    await onSaveCustomerAddress(draftAddress.trim());
    setSubmitting(false);
    setEditingAddress(false);
  };

  return createPortal(
    <>
      <button className="account-dismiss" type="button" aria-label={copy.close} onClick={onClose} />
      <aside className="account-panel account-panel-simple" role="dialog" aria-modal="true" aria-label={copy.title}>
        <div className="account-panel-header">
          <span className="account-panel-icon">
            <UserRound size={20} />
          </span>
          <div>
            <strong>{copy.title}</strong>
            <small>{customer ? copy.subtitleMember : copy.subtitleGuest}</small>
          </div>
          <button type="button" aria-label={copy.close} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {customer ? (
          <div className="account-quiet-view">
            <section className="account-name-card">
              <span className="account-avatar">
                <span>{customer.avatar}</span>
              </span>
              <div>
                <small>{copy.name}</small>
                {editingName ? (
                  <label className="account-inline-editor" htmlFor={nameId}>
                    <input id={nameId} value={draftName} onChange={(event) => setDraftName(event.target.value)} autoFocus />
                  </label>
                ) : (
                  <h2>{customer.name?.[language] || customer.name?.zh}</h2>
                )}
              </div>
              {editingName ? (
                <button className="account-icon-action" type="button" onClick={handleSaveName} disabled={submitting || authLoading} aria-label={copy.save}>
                  <Save size={18} />
                </button>
              ) : (
                <button className="account-icon-action" type="button" onClick={() => setEditingName(true)} aria-label={copy.edit}>
                  <Pencil size={18} />
                </button>
              )}
            </section>

            {error && <p className="account-error">{error}</p>}

            <section className="account-simple-metrics">
              <article>
                <Sparkles size={18} />
                <span>{copy.points}</span>
                <strong>{customer.points}</strong>
              </article>
              <article>
                <ReceiptText size={18} />
                <span>{language === "en" ? "Basket" : "\u8d2d\u7269\u7bee"}</span>
                <strong>{cartCount}</strong>
              </article>
            </section>

            <section className="account-simple-list">
              <article className="account-address-card">
                <Home size={18} />
                <div>
                  <span>{copy.address}</span>
                  {editingAddress ? (
                    <label className="account-inline-editor" htmlFor={addressId}>
                      <input
                        id={addressId}
                        value={draftAddress}
                        placeholder={copy.addressPlaceholder}
                        onChange={(event) => setDraftAddress(event.target.value)}
                        autoFocus
                      />
                    </label>
                  ) : (
                    <strong>{address}</strong>
                  )}
                </div>
                {editingAddress ? (
                  <button className="account-icon-action" type="button" onClick={handleSaveAddress} disabled={submitting || authLoading} aria-label={copy.save}>
                    <Save size={18} />
                  </button>
                ) : (
                  <button className="account-icon-action" type="button" onClick={() => setEditingAddress(true)} aria-label={copy.edit}>
                    <Pencil size={18} />
                  </button>
                )}
              </article>
            </section>

            <section className="account-orders account-orders-simple" aria-label={copy.orders}>
              <div className="account-section-title">
                <PackageCheck size={17} />
                <strong>{copy.orders}</strong>
              </div>
              {customer.recentOrders.map((order) => (
                <article key={order.id}>
                  <div>
                    <strong>{order.title[language] || order.title.zh}</strong>
                    <small>{order.id}</small>
                  </div>
                  <span>{order.status[language] || order.status.zh}</span>
                </article>
              ))}
            </section>

            <button className="account-logout" type="button" onClick={handleLogout} disabled={submitting || authLoading}>
              <LogOut size={17} />
              {copy.logout}
            </button>
          </div>
        ) : (
          <form className="account-login-form account-login-simple" onSubmit={handleAuth}>
            {authMode === "register" && (
              <label htmlFor={nameId}>
                <span>{copy.name}</span>
                <input id={nameId} value={name} placeholder={copy.namePlaceholder} onChange={(event) => setName(event.target.value)} />
              </label>
            )}
            <label htmlFor={emailId}>
              <span>{copy.email}</span>
              <input
                id={emailId}
                type="email"
                value={email}
                placeholder={copy.emailPlaceholder}
                autoComplete="email"
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>
            <label htmlFor={passwordId}>
              <span>{copy.password}</span>
              <input
                id={passwordId}
                type="password"
                value={password}
                placeholder={copy.passwordPlaceholder}
                autoComplete={authMode === "register" ? "new-password" : "current-password"}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>
            {authMode === "register" && (
              <label htmlFor={confirmPasswordId}>
                <span>{copy.confirmPassword}</span>
                <input
                  id={confirmPasswordId}
                  type="password"
                  value={confirmPassword}
                  placeholder={copy.confirmPasswordPlaceholder}
                  autoComplete="new-password"
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />
              </label>
            )}
            {error && <p className="account-error">{error}</p>}
            <button type="submit" disabled={submitting || authLoading}>
              <UserRound size={17} />
              {submitting || authLoading ? copy.saving : authMode === "register" ? copy.register : copy.login}
            </button>
            <button
              className="account-auth-switch"
              type="button"
              onClick={() => {
                setError("");
                setPassword("");
                setConfirmPassword("");
                setAuthMode((mode) => (mode === "register" ? "login" : "register"));
              }}
            >
              {authMode === "register" ? copy.showLogin : copy.showRegister}
            </button>
          </form>
        )}
      </aside>
    </>,
    document.body
  );
}
