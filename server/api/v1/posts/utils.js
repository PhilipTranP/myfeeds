const {
  COLLECTION_USERS,
  COLLECTION_POSTS,
  COLLECTION_FAVORITES,
} = require('../../../constants')

/**
 * Returns the given posts with their authors' information to send only one response to the client.
 * To improve the efficiency, it looks up in a user reference object if the author is already known
 * to not request the database when not needed.
 *
 * @param {object[]} posts The posts to populate with the authors
 * @param {object} db The database object
 * @return {object[]}
 * @private
 */
const getPostsWithAuthors = async (posts, db) => {
  const postsWithAuthors = []
  const userLookup = {}

  for (let post of posts) {
    const authorId = post.user_id

    if (!userLookup[authorId]) {
      const author = await db
        .collection(COLLECTION_USERS)
        .findOne({ _id: authorId })

      userLookup[authorId] = getAuthorData(author)
    }

    delete post.user_id

    postsWithAuthors.push({
      ...post,
      ...userLookup[authorId],
    })
  }

  return postsWithAuthors
}

/**
 * Returns the author's public information to be merged with the post.
 *
 * @param {object} author The author to get the data from
 * @return {object}
 * @private
 */
const getAuthorData = author => ({
  username: author.username,
  name: author.name,
  profile_image_url: author.profile_image_url,
})

/**
 * Returns the given post with metadata.
 * This data is specific to the given user.
 * Example: { ...post, replied: false, favorited: true }
 *
 * @param {object} post The post to get the data from
 * @param {number} userId The ID of the user to get the metadata for
 * @param {object} db The database object
 * @return {object}
 */
const getSinglePostWithMetadata = async (post, userId, db) => {
  const favorited = !!await db.collection(COLLECTION_FAVORITES).findOne({
    user_id: userId,
    post_id: post._id,
  })
  const replied = !!await db.collection(COLLECTION_POSTS).findOne({
    user_id: userId,
    parent_id: post._id,
  })

  return {
    ...post,
    favorited,
    replied,
  }
}

/**
 * Returns the given posts with metadata.
 *
 * @param {object[]} posts The array of posts to process
 * @param {number} userId The ID of the user to get the metadata for
 * @param {object} db The database object
 * @see {@link getSinglePostWithMetadata}
 */
const getPostsWithMetadata = async (posts, userId, db) => {
  const postsWithMetadata = []

  for (let post of posts) {
    postsWithMetadata.push(await getSinglePostWithMetadata(post, userId, db))
  }

  return postsWithMetadata
}

/**
 * Returns posts with highlighted search results.
 *
 * This is a custom function because MongoDB cannot return matching elements.
 *
 * Uses a regex to ignore all non-alphanumerical characters.
 *  - `\w` is any digit, letter, or underscore.
 *  - `\s` is any whitespace.
 *  - `[^\w\s]` is anything that's not a digit, letter, whitespace, or underscore.
 *  - `[^\w\s]|_` is the same as #3 except with the underscores added back in.
 * See: https://stackoverflow.com/a/4328546
 *
 * @param {object[]} posts The posts to highlight terms in
 * @param {string} terms The terms to highlight
 * @param {string} tag The tag to wrap the terms with
 * @return {object[]}
 * @private
 */
const highlightTerms = (posts, terms, tag = 'em') => {
  const words = terms
    .replace(/[^\w\s]|_/g, ' ')
    .replace(/\s+/g, ' ')
    .split(' ')

  return posts.map(post => {
    words.forEach(word => {
      const regex = new RegExp(word, 'gi')
      const wordCased = post.text.match(regex)
        ? post.text.match(regex)[0]
        : word
      post.text = post.text.replace(regex, `<${tag}>${wordCased}</${tag}>`)
    })
    return post
  })
}

module.exports = {
  getAuthorData,
  getPostsWithAuthors,
  getSinglePostWithMetadata,
  getPostsWithMetadata,
  highlightTerms,
}
