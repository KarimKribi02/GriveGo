import React, { useState, useEffect } from 'react'
import { FiEdit, FiTrash, FiPlus, FiX } from "react-icons/fi"
import AddCar from './AddCar'
import ModifyCar from './ModifyCar'

function CarRental() {
    const user = localStorage.getItem("userId")
    const [cars, setCars] = useState([])
    const [types, setTypes] = useState([])
    const [gases, setGases] = useState([])
    const [geares, setGeares] = useState([])
    const [brands, setBrands] = useState([])
    const [error, setError] = useState(null)
    
    const [currentPage, setCurrentPage] = useState(1)
    const [searchQuery, setSearchQuery] = useState("")
    const carsPerPage = 5

    const filteredCars = cars.filter((car) =>
        car?.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const totalPages = Math.ceil(filteredCars.length / carsPerPage)
    const paginatedCars = filteredCars.slice((currentPage - 1) * carsPerPage, currentPage * carsPerPage)

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1)
        }
    }

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1)
        }
    }

    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber)
    }

    const [showForm, setShowForm] = useState(false)
    const [modifyForm, setModifyForm] = useState(false)
    const [carId, setCarId] = useState(null)
    const [formData, setFormData] = useState({owner_id: '', name: '', brand_id: '', type: '', price: '', last_price: '', first_img: '', second_img: '', third_img: '', type_gas: '', gas_capacity: '', gear: '', passengers: '', location: '', description: '',})

    const [alert, setAlert] = useState({ type: '', message: '' })

    // Fetch cars data
    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await fetch('http://localhost/drive-go/BackEnd/Admin/Cars/cars.php')
                if (!response.ok) {
                    throw new Error('Failed to fetch vehicles.')
                }
                const data = await response.json()

                setCars(data.data)
                setTypes(data.types)
                setGases(data.gas)
                setGeares(data.gear)
                setBrands(data.brands)
                setError(data.error || null)
            } catch (err) {
                setError(err.message)
            }
        }

        fetchVehicles()
    }, [])

    // Delete car
    const handleDeleteCar = async (vehicleId) => {
        try {
            const response = await fetch('http://localhost/drive-go/BackEnd/Admin/Cars/removeCar.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: user,
                    vehicle_id: vehicleId,
                }),
            })

            const data = await response.json()

            if (data.success) {
                setCars((prevCars) => prevCars.filter((car) => car.vehicle_id !== vehicleId))
                alert('Car deleted successfully')
            } else {
                alert(data.error || 'Failed to delete car')
            }
        } catch (err) {
            alert(`Error: ${err.message}`)
        }
    }
    
    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }))
    }

    // Add car
    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!user) {
            setAlert({ type: 'error', message: 'User is not logged in.' })
            setTimeout(() => {
                setAlert({ type: '', message: '' })
            }, 2000)
            return
        }
    
        const updatedFormData = {
            ...formData,
            owner_id: user,
        }
        
        try {
            const response = await fetch('http://localhost/drive-go/BackEnd/Admin/Cars/addCar.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedFormData),
            })
    
            const data = await response.json()
    
            if (data.success) {
                setCars((prevCars) => [...prevCars, data.newCar])
                setShowForm(false)
                setFormData({owner_id: user, name: '', brand_id: '', type: '', price: '', last_price: '', first_img: '', second_img: '', third_img: '', type_gas: '', gas_capacity: '', gear: '', passengers: '', location: '', description: '',})
                setAlert({ type: 'success', message: 'Car added successfully!' })
                setTimeout(() => {
                    setAlert({ type: '', message: '' })
                }, 2000)
            } else {
                setAlert({ type: 'error', message: data.error || "Failed to add car." })
                setTimeout(() => {
                    setAlert({ type: '', message: '' })
                }, 2000)
            }
        } catch (err) {
            setAlert({ type: 'error', message: err.message })
            setTimeout(() => {
                setAlert({ type: '', message: '' })
            }, 2000)
        }
    }

    return (
        <>
            <div className="flex min-h-screen">
                {/* Main Content */}
                <main className="flex-1">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold">Car Stock</h1>
                        <div className="flex justify-evenly w-1/3">
                            <input
                                type="text"
                                placeholder="Search car name"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
                            />
                            <button
                                className={`px-4 py-2 text-white rounded-lg ${showForm ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                                onClick={() => setShowForm(!showForm)}
                            >
                                {showForm ? <FiX /> : <FiPlus />}
                            </button>
                        </div>
                    </div>

                    {/* Show Alert if exists */}
                    {alert.message && (
                        <div
                            className={`fixed top-0 z-50 left-1/2 transform -translate-x-1/2 mt-4 p-4 rounded-lg ${alert.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
                        >
                            {alert.message}
                        </div>
                    )}

                    {showForm && (
                        <AddCar
                            handleSubmit={handleSubmit}
                            formData={formData}
                            handleInputChange={handleInputChange}
                            brands={brands}
                            types={types}
                            gases={gases}
                            geares={geares}
                        />
                    )}
                    {modifyForm && carId && (
                        <ModifyCar
                            user={user}
                            car={carId}
                            brands={brands}
                            types={types}
                            gases={gases}
                            geares={geares}
                        />
                    )}

                    {/* Table */}
                    {error ? (
                        <div className="text-gray-500 text-center">
                            <p>{error}</p>
                        </div>
                    ) : (filteredCars.length === 0 ? (
                            <div className="text-gray-500 text-center mt-6">
                                <p>Car not found</p>
                            </div>
                        ) : (
                            <>
                                <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
                                    <table className="w-full table-auto">
                                        <thead className="bg-gray-200">
                                            <tr>
                                                <th className="px-4 py-2 text-left text-gray-600">ID</th>
                                                <th className="px-4 py-2 text-left text-gray-600">Image</th>
                                                <th className="px-4 py-2 text-left text-gray-600">Name</th>
                                                <th className="px-4 py-2 text-left text-gray-600">Category</th>
                                                <th className="px-4 py-2 text-left text-gray-600">Type</th>
                                                <th className="px-4 py-2 text-left text-gray-600">Capacity</th>
                                                <th className="px-4 py-2 text-left text-gray-600">Gear</th>
                                                <th className="px-4 py-2 text-left text-gray-600">Price</th>
                                                <th className="px-4 py-2 text-left text-gray-600">Last Price</th>
                                                <th className="px-4 py-2 text-left text-gray-600">Status</th>
                                                <th className="px-4 py-2 text-left text-gray-600">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginatedCars.map((car, index) => (
                                                <tr key={index} className="hover:bg-gray-100 border-b" title={car.description}>
                                                    <td className="px-4 text-center py-2">{car.vehicle_id}</td>
                                                    <td className="px-4 py-2">
                                                        <img
                                                            src={car.first_img}
                                                            alt={car.name}
                                                            className="w-20 h-20 object-contain"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-2">{car.name}</td>
                                                    <td className="px-4 py-2">{car.type}</td>
                                                    <td className="px-4 py-2">{car.type_gas}</td>
                                                    <td className="px-4 py-2">{car.gas_capacity}</td>
                                                    <td className="px-4 py-2">{car.gear}</td>
                                                    <td className="px-4 py-2">{car.price}</td>
                                                    <td className="px-4 text-center py-2">{car.last_price || '-'}</td>
                                                    <td className="px-4 text-center py-2">{car.availability_status ? 'Available' : 'Unavailable'}</td>
                                                    <td className="px-4 text-center py-2">
                                                        <div className="flex space-x-2">
                                                            <button
                                                                className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                                                onClick={() => {
                                                                    setCarId(car.vehicle_id)
                                                                    setModifyForm(true)
                                                                }}
                                                            >
                                                                <FiEdit />
                                                            </button>
                                                            <button
                                                                className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                                                                onClick={() => handleDeleteCar(car.vehicle_id)}
                                                            >
                                                                <FiTrash />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {/* Pagination */}
                                <div className="flex justify-center space-x-2 mt-4">
                                    <button
                                        onClick={handlePreviousPage}
                                        disabled={currentPage === 1}
                                        className={`px-3 py-1 rounded ${
                                            currentPage === 1 ? "bg-gray-300" : "bg-blue-500 text-white hover:bg-blue-600"
                                        }`}
                                    >
                                        Previous
                                    </button>
                                    {Array.from({ length: totalPages }, (_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handlePageClick(index + 1)}
                                            className={`px-3 py-1 rounded ${
                                                currentPage === index + 1
                                                    ? "bg-blue-500 text-white"
                                                    : "bg-gray-300 hover:bg-gray-400"
                                            }`}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}
                                    <button
                                        onClick={handleNextPage}
                                        disabled={currentPage === totalPages}
                                        className={`px-3 py-1 rounded ${
                                            currentPage === totalPages ? "bg-gray-300" : "bg-blue-500 text-white hover:bg-blue-600"
                                        }`}
                                    >
                                        Next
                                    </button>
                                </div>
                            </>
                        )
                    )}
                </main>
            </div>
        </>
    )
}

export default CarRental
