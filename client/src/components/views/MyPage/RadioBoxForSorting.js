import React, { useState } from 'react'
import { Collapse, Radio } from 'antd';
const { Panel } = Collapse;

const sort = [
    {
        "_id": 0,
        "name": "최신순",
    },
    {
        "_id": 1,
        "name": "높은 가격순",
    },
    {
        "_id": 2,
        "name": "낮은 가격순",
    }
]


function RadioBox(props) {

    const [Value, setValue] = useState('0')

    const renderRadioBox = () => (
        props.list &&  props.list.map((value) => (
            <Radio key={value._id} value={`${value._id}`}>{value.name}</Radio>
        ))
    )

    const handleChange = (event) => {
        setValue(event.target.value)
        props.handleFilters(event.target.value)
    }

    return (
        <div>
            <Collapse defaultActiveKey={['0']}>
                <Panel header="sort" key="1">
                    <Radio.Group onChange={handleChange} value={Value}>

                        {renderRadioBox()}

                    </Radio.Group>
                </Panel>
            </Collapse>
        </div>
    )
}

export default RadioBox
export {
    sort
}