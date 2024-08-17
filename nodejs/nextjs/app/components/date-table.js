import React from 'react';

  const DateTable = (props) => {

  return (
    <div className="date-table">
      {props.dateList && props.dateList.map((item, index) => (
        <div className="single" key={index}>
          <div>{item.format('DD')} </div><div>{item.format('MM')}</div>
        </div>
      ))}
    </div>
  );
}

export default DateTable;