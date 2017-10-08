import React, { Component } from 'react'
import glamorous from 'glamorous'
import { Link } from 'react-router-dom'
import { getLocationLink, formatText, getCurrentUserId } from '../utils'
import MdLocation from 'react-icons/lib/md/location-on'
import MdLink from 'react-icons/lib/md/link'
import MdDateRange from 'react-icons/lib/md/date-range'
import ProfilePicture from './ProfilePicture'

const Sidebar = glamorous.aside({
  gridArea: 'sidebar',
  background: '#fff',
  boxShadow: '0 1px 4px rgba(0,0,0,.1)',
  borderRadius: '3px',
})

const Header = glamorous.header({
  position: 'relative',
  backgroundColor: '#d8dee2',
  height: 114,
})

const Content = glamorous.div({
  padding: '75px 24px 24px 24px',
})

const Name = glamorous.h2({
  margin: '1rem 0 0 0',
  '> a': {
    color: 'inherit',
  },
})

const Username = glamorous.small({
  fontSize: '.9rem',
  color: '#777',
  '> a': {
    color: 'inherit',
  },
})

const Description = glamorous.p({
  marginTop: '1rem',
})

const Ul = glamorous.ul({
  listStyle: 'none',
  margin: '1rem 0 0 0',
  padding: 0,
  lineHeight: '1.6rem',
})

export default class ProfileSidebar extends Component {
  state = {
    isFollowing: false, // TODO: fetch from BD
  }

  handleFollow = isFollowing => {
    this.setState({
      isFollowing,
    })
  }

  render() {
    const {
      _id: userId,
      profile_image_url: imageUrl,
      name,
      username,
      description,
      location,
      url,
      created_at: createdAt,
    } = this.props

    const [, month, , year] = String(new Date(createdAt)).split(' ')

    return (
      <Sidebar>
        <Header>
          <Link to={`/@${username}`}>
            <ProfilePicture
              src={imageUrl}
              alt={name}
              width="150"
              height="150"
              borderRadius="50%"
              border="3px solid white"
              bottom="-85px"
              left="50%"
              transform="translateX(-50%)"
              position="absolute"
            />
          </Link>
        </Header>

        <Content>
          <Name>
            <Link to={`/@${username}`}>{name}</Link>
          </Name>
          <Username>
            <Link to={`/@${username}`}>@{username}</Link>
          </Username>

          {description && (
            <Description
              dangerouslySetInnerHTML={{ __html: formatText(description) }}
            />
          )}

          <Ul>
            {location && (
              <li>
                <MdLocation />{' '}
                <a href={getLocationLink(location)}>{location}</a>
              </li>
            )}
            {url && (
              <li>
                <MdLink /> <a href={url}>{url}</a>
              </li>
            )}
            {createdAt && (
              <li>
                <MdDateRange /> Joined {month} {year}
              </li>
            )}
          </Ul>

          {getCurrentUserId() !== userId &&
            (!this.state.isFollowing ? (
              <button
                className="button"
                onClick={() => this.handleFollow(true)}
              >
                Follow
              </button>
            ) : (
              <button
                className="button outline"
                onClick={() => this.handleFollow(false)}
              >
                Unfollow
              </button>
            ))}
        </Content>
      </Sidebar>
    )
  }
}