import React, { useState, useEffect } from 'react'
import BlogList from './components/BlogList'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'
import './App.css'

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
			console.log('Invalid credentials')
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

		const returnedBlog = await blogService.create(blogToAdd)
		setBlogs(blogs.concat(returnedBlog))
		setTitle('')
		setUrl('')
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
							handleUsernameChange={({ target }) => setUsername(target.value)}
							handlePasswordChange={({ target }) => setPassword(target.value)}
						/>
						: <div>
							<h2>blogs</h2>
							<p>{user.name} logged in</p>
							<BlogList blogs={blogs} />
							<button onClick={handleLogout}>logout</button>
							<h2>create new</h2>
							<BlogForm
								title={title}
								handleTitleChange={({ target }) => setTitle(target.value)}
								url={url}
								handleUrlChange={({ target }) => setUrl(target.value)}
								addBlog={addBlog}
							/>
						</div>
				}
			</div>
		</div>
	)
}

export default App