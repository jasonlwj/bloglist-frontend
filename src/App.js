import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import './App.css'

const LoginForm = ({ handleLogin, username, password, handleUsernameChange, handlePasswordChange }) => (
	<div>
		<h2>log in to application</h2>
		<form onSubmit={handleLogin}>
			<div>
				username <input type="text" value={username} onChange={handleUsernameChange} />
			</div>
			<div>
				password <input type="password" value={password} onChange={handlePasswordChange} />
			</div>
			<button type="submit">login</button>
		</form>
	</div>
)

const BlogList = ({ blogs }) => (
	<div>
		<h2>blogs</h2>
		{blogs.map(blog =>
			<Blog key={blog.id} blog={blog} />
		)}
	</div>
)

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
						: <BlogList blogs={blogs} />
				}
			</div>
		</div>
	)
}

export default App