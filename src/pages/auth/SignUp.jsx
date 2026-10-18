

// // src/pages/auth/SignUp.jsx

// import { useEffect, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import {
//   Eye,
//   EyeOff,
//   User,
//   Mail,
//   Phone,
//   Lock,
//   UserPlus,
//   Loader2,
//   AlertCircle,
//   CheckCircle,
//   ShieldCheck,
//   X,
//   FileText,
// } from 'lucide-react';

// import { useAuth } from '../../hooks/useAuth';

// const signupSchema = z
//   .object({
//     name: z
//       .string()
//       .trim()
//       .min(2, 'Your full name must contain at least 2 characters.')
//       .max(100, 'Your name is too long.'),

//     username: z
//       .string()
//       .trim()
//       .min(3, 'Username must contain at least 3 characters.')
//       .max(30, 'Username cannot exceed 30 characters.')
//       .regex(
//         /^[a-zA-Z0-9_]+$/,
//         'Username can contain only letters, numbers, and underscores.'
//       ),

//     email: z.string().trim().email('Please enter a valid email address.'),

//     phone: z
//       .string()
//       .trim()
//       .min(7, 'Please enter a valid phone number.')
//       .max(20, 'Phone number is too long.'),

//     password: z
//       .string()
//       .min(8, 'Password must contain at least 8 characters.')
//       .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
//       .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
//       .regex(/[0-9]/, 'Password must contain at least one number.'),

//     confirm_password: z.string(),

//     terms: z.boolean().refine((accepted) => accepted, {
//       message: 'You must accept the Terms and Conditions and Privacy Policy.',
//     }),
//   })
//   .refine((data) => data.password === data.confirm_password, {
//     message: 'Passwords do not match.',
//     path: ['confirm_password'],
//   });

// export default function SignUp() {
//   const navigate = useNavigate();
//   const { signup, googleLogin } = useAuth();

//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [serverError, setServerError] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
//   const [activePolicy, setActivePolicy] = useState(null);

//   const {
//     register,
//     handleSubmit,
//     watch,
//     formState: { errors },
//   } = useForm({
//     resolver: zodResolver(signupSchema),
//     defaultValues: {
//       name: '',
//       username: '',
//       email: '',
//       phone: '',
//       password: '',
//       confirm_password: '',
//       terms: false,
//     },
//   });

//   const acceptedTerms = watch('terms');

//   // Close the policy modal with Escape and lock background scrolling.
//   useEffect(() => {
//     if (!activePolicy) return undefined;

//     const handleKeyDown = (event) => {
//       if (event.key === 'Escape') {
//         setActivePolicy(null);
//       }
//     };

//     const previousOverflow = document.body.style.overflow;
//     document.body.style.overflow = 'hidden';
//     window.addEventListener('keydown', handleKeyDown);

//     return () => {
//       document.body.style.overflow = previousOverflow;
//       window.removeEventListener('keydown', handleKeyDown);
//     };
//   }, [activePolicy]);

//   const openPolicy = (policy) => setActivePolicy(policy);
//   const closePolicy = () => setActivePolicy(null);

//   // EMAIL SIGNUP
//   const onSubmit = async (formData) => {
//     setServerError('');
//     setIsSubmitting(true);

//     try {
//       const fullName = formData.name.trim();
//       const nameParts = fullName.split(/\s+/);

//       if (nameParts.length < 2) {
//         throw new Error(
//           'Please enter both your first name and last name.'
//         );
//       }

//       // These field names match the FastAPI UserCreate model.
//       const payload = {
//         first_name: nameParts[0],
//         last_name: nameParts.slice(1).join(' '),
//         username: formData.username.trim(),
//         email: formData.email.trim().toLowerCase(),
//         phone: formData.phone.trim(),
//         password: formData.password,
//         confirm_password: formData.confirm_password,
//       };

//       if (typeof signup !== 'function') {
//         throw new Error(
//           'Signup is not configured in your authentication hook.'
//         );
//       }

//       const result = await signup(payload);

//       if (result === false || result?.success === false) {
//         throw new Error(
//           result?.error || 'Registration failed. Please try again.'
//         );
//       }

//       // The backend sends the OTP during signup.
//       navigate('/verify-otp', {
//         state: { email: payload.email },
//       });
//     } catch (error) {
//       const message =
//         error?.response?.data?.detail ||
//         error?.response?.data?.message ||
//         error?.message ||
//         'Unable to create your account. Please try again.';

//       setServerError(
//         Array.isArray(message)
//           ? message.map((item) => item.msg || String(item)).join(' ')
//           : String(message)
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // GOOGLE SIGNUP
//   // The authentication hook must obtain or receive a real Google ID token.
//   const handleGoogleSignup = async () => {
//     setServerError('');

//     if (!acceptedTerms) {
//       setServerError(
//         'Please accept the Terms and Conditions and Privacy Policy before continuing with Google.'
//       );
//       return;
//     }

//     if (typeof googleLogin !== 'function') {
//       setServerError(
//         'Google signup is not configured in your authentication hook.'
//       );
//       return;
//     }

//     setIsGoogleSubmitting(true);

//     try {
//       // Do not call the backend without an ID token.
//       // Your Google integration must supply this token.
//       await googleLogin();
//     } catch (error) {
//       setServerError(
//         error?.response?.data?.detail ||
//           error?.response?.data?.message ||
//           error?.message ||
//           'Google signup failed. Please try again.'
//       );
//     } finally {
//       setIsGoogleSubmitting(false);
//     }
//   };

//   const inputClass = (hasError) =>
//     `w-full rounded-xl border bg-white py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition focus:ring-2 ${
//       hasError
//         ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
//         : 'border-gray-200 focus:border-orange-500 focus:ring-orange-100'
//     }`;

//   return (
//     <div className="min-h-screen bg-gray-50 px-4 py-10 sm:py-14">
//       <div className="mx-auto w-full max-w-md">

//         {/* BRAND */}
//         <div className="mb-8 text-center">
//           <Link
//             to="/"
//             className="inline-flex items-center justify-center gap-2"
//           >
//             <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-lg shadow-orange-200">
//               <UserPlus size={25} />
//             </span>

//             <span className="text-2xl font-extrabold tracking-tight text-gray-900">
//               Nexoleolite
//             </span>
//           </Link>

//           <h1 className="mt-6 text-3xl font-extrabold text-gray-900">
//             Create your account
//           </h1>

//           <p className="mt-2 text-sm leading-6 text-gray-500">
//             Join Nexoleolite to discover products, connect with vendors, and
//             explore opportunities.
//           </p>
//         </div>

//         <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-200/50 sm:p-8">

//           {/* SERVER ERROR */}
//           {serverError && (
//             <div
//               role="alert"
//               className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
//             >
//               <AlertCircle className="mt-0.5 shrink-0" size={18} />
//               <span>{serverError}</span>
//             </div>
//           )}

//           {/* GOOGLE SIGNUP */}
//           <button
//             type="button"
//             onClick={handleGoogleSignup}
//             disabled={isSubmitting || isGoogleSubmitting}
//             className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
//           >
//             {isGoogleSubmitting ? (
//               <Loader2 className="animate-spin" size={20} />
//             ) : (
//               <svg
//                 width="20"
//                 height="20"
//                 viewBox="0 0 48 48"
//                 aria-hidden="true"
//               >
//                 <path
//                   fill="#EA4335"
//                   d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.01 13.22l7.98 6.19C11.9 13.72 17.48 9.5 24 9.5Z"
//                 />
//                 <path
//                   fill="#4285F4"
//                   d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.74 7.18l7.73 6C44.43 38.08 46.98 31.89 46.98 24.55Z"
//                 />
//                 <path
//                   fill="#FBBC05"
//                   d="M9.99 28.59A14.4 14.4 0 0 1 9.22 24c0-1.59.27-3.13.76-4.59L2.01 13.22A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 2.58 10.78l7.41-6.19Z"
//                 />
//                 <path
//                   fill="#34A853"
//                   d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.14 1.44-4.89 2.3-8.18 2.3-6.52 0-12.1-4.22-14.01-10.09l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"
//                 />
//               </svg>
//             )}

//             {isGoogleSubmitting
//               ? 'Connecting to Google...'
//               : 'Continue with Google'}
//           </button>

//           <div className="my-6 flex items-center gap-4">
//             <div className="h-px flex-1 bg-gray-200" />
//             <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
//               Or sign up with email
//             </span>
//             <div className="h-px flex-1 bg-gray-200" />
//           </div>

//           {/* EMAIL SIGNUP FORM */}
//           <form onSubmit={handleSubmit(onSubmit)} noValidate>

//             {/* FULL NAME */}
//             <div className="mb-4">
//               <label
//                 htmlFor="name"
//                 className="mb-2 block text-sm font-semibold text-gray-700"
//               >
//                 Full name
//               </label>

//               <div className="relative">
//                 <User
//                   size={18}
//                   className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
//                 />
//                 <input
//                   id="name"
//                   type="text"
//                   autoComplete="name"
//                   placeholder="Enter your first and last name"
//                   aria-invalid={Boolean(errors.name)}
//                   className={inputClass(errors.name)}
//                   {...register('name')}
//                 />
//               </div>

//               {errors.name && (
//                 <p className="mt-1.5 text-xs text-red-600">
//                   {errors.name.message}
//                 </p>
//               )}
//             </div>

//             {/* USERNAME */}
//             <div className="mb-4">
//               <label
//                 htmlFor="username"
//                 className="mb-2 block text-sm font-semibold text-gray-700"
//               >
//                 Username
//               </label>

//               <div className="relative">
//                 <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-semibold text-gray-400">
//                   @
//                 </span>
//                 <input
//                   id="username"
//                   type="text"
//                   autoComplete="username"
//                   placeholder="Choose a username"
//                   aria-invalid={Boolean(errors.username)}
//                   className={inputClass(errors.username)}
//                   {...register('username')}
//                 />
//               </div>

//               {errors.username && (
//                 <p className="mt-1.5 text-xs text-red-600">
//                   {errors.username.message}
//                 </p>
//               )}
//             </div>

//             {/* EMAIL */}
//             <div className="mb-4">
//               <label
//                 htmlFor="email"
//                 className="mb-2 block text-sm font-semibold text-gray-700"
//               >
//                 Email address
//               </label>

//               <div className="relative">
//                 <Mail
//                   size={18}
//                   className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
//                 />
//                 <input
//                   id="email"
//                   type="email"
//                   autoComplete="email"
//                   placeholder="you@example.com"
//                   aria-invalid={Boolean(errors.email)}
//                   className={inputClass(errors.email)}
//                   {...register('email')}
//                 />
//               </div>

//               {errors.email && (
//                 <p className="mt-1.5 text-xs text-red-600">
//                   {errors.email.message}
//                 </p>
//               )}
//             </div>

//             {/* PHONE */}
//             <div className="mb-4">
//               <label
//                 htmlFor="phone"
//                 className="mb-2 block text-sm font-semibold text-gray-700"
//               >
//                 Phone number
//               </label>

//               <div className="relative">
//                 <Phone
//                   size={18}
//                   className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
//                 />
//                 <input
//                   id="phone"
//                   type="tel"
//                   autoComplete="tel"
//                   placeholder="Enter your phone number"
//                   aria-invalid={Boolean(errors.phone)}
//                   className={inputClass(errors.phone)}
//                   {...register('phone')}
//                 />
//               </div>

//               {errors.phone && (
//                 <p className="mt-1.5 text-xs text-red-600">
//                   {errors.phone.message}
//                 </p>
//               )}
//             </div>

//             {/* PASSWORD */}
//             <div className="mb-4">
//               <label
//                 htmlFor="password"
//                 className="mb-2 block text-sm font-semibold text-gray-700"
//               >
//                 Password
//               </label>

//               <div className="relative">
//                 <Lock
//                   size={18}
//                   className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
//                 />
//                 <input
//                   id="password"
//                   type={showPassword ? 'text' : 'password'}
//                   autoComplete="new-password"
//                   placeholder="Create a strong password"
//                   aria-invalid={Boolean(errors.password)}
//                   className={`${inputClass(errors.password)} pr-12`}
//                   {...register('password')}
//                 />

//                 <button
//                   type="button"
//                   onClick={() => setShowPassword((value) => !value)}
//                   aria-label={showPassword ? 'Hide password' : 'Show password'}
//                   className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
//                 >
//                   {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                 </button>
//               </div>

//               {errors.password ? (
//                 <p className="mt-1.5 text-xs text-red-600">
//                   {errors.password.message}
//                 </p>
//               ) : (
//                 <p className="mt-1.5 text-xs text-gray-400">
//                   At least 8 characters, with uppercase and lowercase letters
//                   and a number.
//                 </p>
//               )}
//             </div>

//             {/* CONFIRM PASSWORD */}
//             <div className="mb-5">
//               <label
//                 htmlFor="confirm_password"
//                 className="mb-2 block text-sm font-semibold text-gray-700"
//               >
//                 Confirm password
//               </label>

//               <div className="relative">
//                 <Lock
//                   size={18}
//                   className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
//                 />
//                 <input
//                   id="confirm_password"
//                   type={showConfirmPassword ? 'text' : 'password'}
//                   autoComplete="new-password"
//                   placeholder="Enter your password again"
//                   aria-invalid={Boolean(errors.confirm_password)}
//                   className={`${inputClass(errors.confirm_password)} pr-12`}
//                   {...register('confirm_password')}
//                 />

//                 <button
//                   type="button"
//                   onClick={() =>
//                     setShowConfirmPassword((value) => !value)
//                   }
//                   aria-label={
//                     showConfirmPassword
//                       ? 'Hide confirmation password'
//                       : 'Show confirmation password'
//                   }
//                   className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
//                 >
//                   {showConfirmPassword ? (
//                     <EyeOff size={18} />
//                   ) : (
//                     <Eye size={18} />
//                   )}
//                 </button>
//               </div>

//               {errors.confirm_password && (
//                 <p className="mt-1.5 text-xs text-red-600">
//                   {errors.confirm_password.message}
//                 </p>
//               )}
//             </div>

//             {/* TERMS AND PRIVACY */}
//             <div className="mb-5">
//               <label className="flex cursor-pointer items-start gap-3">
//                 <input
//                   type="checkbox"
//                   aria-invalid={Boolean(errors.terms)}
//                   className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-orange-500"
//                   {...register('terms')}
//                 />

//                 <span className="text-sm leading-6 text-gray-600">
//                   I have read and agree to the{' '}
//                   <button
//                     type="button"
//                     onClick={() => openPolicy('terms')}
//                     className="font-semibold text-orange-600 underline underline-offset-2 hover:text-orange-700"
//                   >
//                     Terms and Conditions
//                   </button>{' '}
//                   and{' '}
//                   <button
//                     type="button"
//                     onClick={() => openPolicy('privacy')}
//                     className="font-semibold text-orange-600 underline underline-offset-2 hover:text-orange-700"
//                   >
//                     Privacy Policy
//                   </button>
//                   .
//                 </span>
//               </label>

//               {errors.terms && (
//                 <p className="mt-1.5 text-xs text-red-600">
//                   {errors.terms.message}
//                 </p>
//               )}
//             </div>

//             {/* SECURITY MESSAGE */}
//             <div className="mb-6 flex items-start gap-3 rounded-xl bg-orange-50 p-3.5">
//               <ShieldCheck
//                 size={20}
//                 className="mt-0.5 shrink-0 text-orange-600"
//               />
//               <p className="text-xs leading-5 text-gray-600">
//                 Protect your account details. Never share your password or
//                 verification codes with anyone.
//               </p>
//             </div>

//             {/* SUBMIT */}
//             <button
//               type="submit"
//               disabled={isSubmitting || isGoogleSubmitting}
//               className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3.5 font-bold text-white shadow-lg shadow-orange-100 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
//             >
//               {isSubmitting ? (
//                 <>
//                   <Loader2 className="animate-spin" size={20} />
//                   Creating account...
//                 </>
//               ) : (
//                 <>
//                   <CheckCircle size={19} />
//                   Create account
//                 </>
//               )}
//             </button>
//           </form>

//           {/* LOGIN LINK */}
//           <p className="mt-6 text-center text-sm text-gray-500">
//             Already have an account?{' '}
//             <Link
//               to="/login"
//               className="font-bold text-orange-600 hover:text-orange-700"
//             >
//               Log in
//             </Link>
//           </p>
//         </div>

//         <p className="mt-6 text-center text-xs leading-5 text-gray-400">
//           By creating an account, you agree to follow Nexoleolite's platform
//           rules and use the marketplace responsibly.
//         </p>

//         <div className="mt-3 flex justify-center gap-4 text-xs text-gray-500">
//           <button
//             type="button"
//             onClick={() => openPolicy('terms')}
//             className="hover:text-orange-600"
//           >
//             Terms
//           </button>

//           <button
//             type="button"
//             onClick={() => openPolicy('privacy')}
//             className="hover:text-orange-600"
//           >
//             Privacy
//           </button>

//           <Link to="/" className="hover:text-orange-600">
//             Home
//           </Link>
//         </div>
//       </div>

//       {/* TERMS AND PRIVACY MODAL */}
//       {activePolicy && (
//         <div
//           className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:p-6"
//           onMouseDown={(event) => {
//             if (event.target === event.currentTarget) {
//               closePolicy();
//             }
//           }}
//         >
//           <section
//             role="dialog"
//             aria-modal="true"
//             aria-labelledby="policy-modal-title"
//             className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900"
//           >
//             <div className="flex items-center justify-between gap-4 border-b border-gray-200 px-5 py-4 dark:border-gray-700 sm:px-7">
//               <div className="flex min-w-0 items-center gap-3">
//                 <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400">
//                   {activePolicy === 'terms' ? (
//                     <FileText size={21} />
//                   ) : (
//                     <ShieldCheck size={21} />
//                   )}
//                 </span>

//                 <div>
//                   <h2
//                     id="policy-modal-title"
//                     className="text-lg font-extrabold text-gray-900 dark:text-white sm:text-xl"
//                   >
//                     {activePolicy === 'terms'
//                       ? 'Terms and Conditions'
//                       : 'Privacy Policy'}
//                   </h2>

//                   <p className="text-xs text-gray-500 dark:text-gray-400">
//                     Nexoleolite
//                   </p>
//                 </div>
//               </div>

//               <button
//                 type="button"
//                 onClick={closePolicy}
//                 aria-label="Close policy"
//                 className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
//               >
//                 <X size={22} />
//               </button>
//             </div>

//             <div className="overflow-y-auto px-5 py-5 text-sm leading-7 text-gray-600 dark:text-gray-300 sm:px-7 sm:py-6">
//               {activePolicy === 'terms' ? (
//                 <div className="space-y-5">
//                   <p className="rounded-xl bg-orange-50 p-4 text-orange-900 dark:bg-orange-500/10 dark:text-orange-200">
//                     Please review these draft terms. They should be checked
//                     against Nexoleolite's actual features and business policies
//                     before publication.
//                   </p>

//                   <div>
//                     <h3 className="font-bold text-gray-900 dark:text-white">
//                       1. About Nexoleolite
//                     </h3>
//                     <p>
//                       Nexoleolite helps users discover products, connect with
//                       vendors, and explore property listings and other
//                       opportunities available on the platform.
//                     </p>
//                   </div>

//                   <div>
//                     <h3 className="font-bold text-gray-900 dark:text-white">
//                       2. Creating an account
//                     </h3>
//                     <p>
//                       You agree to provide accurate information when registering
//                       and to keep your account details secure. You are
//                       responsible for activity carried out through your
//                       account. Contact the platform if you suspect unauthorized
//                       access.
//                     </p>
//                   </div>

//                   <div>
//                     <h3 className="font-bold text-gray-900 dark:text-white">
//                       3. Buyers, vendors, and property listings
//                     </h3>
//                     <p>
//                       Vendors and property listers must provide honest and
//                       accurate descriptions and must have authority to offer
//                       the items or properties they advertise. Buyers should
//                       verify prices, availability, ownership, delivery
//                       arrangements, and other transaction details before
//                       committing.
//                     </p>
//                   </div>

//                   <div>
//                     <h3 className="font-bold text-gray-900 dark:text-white">
//                       4. Responsible use
//                     </h3>
//                     <p>
//                       Do not use Nexoleolite for fraud, impersonation,
//                       harassment, unlawful content, misleading listings,
//                       unauthorized access, malicious software, or interference
//                       with the platform.
//                     </p>
//                   </div>

//                   <div>
//                     <h3 className="font-bold text-gray-900 dark:text-white">
//                       5. Communication and transactions
//                     </h3>
//                     <p>
//                       Communicate respectfully and take precautions before
//                       sending money or sharing sensitive information. Unless a
//                       particular service expressly states otherwise, do not
//                       assume Nexoleolite has verified every seller, buyer,
//                       listing, payment, delivery, or property.
//                     </p>
//                   </div>

//                   <div>
//                     <h3 className="font-bold text-gray-900 dark:text-white">
//                       6. Content and intellectual property
//                     </h3>
//                     <p>
//                       You must have the rights or permissions needed to upload
//                       product images, descriptions, property photographs,
//                       logos, and other content. You retain rights you already
//                       hold in your content while permitting its use as
//                       reasonably necessary to operate and display the service,
//                       subject to applicable law.
//                     </p>
//                   </div>

//                   <div>
//                     <h3 className="font-bold text-gray-900 dark:text-white">
//                       7. Listings and account restrictions
//                     </h3>
//                     <p>
//                       Nexoleolite may review reported content and take
//                       appropriate action against suspected fraud, abusive
//                       behavior, or violations of these terms, subject to
//                       applicable law and any published appeal procedure.
//                     </p>
//                   </div>

//                   <div>
//                     <h3 className="font-bold text-gray-900 dark:text-white">
//                       8. Service availability and changes
//                     </h3>
//                     <p>
//                       Features may change or become temporarily unavailable for
//                       maintenance or other reasons. Material changes to these
//                       terms should be communicated where required by law.
//                     </p>
//                   </div>

//                   <div>
//                     <h3 className="font-bold text-gray-900 dark:text-white">
//                       9. Applicable law and contact
//                     </h3>
//                     <p>
//                       Before publishing this section, the platform owner
//                       should specify the applicable governing law,
//                       dispute-resolution process, and official contact details
//                       for questions and complaints.
//                     </p>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="space-y-5">
//                   <p className="rounded-xl bg-orange-50 p-4 text-orange-900 dark:bg-orange-500/10 dark:text-orange-200">
//                     This is a draft privacy notice. Update it to reflect the
//                     information Nexoleolite actually collects, its connected
//                     services, and its data-retention practices.
//                   </p>

//                   <div>
//                     <h3 className="font-bold text-gray-900 dark:text-white">
//                       1. Information you provide
//                     </h3>
//                     <p>
//                       When you register or use the platform, information may
//                       include your name, username, email, phone number,
//                       account details, profile information, listings, and
//                       messages or enquiries you submit.
//                     </p>
//                   </div>

//                   <div>
//                     <h3 className="font-bold text-gray-900 dark:text-white">
//                       2. Technical and usage information
//                     </h3>
//                     <p>
//                       Depending on the platform's configuration, technical
//                       information may be processed to operate the service,
//                       protect accounts, diagnose errors, prevent abuse, and
//                       understand feature performance.
//                     </p>
//                   </div>

//                   <div>
//                     <h3 className="font-bold text-gray-900 dark:text-white">
//                       3. How information is used
//                     </h3>
//                     <p>
//                       Information may be used to maintain accounts, provide
//                       requested features, display listings, facilitate
//                       communication, verify accounts, respond to support
//                       requests, protect the platform, and meet legal
//                       obligations.
//                     </p>
//                   </div>

//                   <div>
//                     <h3 className="font-bold text-gray-900 dark:text-white">
//                       4. Information visible to other users
//                     </h3>
//                     <p>
//                       Information you publish in public profiles or listings
//                       may be visible to other users. Messages may be visible to
//                       their recipients. Avoid publishing information you do not
//                       want others to see.
//                     </p>
//                   </div>

//                   <div>
//                     <h3 className="font-bold text-gray-900 dark:text-white">
//                       5. Service providers and sharing
//                     </h3>
//                     <p>
//                       Information may be processed by service providers used
//                       for hosting, databases, authentication, email, storage,
//                       or payments. The final policy should identify the actual
//                       providers and explain relevant sharing practices.
//                     </p>
//                   </div>

//                   <div>
//                     <h3 className="font-bold text-gray-900 dark:text-white">
//                       6. Storage and security
//                     </h3>
//                     <p>
//                       Appropriate safeguards should protect personal
//                       information against unauthorized access, loss, misuse,
//                       or disclosure. No online service can promise absolute
//                       security.
//                     </p>
//                   </div>

//                   <div>
//                     <h3 className="font-bold text-gray-900 dark:text-white">
//                       7. Retention and your choices
//                     </h3>
//                     <p>
//                       Information should be retained only as long as necessary
//                       for the purposes described in the final policy, subject
//                       to legal requirements. Depending on applicable law, you
//                       may have rights to access, correct, or request deletion
//                       of your personal information.
//                     </p>
//                   </div>

//                   <div>
//                     <h3 className="font-bold text-gray-900 dark:text-white">
//                       8. Cookies and third-party services
//                     </h3>
//                     <p>
//                       Cookies or similar technologies may be used if enabled
//                       for authentication, preferences, security, or analytics.
//                       External services may have their own privacy practices.
//                     </p>
//                   </div>

//                   <div>
//                     <h3 className="font-bold text-gray-900 dark:text-white">
//                       9. Children's privacy
//                     </h3>
//                     <p>
//                       The published policy should state the platform's minimum
//                       account age and explain how information relating to
//                       children is handled in accordance with applicable law.
//                     </p>
//                   </div>

//                   <div>
//                     <h3 className="font-bold text-gray-900 dark:text-white">
//                       10. Updates and privacy enquiries
//                     </h3>
//                     <p>
//                       The final policy should include an effective date and an
//                       official contact method for privacy requests, complaints,
//                       and questions.
//                     </p>
//                   </div>
//                 </div>
//               )}
//             </div>

//             <div className="flex flex-col gap-3 border-t border-gray-200 bg-gray-50 px-5 py-4 dark:border-gray-700 dark:bg-gray-800/70 sm:flex-row sm:items-center sm:justify-between sm:px-7">
//               <p className="text-xs text-gray-500 dark:text-gray-400">
//                 Please review the policy before accepting it.
//               </p>

//               <div className="flex flex-wrap gap-2">
//                 <button
//                   type="button"
//                   onClick={() =>
//                     openPolicy(
//                       activePolicy === 'terms' ? 'privacy' : 'terms'
//                     )
//                   }
//                   className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-white dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
//                 >
//                   Read {activePolicy === 'terms' ? 'Privacy Policy' : 'Terms'}
//                 </button>

//                 <button
//                   type="button"
//                   onClick={closePolicy}
//                   className="rounded-xl bg-orange-500 px-5 py-2 text-sm font-bold text-white transition hover:bg-orange-600"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </section>
//         </div>
//       )}
//     </div>
//   );
// }


import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Phone,
  Lock,
  UserPlus,
  Loader2,
  AlertCircle,
  CheckCircle,
  ShieldCheck,
  X,
  FileText,
} from 'lucide-react';

import { useAuth } from '../../hooks/useAuth';

const signupSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Your full name must contain at least 2 characters.')
      .max(100, 'Your name is too long.'),

    username: z
      .string()
      .trim()
      .min(3, 'Username must contain at least 3 characters.')
      .max(30, 'Username cannot exceed 30 characters.')
      .regex(
        /^[a-zA-Z0-9_]+$/,
        'Username can contain only letters, numbers, and underscores.'
      ),

    email: z.string().trim().email('Please enter a valid email address.'),

    phone: z
      .string()
      .trim()
      .min(7, 'Please enter a valid phone number.')
      .max(20, 'Phone number is too long.'),

    password: z
      .string()
      .min(8, 'Password must contain at least 8 characters.')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
      .regex(/[0-9]/, 'Password must contain at least one number.'),

    confirm_password: z.string(),

    terms: z.boolean().refine((accepted) => accepted, {
      message: 'You must accept the Terms and Conditions and Privacy Policy.',
    }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Passwords do not match.',
    path: ['confirm_password'],
  });

export default function SignUp() {
  const navigate = useNavigate();
  const { signup, googleLogin } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [activePolicy, setActivePolicy] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      phone: '',
      password: '',
      confirm_password: '',
      terms: false,
    },
  });

  const acceptedTerms = watch('terms');

  useEffect(() => {
    if (!activePolicy) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setActivePolicy(null);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activePolicy]);

  const openPolicy = (policy) => setActivePolicy(policy);
  const closePolicy = () => setActivePolicy(null);

  // EMAIL SIGNUP
  const onSubmit = async (formData) => {
    setServerError('');
    setIsSubmitting(true);

    try {
      const fullName = formData.name.trim();
      const nameParts = fullName.split(/\s+/);

      if (nameParts.length < 2) {
        throw new Error('Please enter both your first name and last name.');
      }

      const payload = {
        first_name: nameParts[0],
        last_name: nameParts.slice(1).join(' '),
        username: formData.username.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        password: formData.password,
        confirm_password: formData.confirm_password,
      };

      if (typeof signup !== 'function') {
        throw new Error(
          'Signup is not configured in your authentication hook.'
        );
      }

      const result = await signup(payload);

      if (result === false || result?.success === false) {
        throw new Error(
          result?.error || 'Registration failed. Please try again.'
        );
      }

      navigate('/verify-otp', {
        state: { email: payload.email },
      });
    } catch (error) {
      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.message ||
        'Unable to create your account. Please try again.';

      setServerError(
        Array.isArray(message)
          ? message.map((item) => item.msg || String(item)).join(' ')
          : String(message)
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // GOOGLE SIGNUP
  const handleGoogleSignup = async () => {
    setServerError('');

    if (!acceptedTerms) {
      setServerError(
        'Please accept the Terms and Conditions and Privacy Policy before continuing with Google.'
      );
      return;
    }

    if (typeof googleLogin !== 'function') {
      setServerError(
        'Google signup is not configured in your authentication hook.'
      );
      return;
    }

    setIsGoogleSubmitting(true);

    try {
      // Google authentication must supply a real ID token.
      await googleLogin();
    } catch (error) {
      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.message ||
        'Google signup failed. Please try again.';

      setServerError(
        typeof message === 'string'
          ? message
          : JSON.stringify(message)
      );
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  const inputClass = (hasError) =>
    `w-full rounded-xl border bg-white py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition focus:ring-2 ${
      hasError
        ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
        : 'border-gray-200 focus:border-orange-500 focus:ring-orange-100'
    }`;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 sm:py-14">
      <div className="mx-auto w-full max-w-md">

        {/* BRAND */}
        <div className="mb-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-lg shadow-orange-200">
              <UserPlus size={25} />
            </span>

            <span className="text-2xl font-extrabold tracking-tight text-gray-900">
              Nexoleolite
            </span>
          </Link>

          <h1 className="mt-6 text-3xl font-extrabold text-gray-900">
            Create your account
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Join Nexoleolite to discover products, connect with vendors, and
            explore opportunities.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-200/50 sm:p-8">

          {/* SERVER ERROR */}
          {serverError && (
            <div
              role="alert"
              className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              <AlertCircle className="mt-0.5 shrink-0" size={18} />
              <span>{serverError}</span>
            </div>
          )}

          {/* GOOGLE SIGNUP */}
          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={isSubmitting || isGoogleSubmitting}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isGoogleSubmitting ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.01 13.22l7.98 6.19C11.9 13.72 17.48 9.5 24 9.5Z"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.74 7.18l7.73 6C44.43 38.08 46.98 31.89 46.98 24.55Z"
                />
                <path
                  fill="#FBBC05"
                  d="M9.99 28.59A14.4 14.4 0 0 1 9.22 24c0-1.59.27-3.13.76-4.59L2.01 13.22A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 2.58 10.78l7.41-6.19Z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.14 1.44-4.89 2.3-8.18 2.3-6.52 0-12.1-4.22-14.01-10.09l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"
                />
              </svg>
            )}

            {isGoogleSubmitting
              ? 'Connecting to Google...'
              : 'Continue with Google'}
          </button>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
              Or sign up with email
            </span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {/* EMAIL SIGNUP FORM */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate>

            {/* FULL NAME */}
            <div className="mb-4">
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Full name
              </label>

              <div className="relative">
                <User
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Enter your first and last name"
                  aria-invalid={Boolean(errors.name)}
                  className={inputClass(errors.name)}
                  {...register('name')}
                />
              </div>

              {errors.name && (
                <p className="mt-1.5 text-xs text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* USERNAME */}
            <div className="mb-4">
              <label
                htmlFor="username"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Username
              </label>

              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-semibold text-gray-400">
                  @
                </span>
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  placeholder="Choose a username"
                  aria-invalid={Boolean(errors.username)}
                  className={inputClass(errors.username)}
                  {...register('username')}
                />
              </div>

              {errors.username && (
                <p className="mt-1.5 text-xs text-red-600">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* EMAIL */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Email address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  aria-invalid={Boolean(errors.email)}
                  className={inputClass(errors.email)}
                  {...register('email')}
                />
              </div>

              {errors.email && (
                <p className="mt-1.5 text-xs text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* PHONE */}
            <div className="mb-4">
              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Phone number
              </label>

              <div className="relative">
                <Phone
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="Enter your phone number"
                  aria-invalid={Boolean(errors.phone)}
                  className={inputClass(errors.phone)}
                  {...register('phone')}
                />
              </div>

              {errors.phone && (
                <p className="mt-1.5 text-xs text-red-600">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* PASSWORD */}
            <div className="mb-4">
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Password
              </label>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Create a strong password"
                  aria-invalid={Boolean(errors.password)}
                  className={`${inputClass(errors.password)} pr-12`}
                  {...register('password')}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {errors.password ? (
                <p className="mt-1.5 text-xs text-red-600">
                  {errors.password.message}
                </p>
              ) : (
                <p className="mt-1.5 text-xs text-gray-400">
                  At least 8 characters, with uppercase and lowercase letters
                  and a number.
                </p>
              )}
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="mb-5">
              <label
                htmlFor="confirm_password"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Confirm password
              </label>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  id="confirm_password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Enter your password again"
                  aria-invalid={Boolean(errors.confirm_password)}
                  className={`${inputClass(errors.confirm_password)} pr-12`}
                  {...register('confirm_password')}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword((value) => !value)
                  }
                  aria-label={
                    showConfirmPassword
                      ? 'Hide confirmation password'
                      : 'Show confirmation password'
                  }
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              {errors.confirm_password && (
                <p className="mt-1.5 text-xs text-red-600">
                  {errors.confirm_password.message}
                </p>
              )}
            </div>

            {/* TERMS AND PRIVACY */}
            <div className="mb-5">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  aria-invalid={Boolean(errors.terms)}
                  className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-orange-500"
                  {...register('terms')}
                />

                <span className="text-sm leading-6 text-gray-600">
                  I have read and agree to the{' '}
                  <button
                    type="button"
                    onClick={() => openPolicy('terms')}
                    className="font-semibold text-orange-600 underline underline-offset-2 hover:text-orange-700"
                  >
                    Terms and Conditions
                  </button>{' '}
                  and{' '}
                  <button
                    type="button"
                    onClick={() => openPolicy('privacy')}
                    className="font-semibold text-orange-600 underline underline-offset-2 hover:text-orange-700"
                  >
                    Privacy Policy
                  </button>
                  .
                </span>
              </label>

              {errors.terms && (
                <p className="mt-1.5 text-xs text-red-600">
                  {errors.terms.message}
                </p>
              )}
            </div>

            {/* SECURITY MESSAGE */}
            <div className="mb-6 flex items-start gap-3 rounded-xl bg-orange-50 p-3.5">
              <ShieldCheck
                size={20}
                className="mt-0.5 shrink-0 text-orange-600"
              />
              <p className="text-xs leading-5 text-gray-600">
                Protect your account details. Never share your password or
                verification codes with anyone.
              </p>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={isSubmitting || isGoogleSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3.5 font-bold text-white shadow-lg shadow-orange-100 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Creating account...
                </>
              ) : (
                <>
                  <CheckCircle size={19} />
                  Create account
                </>
              )}
            </button>
          </form>

          {/* FIXED SIGN-IN LINK */}
          <div className="mt-6 border-t border-gray-100 pt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?
            </p>

            <Link
              to="/signin"
              className="mt-3 inline-flex w-full items-center justify-center rounded-xl border-2 border-orange-500 px-6 py-3 font-bold text-orange-600 transition-all duration-200 hover:bg-orange-500 hover:text-white"
            >
              Sign in to your account
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-xs leading-5 text-gray-400">
          By creating an account, you agree to follow Nexoleolite's platform
          rules and use the marketplace responsibly.
        </p>

        <div className="mt-3 flex justify-center gap-4 text-xs text-gray-500">
          <button
            type="button"
            onClick={() => openPolicy('terms')}
            className="hover:text-orange-600"
          >
            Terms
          </button>

          <button
            type="button"
            onClick={() => openPolicy('privacy')}
            className="hover:text-orange-600"
          >
            Privacy
          </button>

          <Link to="/" className="hover:text-orange-600">
            Home
          </Link>
        </div>
      </div>

      {/* TERMS AND PRIVACY MODAL */}
      {activePolicy && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closePolicy();
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="policy-modal-title"
            className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900"
          >
            <div className="flex items-center justify-between gap-4 border-b border-gray-200 px-5 py-4 dark:border-gray-700 sm:px-7">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400">
                  {activePolicy === 'terms' ? (
                    <FileText size={21} />
                  ) : (
                    <ShieldCheck size={21} />
                  )}
                </span>

                <div>
                  <h2
                    id="policy-modal-title"
                    className="text-lg font-extrabold text-gray-900 dark:text-white sm:text-xl"
                  >
                    {activePolicy === 'terms'
                      ? 'Terms and Conditions'
                      : 'Privacy Policy'}
                  </h2>

                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Nexoleolite
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closePolicy}
                aria-label="Close policy"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
              >
                <X size={22} />
              </button>
            </div>

            <div className="overflow-y-auto px-5 py-5 text-sm leading-7 text-gray-600 dark:text-gray-300 sm:px-7 sm:py-6">
              {activePolicy === 'terms' ? (
                <div className="space-y-5">
                  <p className="rounded-xl bg-orange-50 p-4 text-orange-900 dark:bg-orange-500/10 dark:text-orange-200">
                    Please review these draft terms. They should be checked
                    against Nexoleolite's actual features and business policies
                    before publication.
                  </p>

                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      1. About Nexoleolite
                    </h3>
                    <p>
                      Nexoleolite helps users discover products, connect with
                      vendors, and explore property listings and other
                      opportunities available on the platform.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      2. Creating an account
                    </h3>
                    <p>
                      You agree to provide accurate information when registering
                      and to keep your account details secure. You are
                      responsible for activity carried out through your
                      account. Contact the platform if you suspect unauthorized
                      access.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      3. Buyers, vendors, and property listings
                    </h3>
                    <p>
                      Vendors and property listers must provide honest and
                      accurate descriptions and must have authority to offer
                      the items or properties they advertise. Buyers should
                      verify prices, availability, ownership, delivery
                      arrangements, and other transaction details before
                      committing.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      4. Responsible use
                    </h3>
                    <p>
                      Do not use Nexoleolite for fraud, impersonation,
                      harassment, unlawful content, misleading listings,
                      unauthorized access, malicious software, or interference
                      with the platform.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      5. Communication and transactions
                    </h3>
                    <p>
                      Communicate respectfully and take precautions before
                      sending money or sharing sensitive information. Unless a
                      particular service expressly states otherwise, do not
                      assume Nexoleolite has verified every seller, buyer,
                      listing, payment, delivery, or property.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      6. Content and intellectual property
                    </h3>
                    <p>
                      You must have the rights or permissions needed to upload
                      product images, descriptions, property photographs,
                      logos, and other content. You retain rights you already
                      hold in your content while permitting its use as
                      reasonably necessary to operate and display the service,
                      subject to applicable law.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      7. Listings and account restrictions
                    </h3>
                    <p>
                      Nexoleolite may review reported content and take
                      appropriate action against suspected fraud, abusive
                      behavior, or violations of these terms, subject to
                      applicable law and any published appeal procedure.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      8. Service availability and changes
                    </h3>
                    <p>
                      Features may change or become temporarily unavailable for
                      maintenance or other reasons. Material changes to these
                      terms should be communicated where required by law.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      9. Applicable law and contact
                    </h3>
                    <p>
                      Before publishing this section, the platform owner
                      should specify the applicable governing law,
                      dispute-resolution process, and official contact details
                      for questions and complaints.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <p className="rounded-xl bg-orange-50 p-4 text-orange-900 dark:bg-orange-500/10 dark:text-orange-200">
                    This is a draft privacy notice. Update it to reflect the
                    information Nexoleolite actually collects, its connected
                    services, and its data-retention practices.
                  </p>

                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      1. Information you provide
                    </h3>
                    <p>
                      When you register or use the platform, information may
                      include your name, username, email, phone number,
                      account details, profile information, listings, and
                      messages or enquiries you submit.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      2. Technical and usage information
                    </h3>
                    <p>
                      Depending on the platform's configuration, technical
                      information may be processed to operate the service,
                      protect accounts, diagnose errors, prevent abuse, and
                      understand feature performance.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      3. How information is used
                    </h3>
                    <p>
                      Information may be used to maintain accounts, provide
                      requested features, display listings, facilitate
                      communication, verify accounts, respond to support
                      requests, protect the platform, and meet legal
                      obligations.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      4. Information visible to other users
                    </h3>
                    <p>
                      Information you publish in public profiles or listings
                      may be visible to other users. Messages may be visible to
                      their recipients. Avoid publishing information you do not
                      want others to see.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      5. Service providers and sharing
                    </h3>
                    <p>
                      Information may be processed by service providers used
                      for hosting, databases, authentication, email, storage,
                      or payments. The final policy should identify the actual
                      providers and explain relevant sharing practices.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      6. Storage and security
                    </h3>
                    <p>
                      Appropriate safeguards should protect personal
                      information against unauthorized access, loss, misuse,
                      or disclosure. No online service can promise absolute
                      security.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      7. Retention and your choices
                    </h3>
                    <p>
                      Information should be retained only as long as necessary
                      for the purposes described in the final policy, subject
                      to legal requirements. Depending on applicable law, you
                      may have rights to access, correct, or request deletion
                      of your personal information.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      8. Cookies and third-party services
                    </h3>
                    <p>
                      Cookies or similar technologies may be used if enabled
                      for authentication, preferences, security, or analytics.
                      External services may have their own privacy practices.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      9. Children's privacy
                    </h3>
                    <p>
                      The published policy should state the platform's minimum
                      account age and explain how information relating to
                      children is handled in accordance with applicable law.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      10. Updates and privacy enquiries
                    </h3>
                    <p>
                      The final policy should include an effective date and an
                      official contact method for privacy requests, complaints,
                      and questions.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 border-t border-gray-200 bg-gray-50 px-5 py-4 dark:border-gray-700 dark:bg-gray-800/70 sm:flex-row sm:items-center sm:justify-between sm:px-7">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Please review the policy before accepting it.
              </p>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    openPolicy(
                      activePolicy === 'terms' ? 'privacy' : 'terms'
                    )
                  }
                  className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-white dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  Read {activePolicy === 'terms' ? 'Privacy Policy' : 'Terms'}
                </button>

                <button
                  type="button"
                  onClick={closePolicy}
                  className="rounded-xl bg-orange-500 px-5 py-2 text-sm font-bold text-white transition hover:bg-orange-600"
                >
                  Close
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
