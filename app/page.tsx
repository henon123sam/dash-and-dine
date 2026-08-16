'use client'
import React, { useState, useEffect } from 'react';

interface UserAccount {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  countryCode: string;
}

interface FoodItem {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
}

interface CartItem extends FoodItem {
  quantity: number;
}

const mockFoodMenu: FoodItem[] = [
  { id: 1, name: 'Doro Wat Special', category: 'Traditional', price: 450, image: '🍛', description: 'Traditional spicy chicken stew with hard-boiled egg and injera.' },
  { id: 2, name: 'Kitfo Special', category: 'Traditional', price: 520, image: '🥩', description: 'Minced lean beef seasoned with mitmita and clarified butter.' },
  { id: 3, name: 'Dash Supreme Burger', category: 'Fast Food', price: 380, image: '🍔', description: 'Double beef patty, melted cheddar, crispy bacon, and signature sauce.' },
  { id: 4, name: 'Spicy Pepperoni Pizza', category: 'Fast Food', price: 600, image: '🍕', description: 'Loaded with double pepperoni, mozzarella cheese, and chili flakes.' },
  { id: 5, name: 'Fresh Avocado Juice', category: 'Drinks', price: 150, image: '🥑', description: 'Layered fresh fruit smoothie with mango and strawberry.' },
  { id: 6, name: 'Tibbs Firfir', category: 'Traditional', price: 410, image: '🍲', description: 'Tender cubed beef sautéed with onions, rosemary, and berbere sauce.' },
];

export default function DashApp() {
  const [accounts, setAccounts] = useState<UserAccount[]>([]);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    const savedAccounts = localStorage.getItem('dash_app_accounts');
    if (savedAccounts) {
      try {
        setAccounts(JSON.parse(savedAccounts));
      } catch (e) {
        setAccounts([]);
      }
    } else {
      const initialAccounts: UserAccount[] = [
        { email: 'henon123@gmail.com', password: 'password123', fullName: 'Henon Samuel', phone: '982803344', countryCode: '+251' }
      ];
      localStorage.setItem('dash_app_accounts', JSON.stringify(initialAccounts));
      setAccounts(initialAccounts);
    }

    const active = localStorage.getItem('dash_app_current_user');
    if (active) setCurrentUser(active);
  }, []);

  const getFirstName = (emailOrPhone: string) => {
    if (emailOrPhone === 'guest_user') return 'Guest';
    const account = accounts.find(acc => acc.email.toLowerCase() === emailOrPhone.toLowerCase());
    if (account && account.fullName) {
      return account.fullName.split(' ')[0];
    }
    return emailOrPhone.split('@')[0];
  };

  const saveNewAccount = (newAcc: UserAccount) => {
    const updated = [...accounts, newAcc];
    setAccounts(updated);
    localStorage.setItem('dash_app_accounts', JSON.stringify(updated));
  };

  const updatePasswordInDb = (email: string, newPass: string) => {
    const targetEmail = email.trim().toLowerCase();
    const existingIndex = accounts.findIndex(acc => acc.email.toLowerCase() === targetEmail);
    
    let updated: UserAccount[];
    if (existingIndex !== -1) {
      updated = accounts.map(acc => 
        acc.email.toLowerCase() === targetEmail ? { ...acc, password: newPass } : acc
      );
    } else {
      const newAcc: UserAccount = {
        email: targetEmail,
        password: newPass,
        fullName: targetEmail.split('@')[0],
        phone: '000000000',
        countryCode: '+251'
      };
      updated = [...accounts, newAcc];
    }
    
    setAccounts(updated);
    localStorage.setItem('dash_app_accounts', JSON.stringify(updated));
  };

  const handleLoginSuccess = (email: string) => {
    setCurrentUser(email);
    localStorage.setItem('dash_app_current_user', email);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('dash_app_current_user');
  };

  const handleGoogleLogin = () => {
    const googleEmail = 'google_user@gmail.com';
    const existing = accounts.find(acc => acc.email.toLowerCase() === googleEmail);
    if (!existing) {
      const googleAccount: UserAccount = {
        email: googleEmail,
        password: 'google_oauth_secure',
        fullName: 'Google User',
        phone: '911000000',
        countryCode: '+251'
      };
      saveNewAccount(googleAccount);
    }
    handleLoginSuccess(googleEmail);
  };

  const handleGuestLogin = () => {
    handleLoginSuccess('guest_user');
  };

  // Auth screen states
  const [isSignUp, setIsSignUp] = useState(false);
  const [step, setStep] = useState<'input' | 'signup_form' | 'password' | 'otp' | 'forgot_email' | 'forgot_new_pass'>('input');
  const [identifier, setIdentifier] = useState('');
  const [emailError, setEmailError] = useState('');

  // Create account inputs
  const [fullName, setFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [countryCode, setCountryCode] = useState('+251');
  const [phone, setPhone] = useState('');

  // Sign in states
  const [signInPassword, setSignInPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');

  // Forgot password states
  const [forgotEmailInput, setForgotEmailInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');

  const isEmail = (val: string) => val.includes('@');

  const handleSignupEmailChange = (val: string) => {
    setSignupEmail(val);
    const found = accounts.find(acc => acc.email.toLowerCase() === val.trim().toLowerCase());
    if (found) {
      setEmailError('Email already has an account. Would you like to sign in instead?');
    } else {
      setEmailError('');
    }
  };

  const handleInitialSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      alert('Please enter your email or phone number.');
      return;
    }

    if (isEmail(identifier)) {
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
      alert(`SMS verification code (Mock: 1234) sent to phone: ${identifier}`);
      setStep('otp');
    }
  };

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
    alert(`Account successfully created for ${fullName}! Please sign in now.`);
    setIsSignUp(false);
    setIdentifier(signupEmail);
    setStep('password');
    setFullName('');
    setSignupEmail('');
    setSignupPassword('');
    setPhone('');
  };

  const handlePasswordSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    const account = accounts.find(acc => acc.email.toLowerCase() === identifier.trim().toLowerCase());
    if (account && account.password !== signInPassword) {
      alert('Incorrect password. Please try again or use Forgot Password.');
      return;
    }
    handleLoginSuccess(identifier);
  };

  const handleOtpSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode !== '1234' && otpCode.length !== 4) {
      alert('Please enter a valid 4-digit verification code (e.g., 1234).');
      return;
    }
    handleLoginSuccess(identifier);
  };

  const handleProceedToNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmailInput.trim()) {
      alert('Please enter your email address.');
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
    alert('New password successfully saved in database! You can now sign in.');
    setIsSignUp(false);
    setIdentifier(forgotEmailInput);
    setStep('password');
    setForgotEmailInput('');
    setNewPasswordInput('');
  };

  // Main Dashboard States
  const [mainTab, setMainTab] = useState<'dine' | 'dash' | 'cart'>('dine');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Cart Management Functions
  const addToCart = (item: FoodItem) => {
    setCart(prevCart => {
      const existing = prevCart.find(cartItem => cartItem.id === item.id);
      if (existing) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const getTotalCartPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Dash Trip Map States
  const [pickupLocation, setPickupLocation] = useState('Bole Medhanialem, Addis Ababa');
  const [destinationLocation, setDestinationLocation] = useState('Piazza, Addis Ababa');
  const [tripActive, setTripActive] = useState(false);

  // Filtered menu items
  const filteredMenu = selectedCategory === 'All' 
    ? mockFoodMenu 
    : mockFoodMenu.filter(item => item.category === selectedCategory);

  // --- RENDER: AUTH PAGE ---
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6 text-neutral-900 font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-neutral-200 shadow-2xl relative">
          
          <div className="text-center mb-6">
            <h1 className="text-3xl font-black text-red-600 tracking-wider mb-1">DINE & DASH</h1>
            <p className="text-neutral-500 text-xs font-semibold uppercase tracking-widest">Speed & Flavor Delivered</p>
          </div>

          {step !== 'forgot_email' && step !== 'forgot_new_pass' && (
            <>
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

              <div className="space-y-2 mb-6">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full py-2.5 px-4 bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-800 font-bold rounded-xl text-xs flex items-center justify-center gap-2.5 transition shadow-sm"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.18v3.15C3.17 21.36 7.23 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.38-1.5-.38-2.24s.13-1.52.38-2.24V6.61H1.18C.43 8.12 0 9.82 0 12s.43 3.88 1.18 5.39l4.09-3.15z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.23 0 3.17 2.64 1.18 6.61l4.09 3.15c.95-2.85 3.6-4.96 6.73-4.96z"/>
                  </svg>
                  Sign in with Google
                </button>
                <button
                  type="button"
                  onClick={handleGuestLogin}
                  className="w-full py-2.5 px-4 bg-neutral-100 border border-neutral-200 hover:bg-neutral-200 text-neutral-700 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition"
                >
                  <span className="text-base">👤</span> Continue as Guest
                </button>
                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-neutral-200"></div>
                  <span className="flex-shrink mx-4 text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Or with email / phone</span>
                  <div className="flex-grow border-t border-neutral-200"></div>
                </div>
              </div>
            </>
          )}

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

              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider">Password</label>
                <button
                  type="button"
                  onClick={() => { setStep('forgot_email'); setForgotEmailInput(isEmail(identifier) ? identifier : ''); }}
                  className="text-xs text-red-600 font-bold hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              <div>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 text-neutral-900 text-sm"
                  placeholder="••••••••"
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl transition shadow-md text-sm"
              >
                Sign In
              </button>
            </form>
          )}

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

          {step === 'forgot_email' && (
            <form onSubmit={handleProceedToNewPassword} className="space-y-4">
              <div className="flex items-center mb-1">
                <button
                  type="button"
                  onClick={() => setStep('password')}
                  className="p-2 -ml-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-full transition flex items-center gap-1.5 text-xs font-bold"
                  title="Go back"
                >
                  <span>←</span> Back
                </button>
              </div>

              <div className="text-center mb-2">
                <h2 className="text-sm font-bold text-neutral-800">Reset Your Password</h2>
                <p className="text-xs text-neutral-500 mt-1">Enter your account email to set a new password.</p>
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
                Continue to New Password
              </button>
            </form>
          )}

          {step === 'forgot_new_pass' && (
            <form onSubmit={handleSaveNewPassword} className="space-y-4">
              <div className="flex items-center mb-1">
                <button
                  type="button"
                  onClick={() => setStep('forgot_email')}
                  className="p-2 -ml-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-full transition flex items-center gap-1.5 text-xs font-bold"
                  title="Go back"
                >
                  <span>←</span> Back
                </button>
              </div>

              <div className="text-center mb-2">
                <h2 className="text-sm font-bold text-neutral-800">Create New Password</h2>
                <p className="text-xs text-neutral-500 mt-1">Enter your new secure password for <span className="font-bold text-neutral-800">{forgotEmailInput}</span></p>
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
                Save New Password & Sign In
              </button>
            </form>
          )}

        </div>
      </div>
    );
  }

  // --- RENDER: MAIN DASHBOARD (DINE & DASH MENU, CART, & LIVE MAP) ---
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900 font-sans flex flex-col">
      
      {/* Top Header Navigation */}
      <header className="bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-50">
        
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-black tracking-widest text-red-600 drop-shadow-sm">
            DINE <span className="text-neutral-900">&</span> DASH
          </h1>
          <span className="text-xs bg-red-50 text-red-700 font-extrabold px-3 py-1.5 rounded-full border border-red-200">
            Welcome, {getFirstName(currentUser)}!
          </span>
        </div>

        {/* Navigation Tabs: Dine, Dash, Cart */}
        <div className="flex bg-neutral-100 p-1.5 rounded-full border border-neutral-200 gap-1 sm:gap-2">
          <button
            onClick={() => setMainTab('dine')}
            className={`flex items-center space-x-2 px-4 sm:px-6 py-2.5 text-xs font-extrabold rounded-full transition-all duration-300 transform hover:scale-105 ${
              mainTab === 'dine' ? 'bg-red-600 text-white shadow-md' : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-200'
            }`}
          >
            <span className="text-base">🍕</span>
            <span>Dine Menu</span>
          </button>
          
          <button
            onClick={() => setMainTab('dash')}
            className={`flex items-center space-x-2 px-4 sm:px-6 py-2.5 text-xs font-extrabold rounded-full transition-all duration-300 transform hover:scale-105 ${
              mainTab === 'dash' ? 'bg-red-600 text-white shadow-md' : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-200'
            }`}
          >
            <span className="text-base">🚗</span>
            <span>Dash Ride</span>
          </button>

          <button
            onClick={() => setMainTab('cart')}
            className={`flex items-center space-x-2 px-4 sm:px-6 py-2.5 text-xs font-extrabold rounded-full transition-all duration-300 transform hover:scale-105 relative ${
              mainTab === 'cart' ? 'bg-red-600 text-white shadow-md' : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-200'
            }`}
          >
            <span className="text-base">🛒</span>
            <span>Cart</span>
            {totalCartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-neutral-900 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow">
                {totalCartCount}
              </span>
            )}
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="text-xs font-bold text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl border border-red-200 transition"
        >
          Sign Out
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6 max-w-6xl w-full mx-auto">
        
        {/* --- DINE SECTION (REFINED FOOD MENU & CART INTEGRATION) --- */}
        {mainTab === 'dine' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-neutral-900">Explore Dine Menu</h2>
                <p className="text-xs text-neutral-500 font-medium">Authentic traditional dishes and fast favorites delivered hot.</p>
              </div>

              {/* Category Filters */}
              <div className="flex bg-white p-1 rounded-2xl border border-neutral-200 shadow-sm gap-1">
                {['All', 'Traditional', 'Fast Food', 'Drinks'].map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition ${
                      selectedCategory === category ? 'bg-red-600 text-white shadow' : 'text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredMenu.map((item) => {
                const inCartItem = cart.find(c => c.id === item.id);
                return (
                  <div key={item.id} className="bg-white border border-neutral-200 rounded-3xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                    <div>
                      <div className="text-4xl mb-3 text-center bg-neutral-50 py-5 rounded-2xl border border-neutral-100">{item.image}</div>
                      <span className="text-[10px] font-extrabold uppercase text-red-600 tracking-wider bg-red-50 px-2.5 py-1 rounded-md">{item.category}</span>
                      <h3 className="font-bold text-lg text-neutral-900 mt-2">{item.name}</h3>
                      <p className="text-xs text-neutral-500 mt-1 leading-relaxed">{item.description}</p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between">
                      <span className="font-black text-base text-neutral-900">{item.price} ETB</span>
                      
                      {inCartItem ? (
                        <div className="flex items-center space-x-2 bg-neutral-100 p-1 rounded-xl">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-7 h-7 bg-white rounded-lg shadow-sm font-bold flex items-center justify-center text-xs hover:bg-red-50 hover:text-red-600 transition"
                          >
                            -
                          </button>
                          <span className="text-xs font-black px-1">{inCartItem.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-7 h-7 bg-white rounded-lg shadow-sm font-bold flex items-center justify-center text-xs hover:bg-red-50 hover:text-red-600 transition"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(item)}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl text-xs transition shadow-sm"
                        >
                          + Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* --- DASH SECTION (RIDE HILING & LIVE MAP MOCK) --- */}
        {mainTab === 'dash' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-neutral-900">Dash Ride Hailing</h2>
              <p className="text-xs text-neutral-500 font-medium">Book a reliable ride across Addis Ababa instantly.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Trip Control Panel */}
              <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1 uppercase tracking-wider">Pickup Location</label>
                    <input
                      type="text"
                      className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-semibold text-neutral-800 focus:outline-none focus:ring-2 focus:ring-red-600"
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1 uppercase tracking-wider">Destination</label>
                    <input
                      type="text"
                      className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-semibold text-neutral-800 focus:outline-none focus:ring-2 focus:ring-red-600"
                      value={destinationLocation}
                      onChange={(e) => setDestinationLocation(e.target.value)}
                    />
                  </div>

                  <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-2">
                    <div className="flex justify-between text-xs font-bold text-neutral-600">
                      <span>Estimated Fare:</span>
                      <span className="text-neutral-900 font-black">250 ETB</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold text-neutral-600">
                      <span>Estimated Time:</span>
                      <span className="text-neutral-900 font-black">15 mins</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setTripActive(!tripActive)}
                  className={`w-full py-3 rounded-xl font-extrabold text-xs transition shadow-md ${
                    tripActive ? 'bg-neutral-900 hover:bg-neutral-800 text-white' : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  {tripActive ? 'Cancel Ride' : 'Request Dash Ride'}
                </button>
              </div>

              {/* Interactive Map Mock */}
              <div className="lg:col-span-2 bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm flex flex-col h-[400px] relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-neutral-500">Live Radar View</span>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${tripActive ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {tripActive ? 'Driver Assigned & En Route' : 'Searching for nearby drivers...'}
                  </span>
                </div>

                {/* Map Box Mock */}
                <div className="flex-1 bg-neutral-900 rounded-2xl relative flex items-center justify-center overflow-hidden border border-neutral-800">
                  {/* Grid lines background decoration */}
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>

                  {/* Route line simulation */}
                  <div className="absolute w-3/4 h-1 bg-red-500/50 rounded-full transform -rotate-12 animate-pulse"></div>

                  {/* Pins */}
                  <div className="absolute left-1/4 top-1/3 flex flex-col items-center">
                    <span className="bg-white text-neutral-900 text-[10px] font-bold px-2 py-0.5 rounded shadow mb-1">Pickup</span>
                    <div className="w-4 h-4 bg-red-600 rounded-full border-2 border-white shadow-lg animate-ping absolute"></div>
                    <div className="w-4 h-4 bg-red-600 rounded-full border-2 border-white shadow-lg"></div>
                  </div>

                  <div className="absolute right-1/4 bottom-1/3 flex flex-col items-center">
                    <span className="bg-white text-neutral-900 text-[10px] font-bold px-2 py-0.5 rounded shadow mb-1">Destination</span>
                    <div className="w-4 h-4 bg-neutral-900 rounded-full border-2 border-white shadow-lg"></div>
                  </div>

                  {tripActive && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                      <div className="bg-white px-6 py-4 rounded-2xl shadow-xl text-center space-y-1">
                        <span className="text-2xl">🚗</span>
                        <p className="text-xs font-black text-neutral-900">Your driver is arriving in 3 mins</p>
                        <p className="text-[11px] text-neutral-500 font-medium">Toyota Corolla • Plate 2-44102</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- CART SECTION --- */}
        {mainTab === 'cart' && (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div>
              <h2 className="text-2xl font-black text-neutral-900">Your Order Cart</h2>
              <p className="text-xs text-neutral-500 font-medium">Review your items before final checkout.</p>
            </div>

            {cart.length === 0 ? (
              <div className="bg-white border border-neutral-200 rounded-3xl p-12 text-center space-y-3">
                <span className="text-5xl">🛒</span>
                <p className="text-sm font-bold text-neutral-700">Your cart is currently empty.</p>
                <button
                  onClick={() => setMainTab('dine')}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl text-xs transition shadow-sm inline-block"
                >
                  Explore Menu
                </button>
              </div>
            ) : (
              <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm space-y-6">
                <div className="divide-y divide-neutral-100">
                  {cart.map((item) => (
                    <div key={item.id} className="py-4 flex items-center justify-between first:pt-0 last:pb-0">
                      <div className="flex items-center space-x-4">
                        <span className="text-3xl bg-neutral-50 p-2.5 rounded-2xl border border-neutral-100">{item.image}</span>
                        <div>
                          <h4 className="font-bold text-sm text-neutral-900">{item.name}</h4>
                          <span className="text-xs text-neutral-500">{item.price} ETB each</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 bg-neutral-100 p-1 rounded-xl">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-6 h-6 bg-white rounded-lg shadow-sm font-bold flex items-center justify-center text-xs hover:bg-red-50 hover:text-red-600 transition"
                          >
                            -
                          </button>
                          <span className="text-xs font-black px-1">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-6 h-6 bg-white rounded-lg shadow-sm font-bold flex items-center justify-center text-xs hover:bg-red-50 hover:text-red-600 transition"
                          >
                            +
                          </button>
                        </div>
                        <span className="font-black text-sm text-neutral-900 w-16 text-right">{item.price * item.quantity} ETB</span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-neutral-400 hover:text-red-600 text-xs font-bold transition p-1"
                          title="Remove item"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-neutral-200 pt-4 space-y-2">
                  <div className="flex justify-between text-xs text-neutral-600 font-semibold">
                    <span>Subtotal</span>
                    <span>{getTotalCartPrice()} ETB</span>
                  </div>
                  <div className="flex justify-between text-xs text-neutral-600 font-semibold">
                    <span>Delivery Fee</span>
                    <span>50 ETB</span>
                  </div>
                  <div className="flex justify-between text-base font-black text-neutral-900 pt-2 border-t border-neutral-100">
                    <span>Total</span>
                    <span>{getTotalCartPrice() + 50} ETB</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    alert('Order successfully placed! Your food is being prepared.');
                    setCart([]);
                  }}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl transition shadow-md text-sm"
                >
                  Proceed to Checkout ({getTotalCartPrice() + 50} ETB)
                </button>
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}