import React, { useState, useEffect, useRef } from 'react'
import { FaBell, FaTimes } from 'react-icons/fa'

function Notification() {
    const user = localStorage.getItem('userId')
    const [notifications, setNotifications] = useState([])
    const [selectedNotification, setSelectedNotification] = useState(null)
    const [isOpen, setIsOpen] = useState(false)
    const menuRef = useRef(null)

    const theme = localStorage.getItem('theme')
    
    useEffect(() => {
        document.documentElement.className = theme === 'Dark' ? 'dark' : ''
    }, [theme])

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await fetch(`http://localhost/drive-go/BackEnd/Notifications/notification.php?userID=${user}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                })
                const data = await response.json()
                if (data.notifications) {
                    setNotifications(data.notifications)
                }
            } catch (error) {
                console.error('Error fetching notifications:', error)
            }
        }

        if (user) {
            fetchNotifications()
        }
    }, [user])

    const handleNotificationClick = async (notification) => {
        await fetch(`http://localhost/drive-go/BackEnd/Notifications/markAsRead.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ notificationId: notification.notification_id }),
        })

        setNotifications(prevNotifications =>
            prevNotifications.map(notif =>
                notif.notification_id === notification.notification_id ? { ...notif, status: true } : notif
            )
        )
        setSelectedNotification(notification)
    }

    const toggleMenu = () => {
        setIsOpen(!isOpen)
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <>
            <div onClick={toggleMenu} className="relative p-2 border rounded-full cursor-pointer">
                <FaBell className={`w-4 h-4 sm:w-5 sm:h-5 ${theme === 'Dark' ? 'text-gray-200' : 'text-gray-700'} cursor-pointer hover:text-blue-500`} />
                {notifications.length > 0 && (
                    <span className="absolute top-0 -right-1 inline-block w-4 h-4 sm:w-4 sm:h-4 bg-red-500 rounded-full text-xs text-white text-center">
                        {notifications.length}
                    </span>
                )}
            </div>
            {isOpen && (
                <div ref={menuRef} className={`absolute right-4 sm:right-10 md:right-36 top-14 border rounded-lg shadow-lg ${theme === 'Dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
                    <ul className={`py-1 ${notifications.length > 5 ? 'max-h-64 sm:max-h-80 md:max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-transparent rounded-lg' : ''}`}>
                        {notifications.length > 0 ? (
                            notifications.map((notification, index) => (
                                <li
                                    key={index}
                                    onClick={() => handleNotificationClick(notification)}
                                    className={`px-4 py-2 text-sm sm:text-base cursor-pointer ${notification.status === 'Unread' ? 'font-bold' : ''} ${theme === 'Dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                                >
                                    {notification.message.slice(0, 20)}{notification.message.length > 10 ? '...' : ''}
                                </li>
                            ))
                        ) : (
                            <li className="px-4 py-2 text-sm sm:text-base text-gray-800 cursor-pointer">No notifications</li>
                        )}
                    </ul>
                </div>
            )}
            {selectedNotification && (
                <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-800 bg-opacity-50 flex justify-center items-center cursor-default z-50">
                    <div className={`relative p-4 sm:p-6 rounded-lg shadow-lg w-[90%] sm:w-[400px] ${theme === 'Dark' ? 'text-white bg-gray-800' : 'text-gray-800 bg-white'}`}>
                        <h3 className="text-lg font-semibold">Notification</h3>
                        <p>{selectedNotification.message}</p>
                        <button
                            onClick={() => setSelectedNotification(null)}
                            className="absolute top-2 right-2 p-2 bg-blue-500 hover:bg-blue-400 text-white rounded-lg"
                        >
                            <FaTimes />
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}

export default Notification
