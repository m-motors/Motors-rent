import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import Filters from './components/vehicles/filters'

import './App.css'
import Home from './pages/Home'

const router = createBrowserRouter([
	{
		path: '/',
		element: <Home/>,
		errorElement: <div>ERROR</div>,
	},
])

const App: React.FC = () => {
	return (
		<RouterProvider router={router} />
	)
}



export default App
