'use client';
import React, { useState, useEffect } from 'react';
import WebForm from './form';
import { cloneDeep as cd } from 'lodash';
import { get } from "@marccent/util";
import Loading from './loading';
import { GraphWithCanvas } from './canvas';
import PriceTable from './price-table';
import DateTable from './date-table';
import dayjs from 'dayjs';

/**
 * TEComponent is a React component that displays ticker data from an API.
 * 
 * @returns {JSX.Element} The TEComponent JSX element.
 */

const TEComponent = () => {

  // Declare State
  // Base value for price table
  // base controls the number of price points displayed in the price table
  const [ base ] = useState(100);
  const [ err, setErr ] = useState(false);
  const [ data, setData ] = useState({
    min: null,
    max: null,
    dateList: null,
    ticker: null
  });

  useEffect(() => getTicker('gmexicob:mm', null), []);
  
  /**
   * Retrieves ticker data from the API and updates the component state.
   * 
   * @param {string} ticker - The ticker symbol.
   * @param {HTMLElement} field - The input field element.
   * @returns {void}
   */

  const getTicker = (ticker, field) => {
    const obj = {}
    try {
      get(`api/${ticker}/`).then(res => {
        if (Array.isArray(res)) {
          setErr(false);
          const dt = res.filter(i => i.Close !== null).reverse();
          if (dt.length > 0) {
            // Convert date strings to date objects
            const dates = [];
            for (let i of dt) {
              const dateArr = i.Date.split('/');
              i.Date = dayjs(`${dateArr[1]}/${dateArr[0]}/${dateArr[2]}`);
              dates.push(i.Date);
            }

            // Generate data object and set state
            obj.min = dt.reduce((min, i) => i.Close < min.Close ? i : min).Close;
            obj.max = dt.reduce((max, i) => i.Close > max.Close ? i : max).Close;
            obj.dateList = dates;
            obj.data = dt;
            obj.ticker = ticker;
            setData(cd(obj));
          } else {
            if (field) {
              // Display error message in input field
              field.value = '';
              field.placeholder = res[0].Symbol;
              field.classList.add('bg-danger');
            }
          }
        } else {
          // Most likely a server error
          setData(true);
          setErr(true);
          console.log(res);
        }
      });
    } catch (error) {
      setData(true);
      setErr(true);
      console.error(error);
    }
  };

  /**
   * Handles the click event.
   *
   * @param {Object} data - The data object containing search value and reference.
   * @returns {void}
   */

  const onClick = (data) => getTicker(data.search.value, data.search.ref);
  
  return (
    <Loading require={[data.ticker]}>
      {err ? <div className="alert alert-danger">Server Error</div> :
        <>
        <h2>{data.ticker}</h2>
        <WebForm className="col-12 single-line-form" callBack={onClick}>
          <input type="text" name="search" no-label required />
        </WebForm>
        <div className="graph-container">
          <GraphWithCanvas obj={data} pts={(data.max - data.min) / base} base={base} />
          <PriceTable base={base} min={data.min} pts={((data.max - data.min) / base) * 10} />
          <DateTable dateList={data.dateList} />
        </div>
        </>
      }
    </Loading>
  );
}

export default TEComponent;