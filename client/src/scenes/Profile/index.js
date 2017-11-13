import React, { Component } from 'react'
import MdFindInPage from 'react-icons/lib/md/find-in-page'
import MdList from 'react-icons/lib/md/list'
import MdCreate from 'react-icons/lib/md/create'
import api from 'api'
import { getActiveUser } from 'utils'
import { SITE_TITLE } from '../../constants'
import Sidebar from 'components/Sidebar'
import Scaffold from 'components/Scaffold'
import Content from 'components/Content'
import Feed from 'components/Feed'
import PostList from 'components/PostList'
import Post from 'components/Post'

class ProfileScene extends Component {
  activeUser = getActiveUser()
  state = {
    error: '',
    user: {},
    posts: [],
  }

  async componentDidMount() {
    const username = this.props.match.params.username
    const user = await api.getUserByUsername(username)

    if (user && user._id) {
      document.title = `${user.name} - ${SITE_TITLE}`
      const posts = await api.getAllPostsByUsernameAsUserId(
        username,
        this.activeUser._id
      )

      this.setState({
        loading: false,
        user,
        posts,
      })
    } else {
      this.setState({
        loading: false,
        error: `The user <strong>@${this.props.match.params
          .username}</strong> doesn't exist.`,
        user: this.activeUser,
      })
    }
  }

  renderError = error => {
    return (
      <div style={{ textAlign: 'center' }}>
        <MdFindInPage size={212} color="#ddd" />

        <p dangerouslySetInnerHTML={{ __html: error }} />
      </div>
    )
  }

  render() {
    return (
      <Scaffold grid>
        <Sidebar user={this.state.user} />
        <Content className="content">
          {this.state.error ? (
            this.renderError(this.state.error)
          ) : (
            <Feed
              posts={this.state.posts}
              render={({ posts, onFavorite, onItemClick }) => (
                <PostList>
                  {posts.map(post => (
                    <li key={post._id}>
                      <Post
                        {...post}
                        onFavorite={onFavorite}
                        onItemClick={onItemClick}
                      />
                    </li>
                  ))}
                </PostList>
              )}
              renderLoading={() => (
                <div style={{ textAlign: 'center' }}>
                  <MdList size={200} color="#ddd" />
                </div>
              )}
              renderEmpty={() => (
                <div style={{ textAlign: 'center', padding: 24 }}>
                  <MdCreate size={200} color="#ddd" />

                  <p>
                    <strong>@{this.state.user.username}</strong> hasn't posted
                    yet. Get in touch!
                  </p>
                </div>
              )}
            />
          )}
        </Content>
      </Scaffold>
    )
  }
}

export default ProfileScene
