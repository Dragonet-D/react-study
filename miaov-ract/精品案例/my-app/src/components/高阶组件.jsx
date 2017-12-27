import React, {Component} from 'react'
import Comment from "../../../../../react-dianping/react-dianping-stage7-user-page/app/containers/Detail/subpage/Comment";

class CommenrtList extends React.Component {
  constructor() {
    super()
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      components: DataSource.getComments()
    }
  }

  componentDidMount() {
    DataSource.addChangeListener(this.handleChange)
  }

  componentWillUnmount() {
    DataSource.removeChangeListener(this.handleChange)
  }

  handleChange() {
    this.serState({
      comments: DataSource.getComments()
    })
  }

  render() {
    return (
      <div>
        {
          this.state.comments.map((comment) => (
            <Comment comment={comment} key={comment.id}/>
          ))
        }
      </div>
    )
  }
}
