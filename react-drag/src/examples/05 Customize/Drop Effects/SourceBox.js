import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { DragSource } from 'react-dnd'
import ItemTypes from './ItemTypes'

const style = {
	border: '1px dashed gray',
	backgroundColor: 'white',
	padding: '0.5rem 1rem',
	marginRight: '1rem',
	marginBottom: '1rem',
	cursor: 'move',
}

const boxSource = {
	beginDrag() {
		return {}
	},
}

@DragSource(ItemTypes.BOX, boxSource, (connect, monitor) => ({
	connectDragSource: connect.dragSource(),
	isDragging: monitor.isDragging(),
}))
export default class SourceBox extends Component {
	static propTypes = {
		isDragging: PropTypes.bool.isRequired,
		connectDragSource: PropTypes.func.isRequired,
		showCopyIcon: PropTypes.bool,
	}

	render() {
		const { isDragging, connectDragSource, showCopyIcon } = this.props
		const opacity = isDragging ? 0.4 : 1
		const dropEffect = showCopyIcon ? 'copy' : 'move'

		return connectDragSource(
			<div style={{ ...style, opacity }}>
				When I am over a drop zone, I have {showCopyIcon ? 'copy' : 'no'} icon.
			</div>,
			{ dropEffect },
		)
	}
}
