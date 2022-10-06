import React, { Component } from 'react'
import PostService from '../../api/todo/PostService.js'
import AuthenticationService from '../todo/AuthenticationService'
import moment from 'moment'
import './WallStyles.css'
import AppMenu from '../sept/AppMenu.jsx'

class ListPost extends Component {
    constructor(props) {
        console.log('constructor')
        super(props)
        this.state = {
            posts: [],
            message: null
        }
        this.deletePostClicked = this.deletePostClicked.bind(this)
        this.updatePostClicked = this.updatePostClicked.bind(this)
        this.addPostClicked = this.addPostClicked.bind(this)
        this.refreshPosts = this.refreshPosts.bind(this)
    }

    componentWillUnmount() {
        console.log('componentWillUnmount')
    }

    shouldComponentUpdate(nextProps, nextState) {
        console.log('shouldComponentUpdate')
        console.log(nextProps)
        console.log(nextState)
        return true
    }

    componentDidMount() {
        console.log('componentDidMount')
        this.refreshPosts();
        console.log(this.state)
    }

    loadAllPosts(){
        PostService.retrieveGlobalPosts()
            .then(
                response => {
                    //console.log(response);
                    this.setState({ posts: response.data })
                }
            )
    }

    refreshPosts() {
        let username = AuthenticationService.getLoggedInUserName()
        PostService.retrieveAllPosts(username)
            .then(
                response => {
                    //console.log(response);
                    this.setState({ posts: response.data })
                }
            )
    }

    deletePostClicked(id) {
        let username = AuthenticationService.getLoggedInUserName()
        //console.log(id + " " + username);
        PostService.deletePost(username, id)
            .then(
                response => {
                    this.setState({ message: `Delete of post ${id} Successful` })
                    this.refreshPosts()
                }
            )

    }

    addPostClicked() {
        this.props.history.push(`/posts/-1`)
    }

    updatePostClicked(id) {
        console.log('update ' + id)
        this.props.history.push(`/posts/${id}`)
    }

    createNewPost() {
        let username = AuthenticationService.getLoggedInUserName()

        let post = {
            id: -1,
            description: document.getElementById('descri').value,
            targetDate: moment(new Date()).format('YYYY-MM-DD')
        }

        PostService.createPost(username, post)
            .then(() => this.refreshPosts())

        this.refs.desc.value = '';
    }

    render() {
        console.log('render')
        return (
            <div>
                <div className="container center">
                    <AppMenu link="User Posts" history={this.props.history} />
                </div>
                {/* <div className="row">
                         <button className="btn-new-post" onClick={this.addPostClicked}>New Post</button>
                </div> */}
                <div>
                    <div className="container center">
                        <div className="status-update-input-box" align="center">
                            <textarea type="text" placeholder="What's on your mind?" ref="desc" name="description" id="descri" />
                            <button className="post-button" onClick={() => this.createNewPost()}>Post now</button>
                        </div>
                    </div>
                </div>
                <div className="container center">
                    <div className="post-container-container">
                        {
                            this.state.posts.map(
                                post =>
                                    <div className="post-container" key={post.id}>
                                        <strong className="username">{post.username}</strong>
                                        <p>{post.description}</p>
                                        <div className="date">{moment(post.targetDate).format('YYYY-MM-DD')}</div>
                                        <button className="btn-update" onClick={() => this.updatePostClicked(post.id)}>Update</button>
                                        <button className="btn-delete" onClick={() => this.deletePostClicked(post.id)}>Delete</button>
                                    </div>
                            )
                        }
                    </div>
                </div>
            </div>

        )
    }
}

export default ListPost