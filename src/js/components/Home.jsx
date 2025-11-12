import React, {useState, useEffect} from "react";

//include images into your bundle
import rigoImage from "../../img/rigo-baby.jpg";

const baseUrl = "https://playground.4geeks.com/todo";
const userName = "testuser"
//create your first component
const Home = () => {
	
	const [inputValue, setInputValue] = useState('');
	const [toDoList,setToDoList] = useState([]);
	const nextTask = async ()=>{
    if (!inputValue.trim()) return; 

    const newTask = {
        label: inputValue.trim(),
        is_done: false
    };

    try {
        const response = await fetch(`${baseUrl}/todos/${userName}`, {
            method: "POST",
            body: JSON.stringify(newTask),
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Error adding task: ${response.status}`);
        }
        
        setInputValue(""); 
        await loadTasks(); // Refresh list from server
        
    } catch (error) {
        console.error("Failed to add task:", error);
    }
}
	
	const createUser = async () => {
		try {
			const response = await fetch (`${baseUrl}/users/${userName}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				}
			});
			if (!response.ok) {
				if (response.status !== 400){
					throw new Error (`Error creating user: ${response.status}`);
				}
			}
			console.log(`User ${userName} setup complete!`)
		} catch (error) {
			console.error ("Failed to create user:", error);
		}
	};

// function to save new tasks to list
	const loadTasks = async () => {
		try {
			const response = await fetch (`${baseUrl}/users/${userName}`);
			if (response.status === 404){
				await createUser();
				return await loadTasks();
			}
			if (!response.ok){
				throw new Error(`Error loading tasks: ${response.status}`);
			}
			const data = await response.json();
			setToDoList (data.todos);
		} catch (error) {
			console.error ("Failed to fetch tasks:", error);
		}
	};

	useEffect(() => {
        loadTasks();
    }, []);
	
	const deleteInputValue = async (taskId) => {
		try {
            const response = await fetch(`${baseUrl}/todos/${taskId}`, {
                method: "DELETE"
            });
            
            if (!response.ok) {
                 // The API returns 204 No Content for success
                throw new Error(`Error deleting task: ${response.status}`);
            }

            await loadTasks(); // Refresh list from server

        } catch (error) {
            console.error("Failed to delete task:", error);
        }
    }

const clearAllTasks = async () => {
        const confirmClear = window.confirm("Are you sure you want to delete ALL tasks?");
        if (!confirmClear) return;

        try {
            const response = await fetch(`${baseUrl}/users/${userName}`, {
                method: "DELETE"
            });

            if (!response.ok) {
                throw new Error(`Error clearing all tasks: ${response.status}`);
            }
            
            await loadTasks(); // The list will be empty
            
        } catch (error) {
            console.error("Failed to clear all tasks:", error);
        }
    };

	return (
		<div className="text-center">
			<h1>To Do List</h1>
         <input value={inputValue}
		 	className="form-control" 
			type="text" 
			placeholder="Add a new task" 
			onChange={ (e) => {
					const newTask = e.target.value
					setInputValue(newTask)
			}

			}
				
		 	onKeyDown = {
				(e) => {
			if (e.key == 'Enter') {
				nextTask();
			}					
				} 
			}
			 />

		 
		<button className="btn btn-primary" onClick={()=> nextTask()}>
			Add task
		</button>

		 <ul className="list-group">
			{/* <li>Take out the trash</li> */}
			{toDoList.length === 0 ? (
				<li className="list-group-item text-muted">
					No tasks, add a new one!
				</li>
			) : (
				toDoList.map(
				(item, index)=> (
							<li key={item.id} 
							className="list-group-item d-flex justify-content-between align-items-center">
								{item.label}
							<span class="text-danger delete-icon" onClick={() => {
								deleteInputValue(item.id)}}>
									X
							 </span>
							 </li>
							)
						)
					)}
		 		</ul>

		 <div className="mt-3">
                <p className="text-muted">{toDoList.length} items left</p>
                {/* New "Clear All Tasks" Button */}
                <button 
                    className="btn btn-danger btn-sm" 
                    onClick={clearAllTasks}
                >
                    Clear All Tasks
                </button>
            </div>

		</div>
	);
};

export default Home;