import React, { useState, createContext, useContext, useRef, useEffect, useReducer, useCallback, useMemo } from "react";
import Todos from "./Todos";

// USE EFFECT EXAMPLES ---------------------------------------


// function Timer() {
//     const [count, setCount] = useState(0);
  
//     useEffect(() => {
//       setTimeout(() => {
//         setCount((count) => count + 1);
//       }, 1000);
//     }, []);
  
//     return <h1>I've rendered {count} times!</h1>;
//   }


// function Timer() {
//     const [count, setCount] = useState(0);
//     const [calculation, setCalculation] = useState(0);
  
//     useEffect(() => {
//       setCalculation(() => count * 2);
//     }, [count]); // <- add the count variable here
  
//     return (
//       <>
//         <p>Count: {count}</p>
//         <button onClick={() => setCount((c) => c + 1)}>+</button>
//         <p>Calculation: {calculation}</p>
//       </>
//     );
//   }


//-------------------------useContext example----------------------------


// const UserContext = createContext();

// function Timer() {

//     const [user, setUser] = useState("Jesse Hall");

//     return (
//         <UserContext.Provider value={user}>
//             <h1>{`Hello ${user}!`}</h1>
//             <Component2 />
//         </UserContext.Provider>
//     );
// }

// function Component2() {
//     return (
//         <>
//             <h1>Component 2</h1>
//             <Component3 />
//         </>
//     );
// }

// function Component3() {
//     return (
//         <>
//             <h1>Component 3</h1>
//             <Component4 />
//         </>
//     );
// }

// function Component4() {
//     return (
//         <>
//             <h1>Component 4</h1>
//             <Component5 />
//         </>
//     );
// }

// function Component5() {
//     const user = useContext(UserContext);

//     return (
//         <>
//             <h1>Component 5</h1>
//             <h2>{`Hello ${user} again!`}</h2>
//         </>
//     );
// }

//----------------------useRef-------------------------------------



// function Timer() {
//   const [inputValue, setInputValue] = useState("");
//   const count = useRef(0);


//   useEffect(() => {
//     count.current = count.current + 1;
//   });

//   return (
//     <>
//       <input
//         type="text"
//         value={inputValue}
//         onChange={(e) => setInputValue(e.target.value)}
//       />
//       <h1>Render Count: {count.current}</h1>
//     </>
//   );
//}

// --------------------------useReducer----------------------------------

// const initialTodos = [
//     {
//       id: 1,
//       title: "Todo 1",
//       complete: false,
//     },
//     {
//       id: 2,
//       title: "Todo 2",
//       complete: false,
//     },
//   ];
  
//   const reducer = (state, action) => {
//     switch (action.type) {
//       case "COMPLETE":
//         return state.map((todo) => {
//           if (todo.id === action.id) {
//             return { ...todo, complete: !todo.complete };
//           } else {
//             return todo;
//           }
//         });
//       default:
//         return state;
//     }
//   };
  
//   function Timer() {
//     const [todos, dispatch] = useReducer(reducer, initialTodos);
  
//     const handleComplete = (todo) => {
//       dispatch({ type: "COMPLETE", id: todo.id });
//     };
  
//     return (
//       <>
//         {todos.map((todo) => (
//           <div key={todo.id}>
//             <label>
//               <input
//                 type="checkbox"
//                 checked={todo.complete}
//                 onChange={() => handleComplete(todo)}
//               />
//               {todo.title}
//             </label>
//           </div>
//         ))}
//       </>
//     );
//   }

//----------------------------useCallback w/ useMemo-------------------------------


const Timer = () => {
    const [count, setCount] = useState(0);
    const [todos, setTodos] = useState([]);
  
    const increment = () => {
      setCount((c) => c + 1);
    };
    const addTodo = useCallback(() => {
      setTodos((t) => [...t, "New Todo"]);
    }, [todos]);
  
    return (
      <>
        <Todos todos={todos} addTodo={addTodo} />
        <hr />
        <div>
          Count: {count}
          <button onClick={increment}>+</button>
        </div>
      </>
    );
  };
  
//----------------------------useMemo-----------------------------------

// const Timer = () => {
//     const [count, setCount] = useState(0);
//     const [todos, setTodos] = useState([]);
//     const calculation = useMemo(() => expensiveCalculation(count), [count]);
  
//     const increment = () => {
//       setCount((c) => c + 1);
//     };
//     const addTodo = () => {
//       setTodos((t) => [...t, "New Todo"]);
//     };
  
//     return (
//       <div>
//         <div>
//           <h2>My Todos</h2>
//           {todos.map((todo, index) => {
//             return <p key={index}>{todo}</p>;
//           })}
//           <button onClick={addTodo}>Add Todo</button>
//         </div>
//         <hr />
//         <div>
//           Count: {count}
//           <button onClick={increment}>+</button>
//           <h2>Expensive Calculation</h2>
//           {calculation}
//         </div>
//       </div>
//     );
//   };
  
//   const expensiveCalculation = (num) => {
//     console.log("Calculating...");
//     for (let i = 0; i < 1000000000; i++) {
//       num += 1;
//     }
//     return num;
//   };

export default Timer;