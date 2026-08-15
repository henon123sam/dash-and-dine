'use client';

import React, { useState, useEffect } from 'react';

// Interface for stored user account
interface UserAccount {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  countryCode: string;
}

export default function AuthPage({ onLoggedIn }: { onLoggedIn: (userEmail: string) => void }) {
  // Database synchronization using localStorage to remember accounts
  const [accounts, setAccounts] = useState<UserAccount[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('dine_and_dash_accounts');
    if (saved) {
      try {
        setAccounts(JSON.parse(saved));
      } catch (e) {
        setAccounts([]);
      }
    } else {
      const initialAccounts: UserAccount[] = [
        { email: 'henon123@gmail.com', password: 'password123', fullName: 'Henon Samuel', phone: '982803344', countryCode: '+251' }
      ];
      localStorage.setItem('dine_and_dash_accounts', JSON.stringify(initialAccounts));
      setAccounts(initialAccounts);
    }
  }, []);

  const saveNewAccount = (newAcc: UserAccount) => {
    const updated = [...accounts, newAcc];
    setAccounts(updated);
    localStorage.setItem('dine_and_dash_accounts', JSON.stringify(updated));
  };

  const updatePasswordInDb = (email: string, newPass: string) => {
    const updated = accounts.map(acc => acc.email.toLowerCase() === email.toLowerCase() ? { ...acc, password: newPass } : acc);
    setAccounts(updated);
    localStorage.setItem('dine_and_dash_accounts', JSON.stringify(updated));
  };

  const [isSignUp, setIsSignUp] = useState(false);
  const [step, setStep] = useState<'input' | 'signup_form' | 'password' | 'otp' | 'forgot_email' | 'forgot_code' | 'forgot_new_pass'>('input');

  // Form states
  const [identifier, setIdentifier] = useState(''); // email or phone for sign-in
  const [emailError, setEmailError] = useState('');

  // Create account inputs
  const [fullName, setFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [countryCode, setCountryCode] = useState('+251');
  const [phone, setPhone] = useState('');

  // Sign in password & OTP states
  const [signInPassword, setSignInPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');

  // Forgot password states
  const [forgotEmailInput, setForgotEmailInput] = useState('');
  const [resetCodeInput, setResetCodeInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const generatedResetCode = '7777'; // Mock verification code sent to email

  const isEmail = (val: string) => val.includes('@');

  // Real-time email duplicate check against database
  const handleSignupEmailChange = (val: string) => {
    setSignupEmail(val);
    const found = accounts.find(acc => acc.email.toLowerCase() === val.trim().toLowerCase());
    if (found) {
      setEmailError('Email already has an account. Would you like to sign in instead?');
    } else {
      setEmailError('');
    }
  };

  // Initial Sign-In router
  const handleInitialSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      alert('Please enter your email or phone number.');
      return;
    }

    if (isEmail(identifier)) {
      // Check if email exists in database
      const exists = accounts.find(acc => acc.email.toLowerCase() === identifier.trim().toLowerCase());
      if (!exists) {
        alert('No account found with this email. Please create an account first.');
        setIsSignUp(true);
        setSignupEmail(identifier);
        setStep('signup_form');
        return;
      }
      setStep('password');
    } else {
      // Phone number -> send SMS code
      alert(`SMS verification code (Mock: 1234) sent to phone: ${identifier}`);
      setStep('otp');
    }
  };

  // Create Account submission
  const handleCreateAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailError) return;
    if (!fullName || !signupEmail || !signupPassword || !phone) {
      alert('Please fill out all fields completely.');
      return;
    }

    const newAccount: UserAccount = {
      email: signupEmail.trim().toLowerCase(),
      password: signupPassword,
      fullName,
      phone,
      countryCode,
    };

    saveNewAccount(newAccount);
    alert(`Account successfully created and saved in database for ${fullName}! Please sign in now.`);
    
    // Switch to sign in view with email pre-filled
    setIsSignUp(false);
    setIdentifier(signupEmail);
    setStep('password');
    // Reset sign up fields
    setFullName('');
    setSignupEmail('');
    setSignupPassword('');
    setPhone('');
  };

  // Final Sign-In with Password
  const handlePasswordSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    const account = accounts.find(acc => acc.email.toLowerCase() === identifier.trim().toLowerCase());
    if (account && account.password !== signInPassword) {
      alert('Incorrect password. Please try again or use Forgot Password.');
      return;
    }
    onLoggedIn(identifier);
  };

  // Final Sign-In with OTP
  const handleOtpSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode !== '1234' && otpCode.length !== 4) {
      alert('Please enter a valid 4-digit verification code (e.g., 1234).');
      return;
    }
    onLoggedIn(identifier);
  };

  // Forgot password flow handlers
  const handleSendResetCode = (e: React.FormEvent) => {
    e.preventDefault();
    const account = accounts.find(acc => acc.email.toLowerCase() === forgotEmailInput.trim().toLowerCase());
    if (!account) {
      alert('No registered account found with this email address.');
      return;
    }
    alert(`Password reset code sent to ${forgotEmailInput}! (Demo code is: 7777)`);
    setStep('forgot_code');
  };

  const handleVerifyResetCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (resetCodeInput !== generatedResetCode) {
      alert('Invalid code. Please enter the correct 4-digit code sent to your email.');
      return;
    }
    setStep('forgot_new_pass');
  };

  const handleSaveNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPasswordInput || newPasswordInput.length < 6) {
      alert('Password must be at least 6 characters long.');
      return;
    }
    updatePasswordInDb(forgotEmailInput, newPasswordInput);
    alert('Password successfully updated! You can now sign in with your new password.');
    setIsSignUp(false);
    setIdentifier(forgotEmailInput);
    setStep('password');
    setForgotEmailInput('');
    setResetCodeInput('');
    setNewPasswordInput('');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 text-neutral-900 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-neutral-200 shadow-2xl relative">
        
        {/* Header Branding (Red & White Theme) */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-black text-red-600 tracking-wider mb-1">DINE & DASH</h1>
          <p className="text-neutral-500 text-xs font-semibold uppercase tracking-widest">Speed & Flavor Delivered</p>
        </div>

        {/* Toggle Bar: Sign In vs Create Account */}
        {step !== 'forgot_email' && step !== 'forgot_code' && step !== 'forgot_new_pass' && (
          <div className="flex bg-neutral-100 p-1 rounded-full mb-6 border border-neutral-200">
            <button
              type="button"
              className={`flex-1 py-2 text-xs font-bold rounded-full transition ${!isSignUp ? 'bg-red-600 text-white shadow-md' : 'text-neutral-600 hover:text-neutral-900'}`}
              onClick={() => { setIsSignUp(false); setStep('input'); setEmailError(''); }}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`flex-1 py-2 text-xs font-bold rounded-full transition ${isSignUp ? 'bg-red-600 text-white shadow-md' : 'text-neutral-600 hover:text-neutral-900'}`}
              onClick={() => { setIsSignUp(true); setStep('signup_form'); setEmailError(''); }}
            >
              Create Account
            </button>
          </div>
        )}

        {/* --- CREATE ACCOUNT FLOW --- */}
        {isSignUp && step === 'signup_form' && (
          <form onSubmit={handleCreateAccountSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1 uppercase tracking-wider">Full Name</label>
              <input
                type="text"
                required
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 text-neutral-900 text-sm"
                placeholder="Abebe Kebede"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                required
                className={`w-full px-3.5 py-2.5 bg-neutral-50 border rounded-xl focus:outline-none focus:ring-2 text-neutral-900 text-sm ${
                  emailError ? 'border-red-600 ring-2 ring-red-600/30' : 'border-neutral-300 focus:ring-red-600'
                }`}
                placeholder="name@example.com"
                value={signupEmail}
                onChange={(e) => handleSignupEmailChange(e.target.value)}
              />
              {emailError && (
                <div className="mt-1.5 p-2.5 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between">
                  <span className="text-[11px] text-red-700 font-medium leading-tight">{emailError}</span>
                  <button
                    type="button"
                    onClick={() => { setIsSignUp(false); setStep('password'); setIdentifier(signupEmail); }}
                    className="text-[11px] font-extrabold text-red-600 hover:underline ml-2 whitespace-nowrap"
                  >
                    Sign In
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1 uppercase tracking-wider">Password</label>
              <input
                type="password"
                required
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 text-neutral-900 text-sm"
                placeholder="••••••••"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1 uppercase tracking-wider">Phone Number</label>
              <div className="flex gap-2">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="px-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 text-neutral-900 text-sm font-semibold"
                >
                  <option value="+251">+251 (ET)</option>
                  <option value="+1">+1 (US)</option>
                  <option value="+44">+44 (UK)</option>
                  <option value="+254">+254 (KE)</option>
                  <option value="+971">+971 (UAE)</option>
                </select>
                <input
                  type="text"
                  required
                  className="flex-1 px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 text-neutral-900 text-sm"
                  placeholder="982803344"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={Boolean(emailError)}
              className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:bg-neutral-200 disabled:text-neutral-400 text-white font-extrabold rounded-xl transition shadow-md text-sm mt-3"
            >
              Complete Account Creation
            </button>
          </form>
        )}

        {/* --- SIGN IN FLOW: INITIAL INPUT --- */}
        {!isSignUp && step === 'input' && (
          <form onSubmit={handleInitialSignInSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1 uppercase tracking-wider">
                Email or Phone Number
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 text-neutral-900 text-sm"
                placeholder="name@example.com or phone"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl transition shadow-md text-sm"
            >
              Continue
            </button>
          </form>
        )}

        {/* --- SIGN IN FLOW: PASSWORD STEP --- */}
        {!isSignUp && step === 'password' && (
          <form onSubmit={handlePasswordSignIn} className="space-y-4">
            <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200 flex items-center justify-between mb-2">
              <span className="text-xs text-neutral-700 font-semibold truncate max-w-[220px]">{identifier}</span>
              <button 
                type="button" 
                onClick={() => setStep('input')} 
                className="text-xs text-red-600 font-bold hover:underline"
              >
                Switch
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1 uppercase tracking-wider">Password</label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 text-neutral-900 text-sm"
                placeholder="••••••••"
                value={signInPassword}
                onChange={(e) => setSignInPassword(e.target.value)}
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => { setStep('forgot_email'); setForgotEmailInput(isEmail(identifier) ? identifier : ''); }}
                className="text-xs text-red-600 font-bold hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl transition shadow-md text-sm"
            >
              Sign In
            </button>
          </form>
        )}

        {/* --- SIGN IN FLOW: OTP STEP --- */}
        {!isSignUp && step === 'otp' && (
          <form onSubmit={handleOtpSignIn} className="space-y-4">
            <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200 flex items-center justify-between mb-2">
              <span className="text-xs text-neutral-700 font-semibold">SMS code sent to {identifier}</span>
              <button 
                type="button" 
                onClick={() => setStep('input')} 
                className="text-xs text-red-600 font-bold hover:underline"
              >
                Edit
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1 uppercase tracking-wider">Enter 4-Digit Code</label>
              <input
                type="text"
                maxLength={4}
                required
                className="w-full px-4 py-3 text-center tracking-widest text-xl font-black bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 text-neutral-900"
                placeholder="1234"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
              />
              <p className="text-[11px] text-neutral-500 mt-1 text-center">Demo code: 1234</p>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl transition shadow-md text-sm"
            >
              Verify & Sign In
            </button>
          </form>
        )}

        {/* --- FORGOT PASSWORD FLOW: STEP 1 (Enter Email) --- */}
        {step === 'forgot_email' && (
          <form onSubmit={handleSendResetCode} className="space-y-4">
            <div className="text-center mb-2">
              <h2 className="text-sm font-bold text-neutral-800">Reset Your Password</h2>
              <p className="text-xs text-neutral-500 mt-1">Enter your registered email address and we will send you a verification code.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 text-neutral-900 text-sm"
                placeholder="name@example.com"
                value={forgotEmailInput}
                onChange={(e) => setForgotEmailInput(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl transition shadow-md text-sm"
            >
              Send Reset Code
            </button>

            <button
              type="button"
              onClick={() => setStep('password')}
              className="w-full py-2 text-xs text-neutral-600 hover:text-neutral-900 font-bold text-center block"
            >
              Back to Sign In
            </button>
          </form>
        )}

        {/* --- FORGOT PASSWORD FLOW: STEP 2 (Enter Code) --- */}
        {step === 'forgot_code' && (
          <form onSubmit={handleVerifyResetCode} className="space-y-4">
            <div className="text-center mb-2">
              <h2 className="text-sm font-bold text-neutral-800">Enter Verification Code</h2>
              <p className="text-xs text-neutral-500 mt-1">We sent a 4-digit code to {forgotEmailInput}</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1 uppercase tracking-wider">4-Digit Code</label>
              <input
                type="text"
                maxLength={4}
                required
                className="w-full px-4 py-3 text-center tracking-widest text-xl font-black bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 text-neutral-900"
                placeholder="7777"
                value={resetCodeInput}
                onChange={(e) => setResetCodeInput(e.target.value)}
              />
              <p className="text-[11px] text-neutral-500 mt-1 text-center">Demo code: 7777</p>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl transition shadow-md text-sm"
            >
              Verify Code
            </button>

            <button
              type="button"
              onClick={() => setStep('forgot_email')}
              className="w-full py-2 text-xs text-neutral-600 hover:text-neutral-900 font-bold text-center block"
            >
              Resend Code
            </button>
          </form>
        )}

        {/* --- FORGOT PASSWORD FLOW: STEP 3 (New Password) --- */}
        {step === 'forgot_new_pass' && (
          <form onSubmit={handleSaveNewPassword} className="space-y-4">
            <div className="text-center mb-2">
              <h2 className="text-sm font-bold text-neutral-800">Create New Password</h2>
              <p className="text-xs text-neutral-500 mt-1">Enter your new secure password below.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1 uppercase tracking-wider">New Password</label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 text-neutral-900 text-sm"
                placeholder="At least 6 characters"
                value={newPasswordInput}
                onChange={(e) => setNewPasswordInput(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl transition shadow-md text-sm"
            >
              Reset Password & Sign In
            </button>
          </form>
        )}

      </div>
    </div>
  );
}