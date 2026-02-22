import { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { authService } from '../services/authService'
import { validateEmail, validatePassword } from '../utils/validation'
import Toast from '../components/Toast'
import Loading from '../components/Loading'

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [toast, setToast] = useState(null)
    const [fieldErrors, setFieldErrors] = useState({})
    
    const { login } = useContext(AuthContext)
    const navigate = useNavigate()

    const validateForm = () => {
        const errors = {}
        if (!email) {
            errors.email = 'Email is required'
        } else if (!validateEmail(email)) {
            errors.email = 'Please enter a valid email'
        }
        if (!password) {
            errors.password = 'Password is required'
        } else if (!validatePassword(password)) {
            errors.password = 'Password must be at least 6 characters'
        }
        setFieldErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validateForm()) return

        setError("")
        setLoading(true)
        
        try {
            const response = await authService.login(email, password)
            const userId = response.user._id;
            login(response.token, String(userId))
            setToast({ message: 'Login successful! Redirecting...', type: 'success' })
            setTimeout(() => navigate('/'), 1500)
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Invalid email or password"
            setError(errorMsg)
            setToast({ message: errorMsg, type: 'error' })
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <Loading text="Signing in..." />

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="text-center">
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Welcome Back, to KodeMedia
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Log in to your account to start posting
                    </p>
                </div>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-lg border border-gray-100 sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                        {error && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm font-medium border border-red-200 flex items-start">
                                <svg className="w-5 h-5 mr-2 mt-0.5 flex shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="login-email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="login-email"
                                    name="email"
                                    type="email"
                                    className={`appearance-none block w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                                        fieldErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value)
                                        if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: '' })
                                    }}
                                />
                                {fieldErrors.email && (
                                    <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="login-password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="login-password"
                                    name="password"
                                    type="password"
                                    className={`appearance-none block w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                                        fieldErrors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value)
                                        if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: '' })
                                    }}
                                />
                                {fieldErrors.password && (
                                    <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? "Signing in..." : "Sign in"}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                                Register here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login