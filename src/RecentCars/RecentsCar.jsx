import {useState, useEffect} from 'react'
import {FaHeart, FaGasPump, FaCogs, FaUsers } from 'react-icons/fa'
import { Link } from 'react-router-dom'

function RecentCars() {
    const [cars, setCars] = useState([])
    const [favorites, setFavorites] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchRecentsCars = async () => {
            try {
                const response = await fetch('http://localhost/drive-go/BackEnd/Cars/recentsCar.php')
                if (!response.ok) {
                    throw new Error('Failed to fetch recents cars.')
                }
                const data = await response.json()
                setFavorites(Array(data.data.length).fill(false))

                setTimeout(() => {
                    setCars(data.data)
                    setLoading(false)
                }, 2000)
            } catch (err) {
                setError(err.message)
                setLoading(false)
            }
        }

        fetchRecentsCars()
    }, [])

    const handleFavoriteToggle = (index) => {
        const newFavorites = [...favorites]
        newFavorites[index] = !newFavorites[index]
        setFavorites(newFavorites)
    }

    return (
        <>
            <div className="p-4">
                <h2 className="text-xl font-bold mb-4 flex items-center">Recent Car</h2>
                {error ? (
                    <div className="text-gray-500 text-center">
                        <p>{error}</p>
                    </div>
                ) : (
                <div
                    className={`${
                    loading
                        ? "flex flex-col items-center"
                        : " grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
                    }`}
                >
                    {loading ? (
                    <>
                        <div
                        className="flex items-center mt-4 h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-blue-500 motion-reduce:animate-[spin_1.5s_linear_infinite]"
                        role="status"
                        >
                        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                            Loading...
                        </span>
                        </div>
                    </>
                    ) : (
                    cars.map((car, index) => (
                        <div key={index} className="bg-primary p-4 rounded-xl">
                        <h3 className="text-lg font-semibold flex items-center">
                            {car.name}
                            <FaHeart
                            className={`cursor-pointer ml-auto ${
                                favorites[index] ? "text-red-600" : "text-gray-500"
                            }`}
                            onClick={() => handleFavoriteToggle(index)}
                            />
                        </h3>
                        <p className="text-gray-500">{car.type}</p>
                        <img
                            src={car.first_img}
                            alt={car.name}
                            className="w-full h-48 object-cover rounded"
                        />
                        <div className="flex mt-2 text-gray-700">
                            <p className="mr-5">
                            <FaGasPump className="inline-block mr-2" />
                            {car.gas_capacity}
                            </p>
                            <p className="mr-5">
                            <FaCogs className="inline-block mr-2" />
                            {car.gear}
                            </p>
                            <p className="mr-5">
                            <FaUsers className="inline-block mr-2" />
                            {car.passengers} People
                            </p>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                            <p className="text-black font-bold">
                            {car.price} /
                            <span className="text-gray-300 font-semibold">day</span>
                            </p>
                            <Link
                            to={`/reservation/${car.vehicle_id}`}
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded-full"
                            >
                            Rent Now
                            </Link>
                        </div>
                        <p className="text-gray-300 font-semibold line-through">
                            {car.last_price}
                        </p>
                        </div>
                    ))
                    )}
                </div>
                )}
            </div>
        </>
    )
}

export default RecentCars
