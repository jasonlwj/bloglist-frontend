import React, { useState, useEffect } from 'react'
import BlogList from './components/BlogList'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Error from './components/Error'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import './App.css'

// TODO allow user to input author name - this also means modifying the backend

const App = () => {
	// blogs state
	const [ blogs, setBlogs ] = useState([])

	// login state
	const [ username, setUsername ] = useState('')
	const [ password, setPassword ] = useState('')
	const [ user, setUser ] = useState(null)

	// new blog state
	const [ title, setTitle ] = useState('')
	const [ url, setUrl ] = useState('')

	// messages
	const [ notificationMessage, setNotificationMessage] = useState(null)
	const [ errorMessage, setErrorMessage] = useState(null)
	
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
			blogService.setToken(userJSON.token)
			setUser(userJSON)
		}
	}, [])
	
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

			blogService.setToken(user.token)
			setUser(user)
			setUsername('')
			setPassword('')
		} catch (error) {
			setErrorMessage('Wrong credentials')
			setTimeout(() => {
				setErrorMessage(null)
			}, 5000)
		}
	}

	const handleLogout = () => {
		setUser(null)
		window.localStorage.removeItem('userLoggedIn')
	}

	const addBlog = async event => {
		event.preventDefault()

		const blogToAdd = {
			title,
			url
		}

		try {
			const returnedBlog = await blogService.create(blogToAdd)
			setBlogs(blogs.concat(returnedBlog))
			setTitle('')
			setUrl('')
			setNotificationMessage(`a new blog ${blogToAdd.title} added`)
			setTimeout(() => {
				setNotificationMessage(null)
			}, 5000)
		} catch (error) {
			setErrorMessage('Error in creating blog')
			setTimeout(() => {
				setErrorMessage(null)
			}, 5000)
		}
	}

	// render the blog form
	const blogForm = () => (
		<Togglable buttonLabel='new blog'>
				<h2>create new</h2>
				<BlogForm
					title={title}
					handleTitleChange={({ target }) => setTitle(target.value)}
					url={url}
					handleUrlChange={({ target }) => setUrl(target.value)}
					addBlog={addBlog}
				/>
		</Togglable>
	)

	// render the whole component
	return (
		<div className="App">
			<div>
				<Notification message={notificationMessage} />
				<Error message={errorMessage} />
				{
					!user 
						? <LoginForm
							handleLogin={handleLogin}
							username={username}
							password={password}
							handleUsernameChange={({ target }) => setUsername(target.value)}
							handlePasswordChange={({ target }) => setPassword(target.value)}
						/>
						: (
							<div>
								<h2>blogs</h2>
								<p>{user.name} logged in</p>
								<BlogList blogs={blogs} />
								<button onClick={handleLogout}>logout</button>
								{blogForm()}
							</div>
						)
				}
			</div>
		</div>
	)
}

export default App