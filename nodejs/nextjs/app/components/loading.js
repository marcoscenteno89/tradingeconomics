const Loading = (props) => {

  let ready = true;
  for (let i of props.require) {
    if (!i) ready = false;
  }
  return ready ? props.children : <div>Loading...</div> ;
  
}

export default Loading;