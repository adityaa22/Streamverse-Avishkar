import  React, { useState, useEffect, useRef } from 'react';
import TodoCreator from "./FormInput";
import TodoList from "./List";

import './form.css';
import axios from 'axios';

import { createTheme } from '@material-ui/core/styles';
const theme = createTheme({
    palette: {
        primary: { main: '#000000' },
    },
});

const Form = ({playlists, setPlaylists, videoId}) => {
    
    // To store name of new playlist
    const [ newPlaylist, setNewPlaylist ] = useState('');

    const inputRef = useRef();
    const noteRef = useRef({});
    const [ isInputEmpty, setInputEmpty ] = useState(false)
    
    
    const updatePlaylists = async ()=>{
        console.log('playlists from updatePlaylists: ', playlists);    
        const res = await axios.post("http://localhost:9002/updateplaylists", { updatedPlaylists: playlists }, {
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('userTokenTime')).token
            }
        })    
    }

    useEffect(()=>{
        console.log('playlists: ',playlists);
        if(playlists!=null)
            updatePlaylists();
    },[playlists])
    // create button click in creating new playlist.
    const handleSubmit = e => {
        e.preventDefault();
        addTodo(newPlaylist);
        clearInput();
        inputRef.current.focus();
    };

    const preventSubmit = e => {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    };

    // adding new playlist to playlists array.
    const addTodo = text => {
        if ( text !== '') {
            const tempPlaylists = [...playlists, { name:text,videos:[] }]
            setNewPlaylist({})
            // console.log('tempPlaylists: ', tempPlaylists);

            setPlaylists(tempPlaylists);
            // update this new playlist in database
        } else {
            console.log('name', text)
            setInputEmpty(true);
        }
    };
    
    // delete a playlist
    const removeTodo = inx => {
        const newArr = [...playlists]
        newArr.splice(inx, 1)
        setPlaylists(newArr);

        // updatePlaylists();
    }

    // add current video to playlist.
    const completeTodo = inx => {
        const tempPlaylists = [...playlists];
        tempPlaylists[inx].isCompleted = !tempPlaylists[inx].isCompleted;
        setPlaylists(tempPlaylists);

        // playlists[inx].videos me agr videoId nhi preseent hai to daal do, agr present hai to nikaal do.
        // console.log(videoId);
        // let videoInx = tempPlaylists[inx].videos.indexOf(videoId);
        // videoInx === -1 ? tempPlaylists[inx].videos.push(videoId) : tempPlaylists[inx].videos.splice(videoInx,1);
        // setPlaylists(playlists);
    };

    // rename playlist
    const editTodo = inx => {
        const tempPlaylists = [...playlists];
        tempPlaylists[inx].isEditing = !tempPlaylists[inx].isEditing;
        setPlaylists(tempPlaylists);
    }

    // save new name of playlist after editing.
    const saveTodo = (inx) => {
        const tempPlaylists = [...playlists];
        tempPlaylists[inx].isEditing = !tempPlaylists[inx].isEditing;
        tempPlaylists[inx].name = noteRef.current[inx].value;
        setPlaylists(tempPlaylists);
    }

    const clearInput = () => {
        setNewPlaylist('');
    }

    // setNewPlaylist whose name is entered in input box
    const setTodo = text => {
        setInputEmpty(false);
        setNewPlaylist(text);
    }

    useEffect(() => {
        console.log(newPlaylist);
    }, [newPlaylist])

    return (
        <div>
            <h1 className=''>Add to</h1>
            <form onSubmit={handleSubmit} className="form">


                <TodoList
                    theme={theme}
                    playlists={playlists}
                    completeTodo={completeTodo}
                    editTodo={editTodo}
                    deleteTodo={removeTodo}
                    saveTodo={saveTodo}
                    noteRef={noteRef}
                    preventSubmit={preventSubmit}
                />
                <TodoCreator
                    theme={theme}
                    newPlaylist={newPlaylist}
                    setTodo={setTodo}
                    clearInput={clearInput}
                    inputRef={inputRef}
                    isInputEmpty={isInputEmpty}
                    preventSubmit={preventSubmit}
                />
            </form>
        </div>
    )
}

export default Form;