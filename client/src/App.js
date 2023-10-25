
import './App.css';
import React, { useEffect, useRef, useState } from "react";
import {Box,Spinner,Input,Image,Stack,Select,Text, Button,Heading,Textarea, flattenTokens} from "@chakra-ui/react"
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import ReactMarkdown from 'react-markdown'
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import Modal from "./components/Modal"
let baseUrl = "http://127.0.0.1:5000";
// {load?
//   <Spinner
//   thickness='4px'
//   speed='0.65s'
//   emptyColor='#B794F4'
//   color='#44337A'
//   size='xl'
// />

function App() {


const [load,setLoad] =useState(false);
let [chats,setChats]= useState(false);
const [start, setStart] =useState(false);
const [userData, setUserData] = useState(null);
const [typingData, setTypingData] = useState("");

const handleUserLogin = (data) => {
  setUserData(data); // Update user data in the main function's state
  //alert(JSON.stringify(userData,null,2))
};

// 
// if(userInfo && !chats ){}

useEffect(() => {
  // Check if user data exists in sessionStorage
  if (sessionStorage.getItem("user")) {
    const userInfo = JSON.parse(sessionStorage.getItem("user"));
    setChats(userInfo.chat_ids);
  }
}, []); 

if (sessionStorage.getItem("user") && !userData) {
  let ud = JSON.parse(sessionStorage.getItem("user"))
  setUserData(ud)
}

  // async function fetchAndUpdate(obj={},route="convert"){
  // try {
  //   setLoad(true)
  //   let res  = await fetch(`${baseUrl}/${route}`, {
  //     method: 'POST',
  //     body: JSON.stringify(
  //       obj
  //     ),
  //     headers: {
  //       'Content-type': 'application/json; charset=UTF-8',
  //     },
  //   })

  //   let data = await res.json();
    

    
  //   setLoad(false)
  // } catch (error) {
  //   console.log(error)
  // }
  // }
    const [scroll,setScrol] =useState(0)
    // Function to scroll to the bottom of the container
    const chatContainerRef = useRef(null);
    const scrollToBottom = () => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    };
  
    // Scroll to the bottom when messages change
    useEffect(() => {
      scrollToBottom();
    }, [scroll]);
    scrollToBottom();

  const [currentChat, setCurrentChat]=useState({data:[]})
  async function individualChatDataFetch(item){

      let res  = await fetch(`${baseUrl}/getChat/${item}`)
      
      let data1 = await res.json();
      
      setCurrentChat(data1)
      setStart(true)
  }

async function send(){
  let obj ={
    chatId : currentChat.chat._id,
    newMsg :{
    role : "user",
    content : typingData},

  }
  let nd1 = {...currentChat}
  setLoad(false)
  nd1.chat.data.push({
    role : "user",
    content : typingData})
  setCurrentChat (nd1)
  setLoad(true)
  // alert(JSON.stringify(obj))
    let res  = await fetch(`${baseUrl}`, {
      method: 'POST',
      body: JSON.stringify(
        obj
      ),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })

    let data = await res.json();
    // alert(JSON.stringify(data))
    let nd = {...currentChat}
    setLoad(false)
    nd.chat.data.push(data)
    setCurrentChat (nd)
    

}

async function newChat(){
      //alert(userData.user._id)
      let res  = await fetch(`${baseUrl}/newChat/${userData.user._id}`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
    let data = await res.json();
    if(data){
      async function login(){
      
        let res  = await fetch(`${baseUrl}/getUserData`, {
          method: 'POST',
          body: JSON.stringify({email:userData.user.email}),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        })
    
        let data = await res.json();
        // alert(JSON.stringify(data))
        sessionStorage.setItem("user",JSON.stringify(data))
        setUserData(data)
      }login()
    }
    //alert(JSON.stringify(data))
    
}

  return (
    <div  className="App">
      <Modal  onUserLogin={handleUserLogin}/>
    
      <Box borderBottomRadius={"5px"} width={"100%"} display={"flex"} justifyContent={"space-between"} 
       height={"95%"} backgroundColor={"#"}>
       <Box backgroundColor={"#fffefe"} className="shadow" display="flex" flexDirection={"column"}  justifyContent="flex-start"
         alignItems="center" p={4} pt={8} width={"25%"} borderRadius={"5px"} mt={3}>
        
        <Box onClick={newChat} color={"#000"}  backgroundColor={"#FCEA90"} display="flex" justifyContent="center"
         alignItems="center"  width={"95%"} borderRadius={"5px"} m={4} mt={0} mb={8} p={3} cursor={"pointer"} >
        new chat
        </Box>
        {/* <Box backgroundColor={"#56A7A7 "} display="flex" justifyContent="center"
         alignItems="center" width={"95%"} borderRadius={"5px"} m={4} mt={0}  p={3} cursor={"pointer"} >
        sgh
        </Box> */}
        {
        userData ?
        userData.user.chat_ids.map((item,i)=>{
          return <Box  onClick={(e)=>{individualChatDataFetch(item)}} backgroundColor={"#e9eeff"} color={"#5b078a"} display="flex" justifyContent="center"
          alignItems="center" width={"95%"} borderRadius={"5px"} m={4} mt={0}  p={3} cursor={"pointer"} >
         {item}
         </Box>
        })
        : <Box backgroundColor={"#56A7A7 "} display="flex" justifyContent="center"
        alignItems="center" width={"95%"} borderRadius={"5px"} m={4} mt={0}  p={3} cursor={"pointer"} >
       chats are loading.....
       </Box>
        
        }
          
       
      
    
        </Box>
        {
       !start?
       <Box backgroundColor={"#F9FBFC"}  padding={8} width={"74%"} borderRadius={"5px"}
       mt={3} display="flex" flexDir={"column"} alignItems="center" justifyContent="center">
        
        <Image width="50%" src='chatImage.svg' alt='select a chat to continue' />
         </Box>
       :
        
        <Box backgroundColor={"#F9FBFC"} className='shadow'  padding={8} width={"74%"} borderRadius={"5px"}
         mt={3} display="flex" flexDir={"column"} alignItems="center" justifyContent="center">
     
       
       {/* messages */}
     <Box  className='markDown'ref={chatContainerRef}  padding={2} width={"95%"} height={"90%"}
         mt={3} display="flex"  alignItems="space-between" >
      
   
       
       
       {
       currentChat.chat.data.map((item,i)=>{
        if(item.role=="user"){
          return     <Box
          padding={2}
          borderRadius="lg"
          boxShadow="md"
          bg="#e9eeff"
          maxWidth="90%"
          textAlign="left"
          height={"auto"}
          m={2}
          ml={20}
          
          mr={0}
          p={5}
          boxShadow="0px 1px 2px rgba(0, 0, 0, 0.1)"
        >
          <Text color={"#000"}>{item.content}</Text>
        </Box>
        }else {
          return  <Box
          className='chat-bubble'
          padding={6}
          borderRadius="lg"
          boxShadow="md"
          // backgroundColor={"#56A7A7 "} 
          color="white"
          maxWidth="90%"
          textAlign="left"
          marginBottom={3}
          mr={20}
          boxShadow="0px 1px 2px rgba(0, 0, 0, 0.1)"
          ml={0}
          mt={2}
          height={"auto"}
        >
          {/* <Text>{item.content}</Text> */}
        <ReactMarkdown className='markDown' renderers={{code:Component}} >
         {item.content}
        </ReactMarkdown>
        </Box>
        }
       })
      

      }
{/* chat animation */}
{
  load?
  <Box
          className='chat-bubble'
          padding={2}
          borderRadius="lg"
          boxShadow="md"
          // backgroundColor={"#56A7A7 "} 
          color="white"
          maxWidth="90%"
          textAlign="left"
          marginBottom={3}
          mr={20}
          pl={0}
        >
          {/* <Text>This is a message from the user.</Text> */}
          <div class="chat-bubble">
           <div class="typing">
             <div class="dot"></div>
             <div class="dot"></div>
             <div class="dot"></div>
             
           </div>
           </div>
        </Box>
  :""
}

       </Box>
      
     <Box backgroundColor={"#fff"} borderRadius="5px" p={2} width={"95%"}height={"10%"} borderRadius={"5px"}
         mt={3} display="flex" alignItems="center" justifyContent="space-between">
      <Input color={"#000"} width={"90%"}  onChange={(e)=>{setTypingData(e.target.value)}}  placeholder='Enter your message here . . . .' />
      <Button onClick={send} bgColor={"#FCEA90"}>send</Button>
       </Box>
      





        
        </Box>
}
      </Box>


    </div>
  );
}

const Component = ({value,language}) => {
 
  return (
    <SyntaxHighlighter language={language??""} style={docco}>
      {value??""}
    </SyntaxHighlighter>
  );
};



export default App;
