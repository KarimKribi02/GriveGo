import React from 'react'
import Dashboard from './Dashboard/Dashboard'
import CarRental from './Cars/CarRental'
import Insight from './Insight/Insight'
import Reservations from './Reservations/Reservations'
import Inbox from './Inbox/Inbox'
import Users from './Users/Users'

function Content({ activeItem }) {
    const renderContent = () => {
        switch (activeItem) {
            case 'Dashboard':
                return <Dashboard></Dashboard>
            case 'Car Rent':
                return <CarRental></CarRental>
            case 'Insight':
                return <Insight></Insight>
            case 'Reservations':
                return <Reservations></Reservations>
            case 'Inbox':
                return <Inbox></Inbox>
            case 'Users':
                return <Users></Users>
            default:
                return <div>Select an option from the menu</div>
        }
    }

    return (
        <>
            {renderContent()}
        </>
    )
}

export default Content
