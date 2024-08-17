import React, { useState, useEffect } from 'react';

const PriceTable = (props) => {
  const { min, base, pts } = props;
  const [ priceList, setPriceList ] = useState(null);
  useEffect(() => {
    // Create price table
    const price = [];
    let baseline = min;
    for (let i = 0; i < Math.ceil(base * 0.1); i++) {
      price.push(baseline);
      baseline += pts;
    }
    
    setPriceList(price.reverse()); // Set state for Price
  }, [min]);

  return (
    <>
      <div className="price-table">
        {priceList && priceList.map((item, index) => (
          <div style={{height: `${100 / priceList.length}%`}} key={index}>
            {parseInt(item)}
          </div>
        ))}
      </div>
    </>
  );
}

export default PriceTable;