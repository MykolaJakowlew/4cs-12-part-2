import { useEffect, useRef, useState } from 'react';
import './style.css';
import axios from 'axios';

const Table = (props) => {
  const { table: originalTable, waiters } = props;
  const [wasChanged, setWasChanged] = useState(false);
  const [table, setTable] = useState(originalTable);
  console.log(originalTable);

  const selectRef = useRef();
  const apply = () => {
    axios.patch(`/tables/${table._id}`, {
      waiterId: selectRef.current.value
    }).then((response) => {
      props.setTables((prev) => {
        const state = prev
          .filter(e => e.tableId !== table.tableId);
        state.push(response.data);
        return state;
      });
      setWasChanged(false);
    });
  };

  const removeWaiter = () => {
    setTable({
      ...table,
      waiterId: undefined
    });
  };

  const waiter = table.waiterId && waiters.find(e => e._id === table.waiterId) || {};

  return (<div className='table'>
    <div>table id: {table.tableId}</div>
    <div>
      waiter id: {waiter.firstName || ''}
      {table.waiterId && <button onClick={removeWaiter}>clean</button>}
      {!table.waiterId &&
        <select ref={selectRef} name="waiter" onChange={() => setWasChanged(true)}>
          {waiters.map(waiter => (<option value={waiter._id}>{waiter.firstName}</option>))}
        </select>
      }
    </div>
    <div>orderId: {table.orderId}</div>
    <div>{wasChanged ? <button onClick={apply}>Apply</button> : null}</div>
  </div>);
};

const App = () => {
  /**
   * @type {[{tableId: number,waiterId:string,orderId:string}[]]}
   */
  const [waiters, setWaiters] = useState([]);
  const [tables, setTables] = useState([]);
  useEffect(() => {
    axios.get('/tables')
      .then(response => {
        const { data } = response;
        setTables((prev) => ([...prev, ...data]));
      });

    axios.get('/waiters').then((response) => {
      const { data } = response;
      setWaiters((prev) => ([...prev, ...data]));
    });
  }, []);

  const addTableInputRef = useRef();
  const addNewTable = () => {
    axios.post('/tables', {
      tableId: addTableInputRef.current.value
    }).then(response => {
      setTables((prev) => ([...prev, response.data]));
    });
  };

  const addWaiterInputRef = useRef();
  const addNewWaiter = () => {
    axios.post('/waiters', {
      firstName: addWaiterInputRef.current.value
    }).then(response => {
      setWaiters((prev) => ([...prev, response.data]));
    });
  };
  return (
    <>
      <div className='data_input'>
        <div>
          Table number: <input ref={addTableInputRef} type="number" />
          <button onClick={addNewTable}>Add new table</button>
        </div>
        <div>
          Waiter name: <input ref={addWaiterInputRef} type="text" />
          <button onClick={addNewWaiter}>Add new table</button>
        </div>
      </div>
      <div className='tables'>
        {tables.map(table => (<Table waiters={waiters} table={table} setTables={setTables} />))}
      </div>
    </>
  );
};

export default App;
