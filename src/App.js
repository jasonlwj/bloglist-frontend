import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
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
  
  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
      )  
    }, [])
    
  const handleUsernameChange = ({ target }) => setUsername(target.value)

  const handlePasswordChange = ({ target }) => setPassword(target.value)

  const handleLogin = () => {
    console.log('logging in with', username, password)
  }

  return (
    <div className="App">
      <div>
        <LoginForm
          handleLogin={handleLogin}
          username={username}
          password={password}
          handleUsernameChange={handleUsernameChange}
          handlePasswordChange={handlePasswordChange}
        />
        <BlogList blogs={blogs} />
      </div>
    </div>
  )
}

export default App