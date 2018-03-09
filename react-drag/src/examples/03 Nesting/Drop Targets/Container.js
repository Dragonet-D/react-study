import React, { Component } from 'react'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import Dustbin from './Dustbin'
import Box from './Box'

@DragDropContext(HTML5Backend)
export default class Container extends Component {
	render() {
		return (
			<div>
				<div style={{ overflow: 'hidden', clear: 'both', margin: '-1rem' }}>
					<Dustbin greedy>
						<Dustbin greedy>
							<Dustbin greedy />
						</Dustbin>
					</Dustbin>

					<Dustbin>
						<Dustbin>
							<Dustbin />
						</Dustbin>
					</Dustbin>
				</div>

				<div style={{ overflow: 'hidden', clear: 'both', marginTop: '1.5rem' }}>
					<Box />
				</div>
			</div>
		)
	}
}
