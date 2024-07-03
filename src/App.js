import Canvas from "./Canvas/Canvas";
import {useEffect,useState} from 'react';
import axios from 'axios';
import { Menu } from 'antd';
function getItem(label, key, children, type) {
  return{
    key,
    children,
    label,
    type,
  };
}


function App() {

  const [curlevels, setLevels] = useState([])
  const [curid, setid] = useState(10)
  const [curdata, setdata] = useState([null])
  var flag = false

  const fetchlist = () => {
    axios.get('http://127.0.0.1:5000/api/levels').then(r => {
      const all_levelsResponse = r.data
      const menuItems = [
        getItem('Список уровней','g1',
          all_levelsResponse.map(c => {
            return {label: c.id, key: c.id}
          }),'group'
        )
      ]
      setLevels(menuItems)
    })
  }

  const fetchlevel = () => {
    axios.get(`http://127.0.0.1:5000/api/levels/${curid}`).then(r => {
      setdata(r.data)
      flag = true
    })   
  }

  useEffect(() => {
    fetchlist()
  }, []);

  useEffect(() => {
    fetchlevel()
  }, [curid])

  const onClick = (e) => {
    setid(e.key)
  };

  const cell_size = 50

  const draw = (context) => {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height)
    for (let index_y = 0; index_y < curdata.size;index_y++) {
      for (let index_x = 0; index_x < curdata.size;index_x++) {
        if (curdata.body[curdata.size * index_y + index_x] == 0) {
          context.fillStyle = 'grey'
          context.fillRect(3 + index_x * cell_size,3 + 
                          index_y * cell_size,
                          cell_size-1,cell_size-1)
          }
        else {
          context.fillStyle = 'blue'
          context.fillRect(3 + index_x * cell_size,3 + 
                          index_y * cell_size,
                          cell_size-1,cell_size-1)
        }
      }
    }
    context.fillStyle='green'
    context.fillRect(3 + curdata.start_x * cell_size, 
                    3 + curdata.start_y * cell_size,
                    cell_size-1,cell_size-1)
    
    context.fillStyle='red'
    context.fillRect(3 + curdata.end_x * cell_size, 
                    3 + curdata.end_y * cell_size,
                    cell_size-1,cell_size-1)
  }

  


  return (
    <div className="flex float-left">
      <Menu 
        onClick={onClick}
        items={curlevels} 
        style={{ 
          width: 256,
        }} 
        defaultSelectedKeys={['1']} 
        defaultOpenKeys={['sub1']} 
        mode="inline" 
        className="h-screen overflow-scroll" 
      />
      <div className="mx-auto my-auto">
        <Canvas draw={draw} width="500" height="500" 
          style={{
          border:'1px solid black'
        }}/>
      </div>
    </div>
  );
}

export default App;
