import React from 'react'
import DatePicker from 'react-datepicker'

const IMDatePicker = props => {
  const { selected, onChange } = props

  const onSelect = date => {
    const timestamp = Math.floor(date.getTime() / 1000).toString()
    onChange && onChange(timestamp)
  }

  const temp = new Date(selected * 1000)
  const date = temp.getTime() === temp.getTime() ? temp : new Date()

  return (
    <div className="card-calendar-input Card">
      <div className="CardBody">
        <DatePicker
          selected={date}
          onChange={onSelect}
          showTimeSelect
          dateFormat="Pp"
        />
      </div>
    </div>
  )
}

export default IMDatePicker