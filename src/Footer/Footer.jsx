import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaDiscord, FaInstagram, FaFacebook } from 'react-icons/fa'
import { FaSquareXTwitter } from "react-icons/fa6"
import { AiOutlineClose } from 'react-icons/ai'

function Footer() {
    const [isAboutOpen, setIsAboutOpen] = useState(false)
    const [isCommunityOpen, setIsCommunityOpen] = useState(false)
    const [isSocialsOpen, setIsSocialsOpen] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isNotificationVisible, setIsNotificationVisible] = useState(false)

    const theme = localStorage.getItem('theme')
    
    useEffect(() => {
        document.documentElement.className = theme === 'Dark' ? 'dark' : ''
    }, [theme])

    const toggleSection = (section) => {
        switch(section) {
            case 'about':
                setIsAboutOpen(!isAboutOpen)
                break
            case 'community':
                setIsCommunityOpen(!isCommunityOpen)
                break
            case 'socials':
                setIsSocialsOpen(!isSocialsOpen)
                break
            default:
                break
        }
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(window.location.href);
        setIsNotificationVisible(true)
        setTimeout(() => setIsNotificationVisible(false), 3000)
    }

    const currentYear = new Date().getFullYear()

    return (
        <>
            <footer className={`p-4 sm:p-6 mt-8 ${theme === 'Dark' ? 'bg-gray-800 text-white' : 'bg-primary text-gray-800'}`}>
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Left Section */}
                        <div className="col-span-1 sm:col-span-2 lg:col-span-1">
                            <Link to="/" className="block">
                                <h3 className="text-lg font-semibold text-blue-600 cursor-pointer mb-4">DriveGo</h3>
                            </Link>
                            <p className={`mb-4 ${theme === 'Dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                We offer a wide range of vehicles for all your driving needs. Find the perfect car to meet your needs.
                            </p>
                            <p className={`text-sm ${theme === 'Dark' ? 'text-gray-400' : 'text-gray-600'}`}>&copy; {currentYear} DriveGo. All rights reserved.</p>
                        </div>

                        {/* About Section */}
                        <div className="col-span-1">
                            <div 
                                className={`flex justify-between items-center border-b pb-2 sm:border-none cursor-pointer ${theme === 'Dark' ? 'text-white' : 'text-gray-700'}`}
                                onClick={() => toggleSection('about')}
                            >
                                <h3 className={`text-lg font-bold ${theme === 'Dark' ? 'text-white' : 'text-gray-700'}`}>About</h3>
                                <span className="sm:hidden">
                                    {isAboutOpen ? '−' : '+'}
                                </span>
                            </div>
                            <ul className={`
                                ${isAboutOpen || 'hidden sm:block'} 
                                space-y-2 mt-4
                            `}>
                                <li className={`cursor-pointer ${theme === 'Dark' ? 'text-gray-400' : 'text-gray-600'} hover:text-blue-500`}><Link to="/aboutus">How it works</Link></li>
                                <li className={`cursor-pointer ${theme === 'Dark' ? 'text-gray-400' : 'text-gray-600'} hover:text-blue-500`}><Link to="/aboutus">Featured</Link></li>
                                <li className={`cursor-pointer ${theme === 'Dark' ? 'text-gray-400' : 'text-gray-600'} hover:text-blue-500`}><Link to="/aboutus">Partnership</Link></li>
                                <li className={`cursor-pointer ${theme === 'Dark' ? 'text-gray-400' : 'text-gray-600'} hover:text-blue-500`}><Link to="/aboutus">Business Relation</Link></li>
                            </ul>
                        </div>

                        {/* Community Section */}
                        <div className="col-span-1">
                            <div 
                                className={`flex justify-between items-center border-b pb-2 sm:border-none cursor-pointer ${theme === 'Dark' ? 'text-white' : 'text-gray-700'}`}
                                onClick={() => toggleSection('community')}
                            >
                                <h3 className={`text-lg font-bold ${theme === 'Dark' ? 'text-white' : 'text-gray-700'}`}>Community</h3>
                                <span className="sm:hidden">
                                    {isCommunityOpen ? '−' : '+'}
                                </span>
                            </div>
                            <ul className={`
                                ${isCommunityOpen || 'hidden sm:block'} 
                                space-y-2 mt-4
                            `}>
                                <li className={`cursor-pointer ${theme === 'Dark' ? 'text-gray-400' : 'text-gray-600'} hover:text-blue-500`}><Link to="/events">Events</Link></li>
                                <li className={`cursor-pointer ${theme === 'Dark' ? 'text-gray-400' : 'text-gray-600'} hover:text-blue-500`}><Link to="/blogs">Blog</Link></li>
                                <li className={`cursor-pointer ${theme === 'Dark' ? 'text-gray-400' : 'text-gray-600'} hover:text-blue-500`}><Link to="/podcast">Podcast</Link></li>
                                <li onClick={() => setIsModalOpen(true)} className={`cursor-pointer ${theme === 'Dark' ? 'text-gray-400' : 'text-gray-600'} hover:text-blue-500`}>Invite a friend</li>
                            </ul>
                        </div>

                        {/* Socials Section */}
                        <div className="col-span-1">
                            <div 
                                className={`flex justify-between items-center border-b pb-2 sm:border-none cursor-pointer ${theme === 'Dark' ? 'text-white' : 'text-gray-700'}`}
                                onClick={() => toggleSection('socials')}
                            >
                                <h3 className={`text-lg font-bold ${theme === 'Dark' ? 'text-white' : 'text-gray-700'}`}>Socials</h3>
                                <span className="sm:hidden">
                                    {isSocialsOpen ? '−' : '+'}
                                </span>
                            </div>
                            <ul className={`
                                ${isSocialsOpen || 'hidden sm:block'} 
                                space-y-2 mt-4
                            `}>
                                <li><a href='https://discord.com/DriveGo' target='blank' className={`cursor-pointer ${theme === 'Dark' ? 'text-gray-400' : 'text-gray-600'} hover:text-blue-500`}><FaDiscord size={24} /></a></li>
                                <li><a href='https://instagram.com/DriveGo' target='blank' className={`cursor-pointer ${theme === 'Dark' ? 'text-gray-400' : 'text-gray-600'} hover:text-blue-500`}><FaInstagram size={24} /></a></li>
                                <li><a href='https://x.com/DriveGo' target='blank' className={`cursor-pointer ${theme === 'Dark' ? 'text-gray-400' : 'text-gray-600'} hover:text-blue-500`}><FaSquareXTwitter size={24} /></a></li>
                                <li><a href='https://facebook.com/DriveGo' target='blank' className={`cursor-pointer ${theme === 'Dark' ? 'text-gray-400' : 'text-gray-600'} hover:text-blue-500`}><FaFacebook size={24} /></a></li>
                            </ul>
                        </div>
                    </div>

                    <div className={`border-t ${theme === 'Dark' ? 'border-gray-700' : 'border-gray-300'} mt-6 pt-4 text-center ${theme === 'Dark' ? 'text-gray-400' : 'text-gray-600'} flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4`}>
                        <Link to="/privacy" className={`cursor-pointer ${theme === 'Dark' ? 'hover:text-blue-500' : 'hover:text-blue-500'}`}>Privacy & Policy</Link>
                        <p>-</p>
                        <Link to="/terms" className={`cursor-pointer ${theme === 'Dark' ? 'hover:text-blue-500' : 'hover:text-blue-500'}`}>Terms & Conditions</Link>
                    </div>
                </div>
            </footer>
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-50">
                    <div className={`p-6 rounded-lg shadow-lg w-80 relative ${theme === 'Dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
                        <h3 className="text-lg font-bold mb-4">Invite a Friend</h3>
                        <p className={`text-sm mb-4 ${theme === 'Dark' ? 'text-gray-400' : 'text-gray-600'}`}>Share this link with your friends:</p>
                        <div className="flex items-center justify-between border p-2 rounded mb-4">
                            <span className={`text-sm ${theme === 'Dark' ? 'text-gray-400' : 'text-gray-800'}`}>{window.location.href}</span>
                        </div>
                        <button
                            onClick={copyToClipboard}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
                        >
                            Copy Link
                        </button>
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className={`absolute top-2 right-2 ${theme === 'Dark' ? 'text-gray-400' : 'text-gray-500'} hover:${theme === 'Dark' ? 'text-gray-200' : 'text-gray-800'}`}
                        >
                            <AiOutlineClose size={24} />
                        </button>
                    </div>
                </div>
            )}
            {isNotificationVisible && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded shadow-lg z-30">
                    <p>URL copied to clipboard!</p>
                </div>
            )}
        </>
    )
}

export default Footer
