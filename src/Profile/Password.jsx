import React, { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

function Password({ user }) {
    document.title = 'DriveGo - Password'

    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    
    const [successMessage, setSuccessMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    const [oldPasswordError, setOldPasswordError] = useState(false)
    const [newPasswordError, setNewPasswordError] = useState(false)
    const [confirmPasswordError, setConfirmPasswordError] = useState(false)
    
    const [showOldPassword, setShowOldPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        let hasError = false

        setOldPasswordError(false)
        setNewPasswordError(false)
        setConfirmPasswordError(false)

        if (!oldPassword || !newPassword || !confirmPassword) {
            setOldPasswordError(true)
            setNewPasswordError(true)
            setConfirmPasswordError(true)
            setErrorMessage('Please fill in all fields.')
            setTimeout(() => setErrorMessage(''), 3000)
            hasError = true
        }

        else if (newPassword.length <= 6) {
            setNewPasswordError(true)
            setErrorMessage('New password must be at least 6 characters long.')
            setTimeout(() => setErrorMessage(''), 3000)
            hasError = true
        }

        else if (newPassword !== confirmPassword) {
            setConfirmPasswordError(true)
            setErrorMessage("New password and confirmation do not match")
            setTimeout(() => setErrorMessage(''), 3000)
            hasError = true
        }

        if (hasError) return

        const data = {
            userId: user,
            oldPassword,
            newPassword,
        }

        try {
            const response = await fetch('http://localhost/drive-go/BackEnd/Profile/changePassword.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })

            const result = await response.json()

            if (result.success) {
                setSuccessMessage(result.message)
                setTimeout(() => setSuccessMessage(''), 3000)
            } else {
                setErrorMessage(result.error)
                setTimeout(() => setErrorMessage(''), 3000)
            }
        } catch (error) {
            setErrorMessage('An error occurred')
            setTimeout(() => setErrorMessage(''), 3000)
        }
    }

    return (
        <>
    {/* Success and Error Messages */}
    {successMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white p-3 w-11/12 sm:w-1/2 lg:w-1/3 text-center rounded-lg shadow-lg">
            {successMessage}
        </div>
    )}
    {errorMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-500 text-white p-3 w-11/12 sm:w-1/2 lg:w-1/3 text-center rounded-lg shadow-lg">
            {errorMessage}
        </div>
    )}

    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold mb-6 px-4 sm:px-6 py-4 bg-gradient-to-r from-blue-300 to-purple-200">
            Password Settings
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6 p-4 sm:p-6 md:p-8">
            {/* Old Password */}
            <div className="flex flex-col">
                <label className="block text-gray-700 font-medium mb-1 text-sm sm:text-base">
                    Old Password
                </label>
                <div className="relative">
                    <input
                        type={showOldPassword ? "text" : "password"}
                        name="oldPassword"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className={`w-full px-4 py-2 border ${oldPasswordError || errorMessage === 'Old password is incorrect' ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        placeholder="Old Password"
                    />
                    <button
                        type="button"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                        className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-500"
                    >
                        {showOldPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>
            </div>

            {/* New Password */}
            <div className="flex flex-col">
                <label className="block text-gray-700 font-medium mb-1 text-sm sm:text-base">
                    New Password
                </label>
                <div className="relative">
                    <input
                        type={showNewPassword ? "text" : "password"}
                        name="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className={`w-full px-4 py-2 border ${newPasswordError ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        placeholder="New Password"
                    />
                    <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-500"
                    >
                        {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col">
                <label className="block text-gray-700 font-medium mb-1 text-sm sm:text-base">
                    Confirm Password
                </label>
                <div className="relative">
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`w-full px-4 py-2 border ${confirmPasswordError ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        placeholder="Confirm Password"
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-500"
                    >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-between space-x-4">
                <button
                    type="button"
                    onClick={() => {
                        setOldPassword('');
                        setNewPassword('');
                        setConfirmPassword('');
                        setMessage('');
                    }}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-500 w-full sm:w-auto"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500 w-full sm:w-auto"
                >
                    Update
                </button>
            </div>
        </form>
    </div>
</>

    )
}

export default Password
