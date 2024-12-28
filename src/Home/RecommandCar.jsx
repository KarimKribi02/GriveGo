import React, { useState, useEffect } from 'react'
import { FaGasPump, FaCogs, FaUsers, FaHeart} from 'react-icons/fa'
import { Link } from 'react-router-dom'

function RecommandCar() {
    const [cars, setCars] = useState([])
    const [favorites, setFavorites] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [alert, setAlert] = useState({ message: "", type: "" })

    const theme = localStorage.getItem('theme')

    useEffect(() => {
        if (alert.message) {
            const timer = setTimeout(() => setAlert({ message: "", type: "" }), 2000)
            return () => clearTimeout(timer)
        }
    }, [alert])

    useEffect(() => {
        const fetchRecommandCars = async () => {
            try {
                const response = await fetch('http://localhost/drive-go/BackEnd/Cars/recommendedCars.php')
                if (!response.ok) {
                    throw new Error('Failed to fetch recommended cars.')
                }
                const data = await response.json()
                setFavorites(Array(data.data.length).fill(false))

                setTimeout(() => {
                    setCars(data.data)
                    setLoading(false)
                }, 3000)
            } catch (err) {
                setError(err.message)
                setLoading(false)
            }
        }

        fetchRecommandCars()
    }, [])

    useEffect(() => {
        const fetchFavorites = async () => {
            const userId = localStorage.getItem("userId")
            if (!userId) return

            try {
                const response = await fetch(`http://localhost/drive-go/BackEnd/Favorite/favorite.php?userID=${userId}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                })

                const data = await response.json()
                if (!data.error) {
                    const favoriteIds = data.data.map((fav) => fav.vehicle_id)
                    setFavorites(cars.map((car) => favoriteIds.includes(car.vehicle_id)))
                }
            } catch (error) {
                setAlert({
                    message: "Something went wrong while fetching favorites.",
                    type: "error",
                })
            }
        }

        fetchFavorites()
    }, [cars])

    const handleFavoriteToggle = async (index, vehicleId) => {
        const userId = localStorage.getItem("userId")

        if (!userId) {
            setAlert({
                message: "Please log in to manage your favorites.",
                type: "error",
            })
            return
        }

        try {
            const isFavorite = favorites[index]
            const url = isFavorite
                ? "http://localhost/drive-go/BackEnd/Favorite/removeFavorite.php"
                : "http://localhost/drive-go/BackEnd/Favorite/addFavorite.php"

            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: userId, vehicle_id: vehicleId }),
            })

            const result = await response.json()
            if (result.error) {
                setAlert({ message: result.error, type: "error" })
            } else {
                setFavorites((prevFavorites) =>
                    prevFavorites.map((favorite, i) => (i === index ? !favorite : favorite))
                )
                setAlert({
                    message: "Favorites updated successfully.",
                    type: "success",
                })
            }
        } catch (error) {
            setAlert({
                message: "Something went wrong. Please try again.",
                type: "error",
            })
        }
    }

    return (
        <div className="p-4">
            <h2 className={`text-xl font-bold mb-4 flex items-center ${theme === 'Dark' ? 'text-white' : ''}`}>Recommended Cars</h2>
            {alert.message && (
                <div
                    className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
                        alert.type === "error" ? "bg-red-500 text-white" : "bg-green-500 text-white"
                    }`}
                >
                    {alert.message}
                </div>
            )}
            {error ? (
                <div className="text-gray-500 text-center">
                    <p>Error: {error}</p>
                </div>
            ) : (
                <div className={`${loading ? 'flex flex-col items-center' : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'}`}>
                    {loading ? (
                        <div
                            className="flex items-center mt-4 h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-blue-500 motion-reduce:animate-[spin_1.5s_linear_infinite]"
                            role="status"
                        >
                            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
                        </div>
                    ) : (
                        cars.slice(0, 4).map((car, index) => (
                            <div key={index} className={`p-4 rounded-xl shadow-md ${theme === 'Dark' ? 'bg-gray-800' : 'bg-primary'}`}>
                                <h3 className={`text-lg font-semibold flex items-center ${theme === 'Dark' ? 'text-white' : ''}`}>
                                    {car.name}
                                    <FaHeart
                                        className={`cursor-pointer ml-auto ${favorites[index] ? 'text-red-600' : theme === 'Dark' ? 'text-gray-400' : 'text-gray-500'}`}
                                        onClick={() => handleFavoriteToggle(index, car.vehicle_id)}
                                    />
                                </h3>
                                <p className={`${theme === 'Dark' ? 'text-gray-400' : 'text-gray-500'}`}>{car.type}</p>
                                <img
                                    src={car.first_img}
                                    alt={car.name}
                                    className={`w-full h-48 object-contain rounded mt-2 ${theme === 'Dark' ? 'filter brightness-75' : ''}`}
                                />
                                <div className={`flex mt-2 ${theme === 'Dark' ? 'text-gray-300' : 'text-gray-700'} flex-wrap`}>
                                    <p className="mr-5"><FaGasPump className="inline-block mr-2" />{car.gas_capacity}</p>
                                    <p className="mr-5"><FaCogs className="inline-block mr-2" />{car.gear}</p>
                                    <p className="mr-5"><FaUsers className="inline-block mr-2" />{car.passengers} People</p>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <p className={`${theme === 'Dark' ? 'text-white' : 'text-black'} font-bold`}>
                                        {car.price} /<span className={`${theme === 'Dark' ? 'text-gray-400' : 'text-gray-300'} font-semibold`}>day</span>
                                    </p>
                                    <Link to={`/reservation/${car.vehicle_id}`}>
                                        <button className={`px-4 py-2 ${theme === 'Dark' ? 'bg-blue-600 hover:bg-blue-500' : 'bg-blue-500 hover:bg-blue-700'} text-white rounded-full`}>Rent Now</button>
                                    </Link>
                                </div>
                                <p className={`${theme === 'Dark' ? 'text-gray-500' : 'text-gray-300'} font-semibold line-through`}>{car.last_price}</p>
                            </div>
                        ))
                    )}
                </div>
            )}
            <div className="flex items-center mt-4">
                <Link
                    to="/categories"
                    className={`mx-auto px-4 py-2 ${theme === 'Dark' ? 'bg-blue-600 hover:bg-blue-500' : 'bg-blue-500 hover:bg-blue-700'} text-white rounded-full text-center`}
                >
                    Show more cars
                </Link>
            </div>
        </div>
    )
}

export default RecommandCar
