import React, { Component } from 'react'
import { DragDropContextProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import Dustbin from './Dustbin'
import Box from './Box'

export default class Container extends Component {
	render() {
		return (
			<DragDropContextProvider backend={HTML5Backend}>
				<div>
					<div style={{ overflow: 'hidden', clear: 'both' }}>
						<Dustbin />
					</div>
					<div style={{ overflow: 'hidden', clear: 'both' }}>
						<Box name="单选题" obj={{id: new Date().getTime(), value: '拖拽题目'}}/>
						<Box name="多选题" obj={{id: new Date().getTime(), value: '拖拽题目'}}/>
						<Box name="连线题" obj={{id: new Date().getTime(), value: '拖拽题目'}}/>
					</div>
				</div>
			</DragDropContextProvider>
		)
	}
}
