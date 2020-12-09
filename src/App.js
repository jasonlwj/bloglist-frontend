import React, { useState, useEffect } from 'react'
import BlogList from './components/BlogList'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import loginService from './services/login'
import './App.css'

const App = () => {
	const [ blogs, setBlogs ] = useState([])
	const [ username, setUsername ] = useState('')
	const [ password, setPassword ] = useState('')
	const [ user, setUser ] = useState(null)
	
	// get all blogs
	useEffect(() => {
		blogService.getAll().then(blogs =>
			setBlogs( blogs )
		)  
	}, [])
		
	// check if user is logged in
	useEffect(() => {
		const userLoggedIn = window.localStorage.getItem('userLoggedIn')

		if (userLoggedIn) {
			const userJSON = JSON.parse(userLoggedIn)
			setUser(userJSON)
		}
	}, [])
	
	const handleUsernameChange = ({ target }) => setUsername(target.value)

	const handlePasswordChange = ({ target }) => setPassword(target.value)

	const handleLogin = async event => {
		event.preventDefault()

		try {
			const user = await loginService.login({
				username, 
				password
			})

			window.localStorage.setItem(
				'userLoggedIn', JSON.stringify(user)
			)

			setUser(user)
			setUsername('')
			setPassword('')
		} catch (error) {
			console.log('Invalid credentials')
		}
	}

	const handleLogout = () => {
		setUser(null)
		window.localStorage.removeItem('userLoggedIn')
	}

	return (
		<div className="App">
			<div>
				{
					!user 
						? <LoginForm
							handleLogin={handleLogin}
							username={username}
							password={password}
							handleUsernameChange={handleUsernameChange}
							handlePasswordChange={handlePasswordChange}
						/>
						: <div>
							<h2>blogs</h2>
							<p>{user.name} logged in</p>
							<BlogList blogs={blogs} />
							<button onClick={handleLogout}>logout</button>
						</div>
				}
			</div>
		</div>
	)
}

export default App